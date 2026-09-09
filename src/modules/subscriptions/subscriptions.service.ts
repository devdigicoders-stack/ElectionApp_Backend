import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionStatus,
  PaymentMethod,
} from './subscription.schema';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { Plan, PlanDocument, BillingCycle } from '../plans/plan.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import {
  CreateSubscriptionDto,
  RenewSubscriptionDto,
  UpgradePlanDto,
  ExtendTrialDto,
  CancelSubscriptionDto,
  PauseSubscriptionDto,
  QuerySubscriptionsDto,
} from './subscription.dto';
import { TenantStatus, FeatureKey } from '../../shared/types';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Tenant.name)
    private tenantModel: Model<TenantDocument>,
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
    @InjectModel(TenantFeature.name)
    private featureModel: Model<TenantFeatureDocument>,
  ) {}

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.subscriptionModel.countDocuments();
    return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  private async syncTenantFeatures(tenantId: Types.ObjectId, planFeatures: string[]) {
    const allFeatureKeys = Object.values(FeatureKey);
    const enabledSet = new Set(planFeatures || []);

    for (const featureKey of allFeatureKeys) {
      const isEnabled = enabledSet.has(featureKey);
      await this.featureModel.updateOne(
        { tenantId, featureKey },
        {
          $set: {
            tenantId,
            featureKey,
            isEnabled,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date(), config: {} },
        },
        { upsert: true },
      );
    }
  }

  async create(dto: CreateSubscriptionDto, performedBy: string = 'super_admin') {
    if (!Types.ObjectId.isValid(dto.tenantId)) {
      throw new BadRequestException('Invalid tenant ID format');
    }
    if (!Types.ObjectId.isValid(dto.planId)) {
      throw new BadRequestException('Invalid plan ID format');
    }

    const [tenant, plan] = await Promise.all([
      this.tenantModel.findById(dto.tenantId),
      this.planModel.findById(dto.planId),
    ]);

    if (!tenant) throw new NotFoundException('Tenant not found');
    if (!plan) throw new NotFoundException('Plan not found');

    const now = new Date();
    let startDate = now;
    let endDate: Date;
    let trialEndsAt: Date | undefined = undefined;
    let status = SubscriptionStatus.ACTIVE;

    if (dto.isTrial) {
      status = SubscriptionStatus.TRIALING;
      const trialDays = dto.trialDays !== undefined ? dto.trialDays : plan.trialDays;
      endDate = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
      trialEndsAt = endDate;
    } else {
      let months = dto.durationMonths;
      if (!months) {
        switch (plan.billingCycle) {
          case BillingCycle.MONTHLY:
            months = 1;
            break;
          case BillingCycle.QUARTERLY:
            months = 3;
            break;
          case BillingCycle.YEARLY:
          default:
            months = 12;
            break;
        }
      }
      endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + months);
    }

    const invoiceNumber = await this.generateInvoiceNumber();
    const amountPaid = dto.amountPaid !== undefined ? dto.amountPaid : (dto.isTrial ? 0 : plan.price);
    const billingCycle = dto.billingCycle || plan.billingCycle;

    // Expire any existing active subscriptions for this tenant
    await this.subscriptionModel.updateMany(
      {
        tenantId: tenant._id,
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
      },
      {
        $set: { status: SubscriptionStatus.EXPIRED },
        $push: {
          timeline: {
            action: 'replaced',
            performedBy,
            timestamp: now,
            note: `Replaced by new subscription ${invoiceNumber}`,
          },
        },
      },
    );

    const subscription = await this.subscriptionModel.create({
      tenantId: tenant._id,
      planId: plan._id,
      status,
      billingCycle,
      amountPaid,
      currency: plan.currency || 'INR',
      startDate,
      endDate,
      trialEndsAt,
      paymentMethod: dto.isTrial ? PaymentMethod.FREE_TRIAL : (dto.paymentMethod || PaymentMethod.BANK_TRANSFER),
      paymentReference: dto.paymentReference || '',
      invoiceNumber,
      notes: dto.notes || '',
      timeline: [
        {
          action: 'created',
          toPlanId: plan._id,
          toStatus: status,
          performedBy,
          timestamp: now,
          note: dto.isTrial
            ? `Started ${dto.trialDays || plan.trialDays}-day free trial`
            : `Subscribed to ${plan.name} (${billingCycle})`,
        },
      ],
    });

    // Update Tenant state
    tenant.planId = plan._id as any;
    tenant.status = dto.isTrial ? TenantStatus.TRIAL : TenantStatus.ACTIVE;
    tenant.trialEndsAt = trialEndsAt;
    (tenant as any).subscriptionStartsAt = startDate;
    (tenant as any).subscriptionEndsAt = endDate;
    await tenant.save();

    // Auto-provision plan features
    await this.syncTenantFeatures(tenant._id as any, plan.features);

    return this.findOne((subscription as any)._id.toString());
  }

  async findAll(query: QuerySubscriptionsDto) {
    const { status, tenantId, planId, expiringInDays, search, page = 1, limit = 20 } = query;
    const filter: any = {};

    if (status) filter.status = status;
    if (tenantId && Types.ObjectId.isValid(tenantId)) filter.tenantId = new Types.ObjectId(tenantId);
    if (planId && Types.ObjectId.isValid(planId)) filter.planId = new Types.ObjectId(planId);

    if (expiringInDays) {
      const now = new Date();
      const targetDate = new Date(now.getTime() + expiringInDays * 24 * 60 * 60 * 1000);
      filter.endDate = { $gte: now, $lte: targetDate };
      if (!status) filter.status = { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] };
    }

    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { paymentReference: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.subscriptionModel
        .find(filter)
        .populate('tenantId', 'name slug branding status customDomain')
        .populate('planId', 'name slug price billingCycle features limits')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.subscriptionModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getExpiringSoon(days: number = 7) {
    const now = new Date();
    const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return this.subscriptionModel
      .find({
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
        endDate: { $gte: now, $lte: targetDate },
      })
      .populate('tenantId', 'name slug branding status')
      .populate('planId', 'name slug price billingCycle')
      .sort({ endDate: 1 });
  }

  async getStats() {
    const now = new Date();
    const next15Days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

    const [statusCounts, expiringCount, revenueResult, totalSubscriptions] = await Promise.all([
      this.subscriptionModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.subscriptionModel.countDocuments({
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
        endDate: { $gte: now, $lte: next15Days },
      }),
      this.subscriptionModel.aggregate([
        { $match: { status: { $ne: SubscriptionStatus.TRIALING } } },
        { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } },
      ]),
      this.subscriptionModel.countDocuments(),
    ]);

    const statusMap = statusCounts.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSubscriptions,
      active: statusMap[SubscriptionStatus.ACTIVE] || 0,
      trialing: statusMap[SubscriptionStatus.TRIALING] || 0,
      expired: statusMap[SubscriptionStatus.EXPIRED] || 0,
      canceled: statusMap[SubscriptionStatus.CANCELED] || 0,
      paused: statusMap[SubscriptionStatus.PAUSED] || 0,
      pastDue: statusMap[SubscriptionStatus.PAST_DUE] || 0,
      expiringIn15Days: expiringCount,
      totalRevenueCollected: revenueResult[0]?.totalRevenue || 0,
    };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid subscription ID format');
    }

    const subscription = await this.subscriptionModel
      .findById(id)
      .populate('tenantId', 'name slug branding status customDomain settings')
      .populate('planId', 'name slug price billingCycle features limits trialDays')
      .populate('timeline.fromPlanId', 'name slug')
      .populate('timeline.toPlanId', 'name slug');

    if (!subscription) {
      throw new NotFoundException('Subscription record not found');
    }

    return subscription;
  }

  async findByTenant(tenantId: string) {
    if (!Types.ObjectId.isValid(tenantId)) {
      throw new BadRequestException('Invalid tenant ID format');
    }

    return this.subscriptionModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate('planId', 'name slug price billingCycle features limits')
      .sort({ createdAt: -1 });
  }

  async renew(id: string, dto: RenewSubscriptionDto, performedBy: string = 'super_admin') {
    const subscription = await this.findOne(id);
    const plan = await this.planModel.findById(subscription.planId);
    if (!plan) throw new NotFoundException('Associated plan not found');

    const now = new Date();
    const currentEnd = new Date(subscription.endDate);
    const baseDate = currentEnd > now ? currentEnd : now;

    const newEndDate = new Date(baseDate);
    newEndDate.setMonth(newEndDate.getMonth() + dto.durationMonths);

    const prevStatus = subscription.status;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.endDate = newEndDate;
    subscription.amountPaid += dto.amountPaid !== undefined ? dto.amountPaid : plan.price;
    if (dto.paymentMethod) subscription.paymentMethod = dto.paymentMethod;
    if (dto.paymentReference) subscription.paymentReference = dto.paymentReference;
    if (dto.notes) subscription.notes = (subscription.notes ? subscription.notes + ' | ' : '') + dto.notes;

    subscription.timeline.push({
      action: 'renewed',
      fromStatus: prevStatus,
      toStatus: SubscriptionStatus.ACTIVE,
      performedBy,
      timestamp: now,
      note: `Renewed for ${dto.durationMonths} months until ${newEndDate.toISOString().split('T')[0]}. Amount: ${dto.amountPaid || plan.price}`,
    });

    await subscription.save();

    // Update Tenant
    await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
      $set: {
        status: TenantStatus.ACTIVE,
        subscriptionEndsAt: newEndDate,
      },
    });

    // Re-provision features
    await this.syncTenantFeatures(subscription.tenantId as any, plan.features);

    return {
      message: `Subscription renewed successfully until ${newEndDate.toISOString().split('T')[0]}`,
      subscription,
    };
  }

  async upgrade(id: string, dto: UpgradePlanDto, performedBy: string = 'super_admin') {
    if (!Types.ObjectId.isValid(dto.newPlanId)) {
      throw new BadRequestException('Invalid new plan ID format');
    }

    const [subscription, newPlan] = await Promise.all([
      this.findOne(id),
      this.planModel.findById(dto.newPlanId),
    ]);

    if (!newPlan) throw new NotFoundException('New plan not found');

    const now = new Date();
    const prevPlanId = subscription.planId._id;

    subscription.planId = newPlan._id as any;
    subscription.billingCycle = newPlan.billingCycle;
    if (dto.amountPaid !== undefined) subscription.amountPaid += dto.amountPaid;
    if (dto.paymentMethod) subscription.paymentMethod = dto.paymentMethod;
    if (dto.paymentReference) subscription.paymentReference = dto.paymentReference;
    if (dto.notes) subscription.notes = (subscription.notes ? subscription.notes + ' | ' : '') + dto.notes;

    if (dto.durationMonths) {
      const newEnd = new Date(now);
      newEnd.setMonth(newEnd.getMonth() + dto.durationMonths);
      subscription.endDate = newEnd;
    }

    subscription.status = SubscriptionStatus.ACTIVE;

    subscription.timeline.push({
      action: 'upgraded',
      fromPlanId: prevPlanId,
      toPlanId: newPlan._id as any,
      fromStatus: subscription.status,
      toStatus: SubscriptionStatus.ACTIVE,
      performedBy,
      timestamp: now,
      note: `Plan changed to '${newPlan.name}'`,
    });

    await subscription.save();

    // Update Tenant
    await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
      $set: {
        planId: newPlan._id,
        status: TenantStatus.ACTIVE,
        ...(dto.durationMonths && { subscriptionEndsAt: subscription.endDate }),
      },
    });

    // Re-provision features based on new plan
    await this.syncTenantFeatures(subscription.tenantId as any, newPlan.features);

    return {
      message: `Subscription upgraded to '${newPlan.name}' successfully`,
      subscription,
      featuresProvisioned: newPlan.features,
    };
  }

  async extendTrial(id: string, dto: ExtendTrialDto, performedBy: string = 'super_admin') {
    const subscription = await this.findOne(id);
    const now = new Date();

    const currentTrialEnd = subscription.trialEndsAt || subscription.endDate || now;
    const baseDate = currentTrialEnd > now ? currentTrialEnd : now;

    const newTrialEnd = new Date(baseDate.getTime() + dto.additionalDays * 24 * 60 * 60 * 1000);

    subscription.trialEndsAt = newTrialEnd;
    subscription.endDate = newTrialEnd;
    subscription.status = SubscriptionStatus.TRIALING;

    subscription.timeline.push({
      action: 'trial_extended',
      performedBy,
      timestamp: now,
      note: `Trial extended by ${dto.additionalDays} days until ${newTrialEnd.toISOString().split('T')[0]}. ${dto.notes || ''}`.trim(),
    });

    await subscription.save();

    await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
      $set: {
        status: TenantStatus.TRIAL,
        trialEndsAt: newTrialEnd,
        subscriptionEndsAt: newTrialEnd,
      },
    });

    return {
      message: `Trial extended by ${dto.additionalDays} days until ${newTrialEnd.toISOString().split('T')[0]}`,
      subscription,
    };
  }

  async cancel(id: string, dto: CancelSubscriptionDto, performedBy: string = 'super_admin') {
    const subscription = await this.findOne(id);
    const now = new Date();

    subscription.status = SubscriptionStatus.CANCELED;
    subscription.cancelledAt = now;
    subscription.cancelReason = dto.reason;

    subscription.timeline.push({
      action: 'canceled',
      fromStatus: subscription.status,
      toStatus: SubscriptionStatus.CANCELED,
      performedBy,
      timestamp: now,
      note: `Canceled. Reason: ${dto.reason}`,
    });

    await subscription.save();

    if (dto.immediate) {
      await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
        $set: { status: TenantStatus.SUSPENDED },
      });
    }

    return {
      message: 'Subscription canceled successfully',
      subscription,
    };
  }

  async pause(id: string, dto: PauseSubscriptionDto, performedBy: string = 'super_admin') {
    const subscription = await this.findOne(id);
    const now = new Date();

    const prevStatus = subscription.status;
    subscription.status = SubscriptionStatus.PAUSED;
    subscription.pausedAt = now;

    subscription.timeline.push({
      action: 'paused',
      fromStatus: prevStatus,
      toStatus: SubscriptionStatus.PAUSED,
      performedBy,
      timestamp: now,
      note: dto.reason || 'Subscription paused by Super Admin',
    });

    await subscription.save();

    await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
      $set: { status: TenantStatus.SUSPENDED },
    });

    return {
      message: 'Subscription paused and tenant access suspended',
      subscription,
    };
  }

  async resume(id: string, performedBy: string = 'super_admin') {
    const subscription = await this.findOne(id);
    const now = new Date();

    const prevStatus = subscription.status;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.pausedAt = null as any;

    subscription.timeline.push({
      action: 'resumed',
      fromStatus: prevStatus,
      toStatus: SubscriptionStatus.ACTIVE,
      performedBy,
      timestamp: now,
      note: 'Subscription resumed by Super Admin',
    });

    await subscription.save();

    await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
      $set: { status: TenantStatus.ACTIVE },
    });

    return {
      message: 'Subscription resumed successfully',
      subscription,
    };
  }

  async getCurrentForTenant(tenant: TenantDocument) {
    const now = new Date();
    const subscription = await this.subscriptionModel
      .findOne({
        tenantId: tenant._id,
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING, SubscriptionStatus.PAUSED] },
      })
      .populate('planId', 'name slug price billingCycle features limits trialDays')
      .sort({ createdAt: -1 });

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        tenantStatus: tenant.status,
        message: 'No active subscription found for this account',
      };
    }

    const end = new Date(subscription.endDate);
    const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      hasActiveSubscription: true,
      subscriptionId: subscription._id,
      status: subscription.status,
      plan: subscription.planId,
      billingCycle: subscription.billingCycle,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      daysRemaining,
      isTrial: subscription.status === SubscriptionStatus.TRIALING,
      autoRenew: subscription.autoRenew,
      invoiceNumber: subscription.invoiceNumber,
    };
  }
}

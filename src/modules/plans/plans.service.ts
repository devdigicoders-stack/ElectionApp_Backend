import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Plan, PlanDocument } from './plan.schema';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import { CreatePlanDto, UpdatePlanDto, AssignPlanDto } from './plan.dto';
import { TenantStatus, FeatureKey } from '../../shared/types';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(TenantFeature.name) private featureModel: Model<TenantFeatureDocument>,
  ) {}

  async create(dto: CreatePlanDto): Promise<PlanDocument> {
    const slug = dto.slug.toLowerCase().trim();
    const existing = await this.planModel.findOne({ slug });
    if (existing) {
      throw new ConflictException(`Plan with slug '${slug}' already exists`);
    }

    return this.planModel.create({
      ...dto,
      slug,
    });
  }

  async findAll(filter?: { isActive?: boolean }): Promise<PlanDocument[]> {
    const query: any = {};
    if (filter?.isActive !== undefined) {
      query.isActive = filter.isActive;
    }
    return this.planModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
  }

  async findOne(id: string): Promise<PlanDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid plan ID format');
    }
    const plan = await this.planModel.findById(id);
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async findBySlug(slug: string): Promise<PlanDocument> {
    const plan = await this.planModel.findOne({ slug: slug.toLowerCase() });
    if (!plan) {
      throw new NotFoundException(`Subscription plan '${slug}' not found`);
    }
    return plan;
  }

  async update(id: string, dto: UpdatePlanDto): Promise<PlanDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid plan ID format');
    }

    const plan = await this.planModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid plan ID format');
    }

    // Check if any tenant is using this plan
    const inUse = await this.tenantModel.countDocuments({ planId: id });
    if (inUse > 0) {
      throw new ConflictException(
        `Cannot delete plan. It is currently assigned to ${inUse} tenant(s). Please deactivate it instead or reassign tenants.`,
      );
    }

    const deleted = await this.planModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Subscription plan not found');
    }

    return { message: 'Subscription plan deleted successfully', deletedId: id };
  }

  async toggleActive(id: string, isActive: boolean): Promise<PlanDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid plan ID format');
    }

    const plan = await this.planModel.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true },
    );
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async assignPlanToTenant(tenantId: string, dto: AssignPlanDto) {
    if (!Types.ObjectId.isValid(tenantId)) {
      throw new BadRequestException('Invalid tenant ID format');
    }
    if (!Types.ObjectId.isValid(dto.planId)) {
      throw new BadRequestException('Invalid plan ID format');
    }

    const [tenant, plan] = await Promise.all([
      this.tenantModel.findById(tenantId),
      this.planModel.findById(dto.planId),
    ]);

    if (!tenant) throw new NotFoundException('Tenant not found');
    if (!plan) throw new NotFoundException('Subscription plan not found');

    const now = new Date();
    tenant.planId = plan._id as any;

    if (dto.isTrial) {
      const trialDays = dto.trialDays !== undefined ? dto.trialDays : plan.trialDays;
      const trialEnds = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
      tenant.trialEndsAt = trialEnds;
      tenant.status = TenantStatus.TRIAL;
      (tenant as any).subscriptionStartsAt = now;
      (tenant as any).subscriptionEndsAt = trialEnds;
    } else {
      let months = dto.durationMonths;
      if (!months) {
        // default duration based on plan's billing cycle
        switch (plan.billingCycle) {
          case 'monthly':
            months = 1;
            break;
          case 'quarterly':
            months = 3;
            break;
          case 'yearly':
          default:
            months = 12;
            break;
        }
      }

      const subscriptionEnds = new Date(now);
      subscriptionEnds.setMonth(subscriptionEnds.getMonth() + months);

      (tenant as any).subscriptionStartsAt = now;
      (tenant as any).subscriptionEndsAt = subscriptionEnds;
      tenant.status = dto.status || TenantStatus.ACTIVE;
    }

    await tenant.save();

    // Automatically sync / provision the plan's features to the tenant
    const allFeatureKeys = Object.values(FeatureKey);
    const planFeatures = new Set(plan.features || []);

    for (const featureKey of allFeatureKeys) {
      const shouldEnable = planFeatures.has(featureKey);
      await this.featureModel.updateOne(
        { tenantId: tenant._id, featureKey },
        {
          $set: {
            tenantId: tenant._id,
            featureKey,
            isEnabled: shouldEnable,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date(), config: {} },
        },
        { upsert: true },
      );
    }

    const updatedTenant = await this.tenantModel
      .findById(tenantId)
      .populate('planId', 'name slug price billingCycle features limits');

    return {
      message: `Plan '${plan.name}' assigned to tenant '${tenant.name}' successfully`,
      tenant: updatedTenant,
      featuresProvisioned: plan.features,
    };
  }
}

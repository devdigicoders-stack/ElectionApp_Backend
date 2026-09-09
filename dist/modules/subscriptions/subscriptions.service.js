"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_schema_1 = require("./subscription.schema");
const tenant_schema_1 = require("../tenants/tenant.schema");
const plan_schema_1 = require("../plans/plan.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const types_1 = require("../../shared/types");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionModel, tenantModel, planModel, featureModel) {
        this.subscriptionModel = subscriptionModel;
        this.tenantModel = tenantModel;
        this.planModel = planModel;
        this.featureModel = featureModel;
    }
    async generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const count = await this.subscriptionModel.countDocuments();
        return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    async syncTenantFeatures(tenantId, planFeatures) {
        const allFeatureKeys = Object.values(types_1.FeatureKey);
        const enabledSet = new Set(planFeatures || []);
        for (const featureKey of allFeatureKeys) {
            const isEnabled = enabledSet.has(featureKey);
            await this.featureModel.updateOne({ tenantId, featureKey }, {
                $set: {
                    tenantId,
                    featureKey,
                    isEnabled,
                    updatedAt: new Date(),
                },
                $setOnInsert: { createdAt: new Date(), config: {} },
            }, { upsert: true });
        }
    }
    async create(dto, performedBy = 'super_admin') {
        if (!mongoose_2.Types.ObjectId.isValid(dto.tenantId)) {
            throw new common_1.BadRequestException('Invalid tenant ID format');
        }
        if (!mongoose_2.Types.ObjectId.isValid(dto.planId)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const [tenant, plan] = await Promise.all([
            this.tenantModel.findById(dto.tenantId),
            this.planModel.findById(dto.planId),
        ]);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        if (!plan)
            throw new common_1.NotFoundException('Plan not found');
        const now = new Date();
        let startDate = now;
        let endDate;
        let trialEndsAt = undefined;
        let status = subscription_schema_1.SubscriptionStatus.ACTIVE;
        if (dto.isTrial) {
            status = subscription_schema_1.SubscriptionStatus.TRIALING;
            const trialDays = dto.trialDays !== undefined ? dto.trialDays : plan.trialDays;
            endDate = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
            trialEndsAt = endDate;
        }
        else {
            let months = dto.durationMonths;
            if (!months) {
                switch (plan.billingCycle) {
                    case plan_schema_1.BillingCycle.MONTHLY:
                        months = 1;
                        break;
                    case plan_schema_1.BillingCycle.QUARTERLY:
                        months = 3;
                        break;
                    case plan_schema_1.BillingCycle.YEARLY:
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
        await this.subscriptionModel.updateMany({
            tenantId: tenant._id,
            status: { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING] },
        }, {
            $set: { status: subscription_schema_1.SubscriptionStatus.EXPIRED },
            $push: {
                timeline: {
                    action: 'replaced',
                    performedBy,
                    timestamp: now,
                    note: `Replaced by new subscription ${invoiceNumber}`,
                },
            },
        });
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
            paymentMethod: dto.isTrial ? subscription_schema_1.PaymentMethod.FREE_TRIAL : (dto.paymentMethod || subscription_schema_1.PaymentMethod.BANK_TRANSFER),
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
        tenant.planId = plan._id;
        tenant.status = dto.isTrial ? types_1.TenantStatus.TRIAL : types_1.TenantStatus.ACTIVE;
        tenant.trialEndsAt = trialEndsAt;
        tenant.subscriptionStartsAt = startDate;
        tenant.subscriptionEndsAt = endDate;
        await tenant.save();
        await this.syncTenantFeatures(tenant._id, plan.features);
        return this.findOne(subscription._id.toString());
    }
    async findAll(query) {
        const { status, tenantId, planId, expiringInDays, search, page = 1, limit = 20 } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (tenantId && mongoose_2.Types.ObjectId.isValid(tenantId))
            filter.tenantId = new mongoose_2.Types.ObjectId(tenantId);
        if (planId && mongoose_2.Types.ObjectId.isValid(planId))
            filter.planId = new mongoose_2.Types.ObjectId(planId);
        if (expiringInDays) {
            const now = new Date();
            const targetDate = new Date(now.getTime() + expiringInDays * 24 * 60 * 60 * 1000);
            filter.endDate = { $gte: now, $lte: targetDate };
            if (!status)
                filter.status = { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING] };
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
    async getExpiringSoon(days = 7) {
        const now = new Date();
        const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return this.subscriptionModel
            .find({
            status: { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING] },
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
                status: { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING] },
                endDate: { $gte: now, $lte: next15Days },
            }),
            this.subscriptionModel.aggregate([
                { $match: { status: { $ne: subscription_schema_1.SubscriptionStatus.TRIALING } } },
                { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } },
            ]),
            this.subscriptionModel.countDocuments(),
        ]);
        const statusMap = statusCounts.reduce((acc, s) => {
            acc[s._id] = s.count;
            return acc;
        }, {});
        return {
            totalSubscriptions,
            active: statusMap[subscription_schema_1.SubscriptionStatus.ACTIVE] || 0,
            trialing: statusMap[subscription_schema_1.SubscriptionStatus.TRIALING] || 0,
            expired: statusMap[subscription_schema_1.SubscriptionStatus.EXPIRED] || 0,
            canceled: statusMap[subscription_schema_1.SubscriptionStatus.CANCELED] || 0,
            paused: statusMap[subscription_schema_1.SubscriptionStatus.PAUSED] || 0,
            pastDue: statusMap[subscription_schema_1.SubscriptionStatus.PAST_DUE] || 0,
            expiringIn15Days: expiringCount,
            totalRevenueCollected: revenueResult[0]?.totalRevenue || 0,
        };
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid subscription ID format');
        }
        const subscription = await this.subscriptionModel
            .findById(id)
            .populate('tenantId', 'name slug branding status customDomain settings')
            .populate('planId', 'name slug price billingCycle features limits trialDays')
            .populate('timeline.fromPlanId', 'name slug')
            .populate('timeline.toPlanId', 'name slug');
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription record not found');
        }
        return subscription;
    }
    async findByTenant(tenantId) {
        if (!mongoose_2.Types.ObjectId.isValid(tenantId)) {
            throw new common_1.BadRequestException('Invalid tenant ID format');
        }
        return this.subscriptionModel
            .find({ tenantId: new mongoose_2.Types.ObjectId(tenantId) })
            .populate('planId', 'name slug price billingCycle features limits')
            .sort({ createdAt: -1 });
    }
    async renew(id, dto, performedBy = 'super_admin') {
        const subscription = await this.findOne(id);
        const plan = await this.planModel.findById(subscription.planId);
        if (!plan)
            throw new common_1.NotFoundException('Associated plan not found');
        const now = new Date();
        const currentEnd = new Date(subscription.endDate);
        const baseDate = currentEnd > now ? currentEnd : now;
        const newEndDate = new Date(baseDate);
        newEndDate.setMonth(newEndDate.getMonth() + dto.durationMonths);
        const prevStatus = subscription.status;
        subscription.status = subscription_schema_1.SubscriptionStatus.ACTIVE;
        subscription.endDate = newEndDate;
        subscription.amountPaid += dto.amountPaid !== undefined ? dto.amountPaid : plan.price;
        if (dto.paymentMethod)
            subscription.paymentMethod = dto.paymentMethod;
        if (dto.paymentReference)
            subscription.paymentReference = dto.paymentReference;
        if (dto.notes)
            subscription.notes = (subscription.notes ? subscription.notes + ' | ' : '') + dto.notes;
        subscription.timeline.push({
            action: 'renewed',
            fromStatus: prevStatus,
            toStatus: subscription_schema_1.SubscriptionStatus.ACTIVE,
            performedBy,
            timestamp: now,
            note: `Renewed for ${dto.durationMonths} months until ${newEndDate.toISOString().split('T')[0]}. Amount: ${dto.amountPaid || plan.price}`,
        });
        await subscription.save();
        await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
            $set: {
                status: types_1.TenantStatus.ACTIVE,
                subscriptionEndsAt: newEndDate,
            },
        });
        await this.syncTenantFeatures(subscription.tenantId, plan.features);
        return {
            message: `Subscription renewed successfully until ${newEndDate.toISOString().split('T')[0]}`,
            subscription,
        };
    }
    async upgrade(id, dto, performedBy = 'super_admin') {
        if (!mongoose_2.Types.ObjectId.isValid(dto.newPlanId)) {
            throw new common_1.BadRequestException('Invalid new plan ID format');
        }
        const [subscription, newPlan] = await Promise.all([
            this.findOne(id),
            this.planModel.findById(dto.newPlanId),
        ]);
        if (!newPlan)
            throw new common_1.NotFoundException('New plan not found');
        const now = new Date();
        const prevPlanId = subscription.planId._id;
        subscription.planId = newPlan._id;
        subscription.billingCycle = newPlan.billingCycle;
        if (dto.amountPaid !== undefined)
            subscription.amountPaid += dto.amountPaid;
        if (dto.paymentMethod)
            subscription.paymentMethod = dto.paymentMethod;
        if (dto.paymentReference)
            subscription.paymentReference = dto.paymentReference;
        if (dto.notes)
            subscription.notes = (subscription.notes ? subscription.notes + ' | ' : '') + dto.notes;
        if (dto.durationMonths) {
            const newEnd = new Date(now);
            newEnd.setMonth(newEnd.getMonth() + dto.durationMonths);
            subscription.endDate = newEnd;
        }
        subscription.status = subscription_schema_1.SubscriptionStatus.ACTIVE;
        subscription.timeline.push({
            action: 'upgraded',
            fromPlanId: prevPlanId,
            toPlanId: newPlan._id,
            fromStatus: subscription.status,
            toStatus: subscription_schema_1.SubscriptionStatus.ACTIVE,
            performedBy,
            timestamp: now,
            note: `Plan changed to '${newPlan.name}'`,
        });
        await subscription.save();
        await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
            $set: {
                planId: newPlan._id,
                status: types_1.TenantStatus.ACTIVE,
                ...(dto.durationMonths && { subscriptionEndsAt: subscription.endDate }),
            },
        });
        await this.syncTenantFeatures(subscription.tenantId, newPlan.features);
        return {
            message: `Subscription upgraded to '${newPlan.name}' successfully`,
            subscription,
            featuresProvisioned: newPlan.features,
        };
    }
    async extendTrial(id, dto, performedBy = 'super_admin') {
        const subscription = await this.findOne(id);
        const now = new Date();
        const currentTrialEnd = subscription.trialEndsAt || subscription.endDate || now;
        const baseDate = currentTrialEnd > now ? currentTrialEnd : now;
        const newTrialEnd = new Date(baseDate.getTime() + dto.additionalDays * 24 * 60 * 60 * 1000);
        subscription.trialEndsAt = newTrialEnd;
        subscription.endDate = newTrialEnd;
        subscription.status = subscription_schema_1.SubscriptionStatus.TRIALING;
        subscription.timeline.push({
            action: 'trial_extended',
            performedBy,
            timestamp: now,
            note: `Trial extended by ${dto.additionalDays} days until ${newTrialEnd.toISOString().split('T')[0]}. ${dto.notes || ''}`.trim(),
        });
        await subscription.save();
        await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
            $set: {
                status: types_1.TenantStatus.TRIAL,
                trialEndsAt: newTrialEnd,
                subscriptionEndsAt: newTrialEnd,
            },
        });
        return {
            message: `Trial extended by ${dto.additionalDays} days until ${newTrialEnd.toISOString().split('T')[0]}`,
            subscription,
        };
    }
    async cancel(id, dto, performedBy = 'super_admin') {
        const subscription = await this.findOne(id);
        const now = new Date();
        subscription.status = subscription_schema_1.SubscriptionStatus.CANCELED;
        subscription.cancelledAt = now;
        subscription.cancelReason = dto.reason;
        subscription.timeline.push({
            action: 'canceled',
            fromStatus: subscription.status,
            toStatus: subscription_schema_1.SubscriptionStatus.CANCELED,
            performedBy,
            timestamp: now,
            note: `Canceled. Reason: ${dto.reason}`,
        });
        await subscription.save();
        if (dto.immediate) {
            await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
                $set: { status: types_1.TenantStatus.SUSPENDED },
            });
        }
        return {
            message: 'Subscription canceled successfully',
            subscription,
        };
    }
    async pause(id, dto, performedBy = 'super_admin') {
        const subscription = await this.findOne(id);
        const now = new Date();
        const prevStatus = subscription.status;
        subscription.status = subscription_schema_1.SubscriptionStatus.PAUSED;
        subscription.pausedAt = now;
        subscription.timeline.push({
            action: 'paused',
            fromStatus: prevStatus,
            toStatus: subscription_schema_1.SubscriptionStatus.PAUSED,
            performedBy,
            timestamp: now,
            note: dto.reason || 'Subscription paused by Super Admin',
        });
        await subscription.save();
        await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
            $set: { status: types_1.TenantStatus.SUSPENDED },
        });
        return {
            message: 'Subscription paused and tenant access suspended',
            subscription,
        };
    }
    async resume(id, performedBy = 'super_admin') {
        const subscription = await this.findOne(id);
        const now = new Date();
        const prevStatus = subscription.status;
        subscription.status = subscription_schema_1.SubscriptionStatus.ACTIVE;
        subscription.pausedAt = null;
        subscription.timeline.push({
            action: 'resumed',
            fromStatus: prevStatus,
            toStatus: subscription_schema_1.SubscriptionStatus.ACTIVE,
            performedBy,
            timestamp: now,
            note: 'Subscription resumed by Super Admin',
        });
        await subscription.save();
        await this.tenantModel.findByIdAndUpdate(subscription.tenantId, {
            $set: { status: types_1.TenantStatus.ACTIVE },
        });
        return {
            message: 'Subscription resumed successfully',
            subscription,
        };
    }
    async getCurrentForTenant(tenant) {
        const now = new Date();
        const subscription = await this.subscriptionModel
            .findOne({
            tenantId: tenant._id,
            status: { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING, subscription_schema_1.SubscriptionStatus.PAUSED] },
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
            isTrial: subscription.status === subscription_schema_1.SubscriptionStatus.TRIALING,
            autoRenew: subscription.autoRenew,
            invoiceNumber: subscription.invoiceNumber,
        };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(1, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(2, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __param(3, (0, mongoose_1.InjectModel)(tenant_feature_schema_1.TenantFeature.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map
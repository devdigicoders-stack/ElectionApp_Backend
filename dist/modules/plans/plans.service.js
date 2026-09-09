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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_schema_1 = require("./plan.schema");
const tenant_schema_1 = require("../tenants/tenant.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const types_1 = require("../../shared/types");
let PlansService = class PlansService {
    constructor(planModel, tenantModel, featureModel) {
        this.planModel = planModel;
        this.tenantModel = tenantModel;
        this.featureModel = featureModel;
    }
    async create(dto) {
        const slug = dto.slug.toLowerCase().trim();
        const existing = await this.planModel.findOne({ slug });
        if (existing) {
            throw new common_1.ConflictException(`Plan with slug '${slug}' already exists`);
        }
        return this.planModel.create({
            ...dto,
            slug,
        });
    }
    async findAll(filter) {
        const query = {};
        if (filter?.isActive !== undefined) {
            query.isActive = filter.isActive;
        }
        return this.planModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const plan = await this.planModel.findById(id);
        if (!plan) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        return plan;
    }
    async findBySlug(slug) {
        const plan = await this.planModel.findOne({ slug: slug.toLowerCase() });
        if (!plan) {
            throw new common_1.NotFoundException(`Subscription plan '${slug}' not found`);
        }
        return plan;
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const plan = await this.planModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true });
        if (!plan) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        return plan;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const inUse = await this.tenantModel.countDocuments({ planId: id });
        if (inUse > 0) {
            throw new common_1.ConflictException(`Cannot delete plan. It is currently assigned to ${inUse} tenant(s). Please deactivate it instead or reassign tenants.`);
        }
        const deleted = await this.planModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        return { message: 'Subscription plan deleted successfully', deletedId: id };
    }
    async toggleActive(id, isActive) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const plan = await this.planModel.findByIdAndUpdate(id, { $set: { isActive } }, { new: true });
        if (!plan) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        return plan;
    }
    async assignPlanToTenant(tenantId, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(tenantId)) {
            throw new common_1.BadRequestException('Invalid tenant ID format');
        }
        if (!mongoose_2.Types.ObjectId.isValid(dto.planId)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const [tenant, plan] = await Promise.all([
            this.tenantModel.findById(tenantId),
            this.planModel.findById(dto.planId),
        ]);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        if (!plan)
            throw new common_1.NotFoundException('Subscription plan not found');
        const now = new Date();
        tenant.planId = plan._id;
        if (dto.isTrial) {
            const trialDays = dto.trialDays !== undefined ? dto.trialDays : plan.trialDays;
            const trialEnds = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
            tenant.trialEndsAt = trialEnds;
            tenant.status = types_1.TenantStatus.TRIAL;
            tenant.subscriptionStartsAt = now;
            tenant.subscriptionEndsAt = trialEnds;
        }
        else {
            let months = dto.durationMonths;
            if (!months) {
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
            tenant.subscriptionStartsAt = now;
            tenant.subscriptionEndsAt = subscriptionEnds;
            tenant.status = dto.status || types_1.TenantStatus.ACTIVE;
        }
        await tenant.save();
        const allFeatureKeys = Object.values(types_1.FeatureKey);
        const planFeatures = new Set(plan.features || []);
        for (const featureKey of allFeatureKeys) {
            const shouldEnable = planFeatures.has(featureKey);
            await this.featureModel.updateOne({ tenantId: tenant._id, featureKey }, {
                $set: {
                    tenantId: tenant._id,
                    featureKey,
                    isEnabled: shouldEnable,
                    updatedAt: new Date(),
                },
                $setOnInsert: { createdAt: new Date(), config: {} },
            }, { upsert: true });
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
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __param(1, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(2, (0, mongoose_1.InjectModel)(tenant_feature_schema_1.TenantFeature.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PlansService);
//# sourceMappingURL=plans.service.js.map
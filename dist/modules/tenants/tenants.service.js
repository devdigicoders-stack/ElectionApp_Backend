"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const tenant_schema_1 = require("./tenant.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const types_1 = require("../../shared/types");
let TenantsService = class TenantsService {
    constructor(tenantModel, featureModel, adminUserModel, configService, auditLogsService) {
        this.tenantModel = tenantModel;
        this.featureModel = featureModel;
        this.adminUserModel = adminUserModel;
        this.configService = configService;
        this.auditLogsService = auditLogsService;
    }
    async create(dto) {
        const exists = await this.tenantModel.findOne({ slug: dto.slug });
        if (exists)
            throw new common_1.ConflictException('Slug already taken');
        const tenant = await this.tenantModel.create(dto);
        const features = Object.values(types_1.FeatureKey).map((key) => ({
            tenantId: tenant._id,
            featureKey: key,
            isEnabled: false,
        }));
        await this.featureModel.insertMany(features);
        return tenant;
    }
    async findAll() {
        return this.tenantModel.find().select('-__v').sort({ createdAt: -1 });
    }
    async findOne(id) {
        const tenant = await this.tenantModel.findById(id);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async update(id, dto) {
        const tenant = await this.tenantModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async updateBranding(id, branding) {
        return this.tenantModel.findByIdAndUpdate(id, { $set: { branding } }, { new: true });
    }
    async toggleFeature(tenantId, featureKey, isEnabled) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        return this.featureModel.findOneAndUpdate({ tenantId: new Types.ObjectId(tenantId), featureKey }, { $set: { isEnabled } }, { new: true, upsert: true });
    }
    async getFeatures(tenantId) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        return this.featureModel.find({ tenantId: new Types.ObjectId(tenantId) });
    }
    async createAdminUser(tenantId, data) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        const tenantObjectId = new Types.ObjectId(tenantId);
        const emailLower = data.email.trim().toLowerCase();
        const tenant = await this.tenantModel.findById(tenantObjectId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const exists = await this.adminUserModel.findOne({
            $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId }],
            email: emailLower,
        });
        if (exists) {
            throw new common_1.ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
        }
        try {
            const passwordHash = await bcrypt.hash(data.password, 10);
            const user = await this.adminUserModel.create({
                tenantId: tenantObjectId,
                name: data.name.trim(),
                email: emailLower,
                passwordHash,
                role: data.role,
                isActive: true,
            });
            const res = user.toObject ? user.toObject() : { ...user };
            delete res.passwordHash;
            return res;
        }
        catch (err) {
            if (err.code === 11000) {
                throw new common_1.ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
            }
            throw err;
        }
    }
    async suspend(id) {
        return this.tenantModel.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
    }
    async activate(id) {
        return this.tenantModel.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    }
    async impersonateTenant(tenantId, dto, superAdminUser, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        let adminUser = await this.adminUserModel.findOne({
            tenantId: tenant._id,
            isActive: true,
            isSuperAdmin: { $ne: true },
        });
        if (!adminUser) {
            const tempPasswordHash = await bcrypt.hash('ImpersonateSupport@123', 10);
            adminUser = await this.adminUserModel.create({
                tenantId: tenant._id,
                name: tenant.branding?.leaderName ? `${tenant.branding.leaderName} (Admin)` : `${tenant.name} Admin`,
                email: `${tenant.slug}-admin@platform.local`,
                passwordHash: tempPasswordHash,
                role: types_1.UserRole.LEADER,
                isActive: true,
                isSuperAdmin: false,
            });
        }
        const durationHours = Math.min(Math.max(Number(dto.durationHours) || 2, 1), 24);
        const expiresInSeconds = durationHours * 3600;
        const secret = this.configService.get('JWT_SECRET') || 'default-secret';
        const impersonationSession = {
            isImpersonated: true,
            impersonatedBy: {
                id: superAdminUser?.sub || superAdminUser?.id || 'super_admin',
                email: superAdminUser?.email || 'superadmin@madiyayu.com',
                name: superAdminUser?.name || 'Super Admin',
            },
            reason: dto.reason || 'Technical support and troubleshooting access',
            startedAt: new Date(),
            expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
        };
        const token = jwt.sign({
            sub: adminUser._id.toString(),
            email: adminUser.email,
            name: adminUser.name,
            tenantId: tenant._id.toString(),
            tenantSlug: tenant.slug,
            role: adminUser.role,
            isSuperAdmin: false,
            isImpersonated: true,
            impersonatedBy: impersonationSession.impersonatedBy,
        }, secret, { expiresIn: `${durationHours}h` });
        await this.auditLogsService.log({
            action: 'TENANT_IMPERSONATION_STARTED',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy: {
                id: impersonationSession.impersonatedBy.id,
                email: impersonationSession.impersonatedBy.email,
                name: impersonationSession.impersonatedBy.name,
                role: 'super_admin',
            },
            targetUser: {
                id: adminUser._id.toString(),
                name: adminUser.name,
                email: adminUser.email,
            },
            details: {
                reason: impersonationSession.reason,
                durationHours,
                expiresAt: impersonationSession.expiresAt,
            },
            ipAddress,
            userAgent,
        });
        return {
            token,
            expiresIn: expiresInSeconds,
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
                customDomain: tenant.customDomain || null,
                status: tenant.status,
            },
            adminUser: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
            },
            impersonation: impersonationSession,
            message: `Support session initiated for tenant "${tenant.name}". Temporary token valid for ${durationHours} hours.`,
        };
    }
    async exitImpersonation(tenantId, dto, user, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const performedBy = {
            id: user?.impersonatedBy?.id || user?.sub || 'super_admin',
            email: user?.impersonatedBy?.email || user?.email || 'superadmin@madiyayu.com',
            name: user?.impersonatedBy?.name || user?.name || 'Super Admin',
            role: 'super_admin',
        };
        await this.auditLogsService.log({
            action: 'TENANT_IMPERSONATION_ENDED',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy,
            details: {
                notes: dto.notes || 'Support session concluded by Super Admin',
                endedAt: new Date(),
            },
            ipAddress,
            userAgent,
        });
        return {
            message: `Impersonation session for tenant "${tenant.name}" ended successfully. Action logged in audit trail.`,
            tenantId: tenant._id,
            endedAt: new Date(),
        };
    }
    async getImpersonationHistory(tenantId) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return this.auditLogsService.findAll({
            tenantId,
            action: 'TENANT_IMPERSONATION_STARTED',
            limit: 50,
        });
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(tenant_feature_schema_1.TenantFeature.name)),
    __param(2, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService,
        audit_logs_service_1.AuditLogsService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map
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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const tenants_service_1 = require("./tenants.service");
const tenant_dto_1 = require("./tenant.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
let TenantsController = class TenantsController {
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    create(dto) {
        return this.tenantsService.create(dto);
    }
    onboardFull(dto, req) {
        return this.tenantsService.onboardFull(dto, req.user, req.ip, req.headers['user-agent']);
    }
    findAll() {
        return this.tenantsService.findAll();
    }
    getOnboardingStatus(id) {
        return this.tenantsService.getOnboardingStatus(id);
    }
    publish(id, req) {
        return this.tenantsService.publishTenant(id, req.user, req.ip, req.headers['user-agent']);
    }
    findOne(id) {
        return this.tenantsService.findOne(id);
    }
    update(id, dto) {
        return this.tenantsService.update(id, dto);
    }
    updateBranding(id, branding) {
        return this.tenantsService.updateBranding(id, branding);
    }
    getFeatures(id) {
        return this.tenantsService.getFeatures(id);
    }
    toggleFeature(id, featureKey, isEnabled) {
        return this.tenantsService.toggleFeature(id, featureKey, isEnabled);
    }
    getAdminUsers(tenantId) {
        return this.tenantsService.getAdminUsers(tenantId);
    }
    createAdminUser(tenantId, body) {
        return this.tenantsService.createAdminUser(tenantId, body);
    }
    suspend(id) {
        return this.tenantsService.suspend(id);
    }
    activate(id) {
        return this.tenantsService.activate(id);
    }
    impersonate(id, dto, req) {
        return this.tenantsService.impersonateTenant(id, dto, req.user, req.ip, req.headers['user-agent']);
    }
    exitImpersonation(id, dto, req) {
        return this.tenantsService.exitImpersonation(id, dto, req.user, req.ip, req.headers['user-agent']);
    }
    getImpersonationHistory(id) {
        return this.tenantsService.getImpersonationHistory(id);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_dto_1.CreateTenantDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('onboard-full'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_dto_1.OnboardFullTenantDto, Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "onboardFull", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/onboarding-status'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_dto_1.UpdateTenantDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/branding'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_dto_1.UpdateBrandingDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "updateBranding", null);
__decorate([
    (0, common_1.Get)(':id/features'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getFeatures", null);
__decorate([
    (0, common_1.Patch)(':id/features/:featureKey'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('featureKey')),
    __param(2, (0, common_1.Body)('isEnabled')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "toggleFeature", null);
__decorate([
    (0, common_1.Get)(':id/admin-users'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getAdminUsers", null);
__decorate([
    (0, common_1.Post)(':id/admin-users'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "createAdminUser", null);
__decorate([
    (0, common_1.Patch)(':id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "suspend", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/impersonate'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_dto_1.ImpersonateTenantDto, Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "impersonate", null);
__decorate([
    (0, common_1.Post)(':id/impersonate/exit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_dto_1.ExitImpersonationDto, Object]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "exitImpersonation", null);
__decorate([
    (0, common_1.Get)(':id/impersonation-history'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "getImpersonationHistory", null);
exports.TenantsController = TenantsController = __decorate([
    (0, common_1.Controller)('super-admin/tenants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map
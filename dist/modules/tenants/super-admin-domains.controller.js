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
exports.SuperAdminDomainsController = void 0;
const common_1 = require("@nestjs/common");
const custom_domains_service_1 = require("./custom-domains.service");
const custom_domain_dto_1 = require("./custom-domain.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
let SuperAdminDomainsController = class SuperAdminDomainsController {
    constructor(customDomainsService) {
        this.customDomainsService = customDomainsService;
    }
    listAllDomains(query) {
        return this.customDomainsService.listAllDomains(query);
    }
    getTenantDomain(tenantId) {
        return this.customDomainsService.getDomainStatus(tenantId);
    }
    configureTenantDomain(tenantId, dto, req) {
        return this.customDomainsService.configureDomain(tenantId, dto.domain, req.user, req.ip, req.headers['user-agent']);
    }
    verifyTenantDomain(tenantId, dto, req) {
        return this.customDomainsService.verifyDomain(tenantId, dto, req.user, req.ip, req.headers['user-agent']);
    }
    removeTenantDomain(tenantId, req) {
        return this.customDomainsService.removeDomain(tenantId, req.user, req.ip, req.headers['user-agent']);
    }
};
exports.SuperAdminDomainsController = SuperAdminDomainsController;
__decorate([
    (0, common_1.Get)('domains'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [custom_domain_dto_1.DomainQueryDto]),
    __metadata("design:returntype", void 0)
], SuperAdminDomainsController.prototype, "listAllDomains", null);
__decorate([
    (0, common_1.Get)('tenants/:id/domain'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperAdminDomainsController.prototype, "getTenantDomain", null);
__decorate([
    (0, common_1.Post)('tenants/:id/domain'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, custom_domain_dto_1.ConfigureDomainDto, Object]),
    __metadata("design:returntype", void 0)
], SuperAdminDomainsController.prototype, "configureTenantDomain", null);
__decorate([
    (0, common_1.Post)('tenants/:id/domain/verify'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, custom_domain_dto_1.VerifyDomainDto, Object]),
    __metadata("design:returntype", void 0)
], SuperAdminDomainsController.prototype, "verifyTenantDomain", null);
__decorate([
    (0, common_1.Delete)('tenants/:id/domain'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuperAdminDomainsController.prototype, "removeTenantDomain", null);
exports.SuperAdminDomainsController = SuperAdminDomainsController = __decorate([
    (0, common_1.Controller)('super-admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [custom_domains_service_1.CustomDomainsService])
], SuperAdminDomainsController);
//# sourceMappingURL=super-admin-domains.controller.js.map
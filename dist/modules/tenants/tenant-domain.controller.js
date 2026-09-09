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
exports.TenantDomainController = void 0;
const common_1 = require("@nestjs/common");
const custom_domains_service_1 = require("./custom-domains.service");
const custom_domain_dto_1 = require("./custom-domain.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let TenantDomainController = class TenantDomainController {
    constructor(customDomainsService) {
        this.customDomainsService = customDomainsService;
    }
    getMyDomainStatus(req) {
        return this.customDomainsService.getDomainStatus(req.tenant._id.toString());
    }
    configureMyDomain(req, dto) {
        return this.customDomainsService.configureDomain(req.tenant._id.toString(), dto.domain, req.user, req.ip, req.headers['user-agent']);
    }
    verifyMyDomain(req) {
        return this.customDomainsService.verifyDomain(req.tenant._id.toString(), { forceVerify: false }, req.user, req.ip, req.headers['user-agent']);
    }
    removeMyDomain(req) {
        return this.customDomainsService.removeDomain(req.tenant._id.toString(), req.user, req.ip, req.headers['user-agent']);
    }
};
exports.TenantDomainController = TenantDomainController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantDomainController.prototype, "getMyDomainStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, custom_domain_dto_1.ConfigureDomainDto]),
    __metadata("design:returntype", void 0)
], TenantDomainController.prototype, "configureMyDomain", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantDomainController.prototype, "verifyMyDomain", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantDomainController.prototype, "removeMyDomain", null);
exports.TenantDomainController = TenantDomainController = __decorate([
    (0, common_1.Controller)('dashboard/domain'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [custom_domains_service_1.CustomDomainsService])
], TenantDomainController);
//# sourceMappingURL=tenant-domain.controller.js.map
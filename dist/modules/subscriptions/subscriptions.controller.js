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
exports.SubscriptionsTenantController = exports.SubscriptionsSuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_service_1 = require("./subscriptions.service");
const subscription_dto_1 = require("./subscription.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
let SubscriptionsSuperAdminController = class SubscriptionsSuperAdminController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    create(dto, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.create(dto, performedBy);
    }
    getStats() {
        return this.subscriptionsService.getStats();
    }
    getExpiringSoon(days) {
        return this.subscriptionsService.getExpiringSoon(days ? Number(days) : 7);
    }
    findByTenant(tenantId) {
        return this.subscriptionsService.findByTenant(tenantId);
    }
    findAll(query) {
        return this.subscriptionsService.findAll(query);
    }
    findOne(id) {
        return this.subscriptionsService.findOne(id);
    }
    renew(id, dto, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.renew(id, dto, performedBy);
    }
    upgrade(id, dto, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.upgrade(id, dto, performedBy);
    }
    extendTrial(id, dto, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.extendTrial(id, dto, performedBy);
    }
    cancel(id, dto, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.cancel(id, dto, performedBy);
    }
    pause(id, dto, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.pause(id, dto, performedBy);
    }
    resume(id, req) {
        const performedBy = req.user?.name || req.user?.email || 'super_admin';
        return this.subscriptionsService.resume(id, performedBy);
    }
};
exports.SubscriptionsSuperAdminController = SubscriptionsSuperAdminController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('expiring-soon'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "getExpiringSoon", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "findByTenant", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.QuerySubscriptionsDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/renew'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.RenewSubscriptionDto, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "renew", null);
__decorate([
    (0, common_1.Post)(':id/upgrade'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.UpgradePlanDto, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "upgrade", null);
__decorate([
    (0, common_1.Patch)(':id/extend-trial'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.ExtendTrialDto, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "extendTrial", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.CancelSubscriptionDto, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/pause'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.PauseSubscriptionDto, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "pause", null);
__decorate([
    (0, common_1.Post)(':id/resume'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsSuperAdminController.prototype, "resume", null);
exports.SubscriptionsSuperAdminController = SubscriptionsSuperAdminController = __decorate([
    (0, common_1.Controller)('super-admin/subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsSuperAdminController);
let SubscriptionsTenantController = class SubscriptionsTenantController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    getCurrent(req) {
        return this.subscriptionsService.getCurrentForTenant(req.tenant);
    }
};
exports.SubscriptionsTenantController = SubscriptionsTenantController;
__decorate([
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionsTenantController.prototype, "getCurrent", null);
exports.SubscriptionsTenantController = SubscriptionsTenantController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsTenantController);
//# sourceMappingURL=subscriptions.controller.js.map
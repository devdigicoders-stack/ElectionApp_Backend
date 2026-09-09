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
exports.SuperAdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
let SuperAdminDashboardController = class SuperAdminDashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getGlobalStats() {
        return this.dashboardService.getSuperAdminStats();
    }
    getGrowthTrends(days) {
        const parsedDays = days ? Math.min(Math.max(parseInt(days, 10) || 30, 7), 365) : 30;
        return this.dashboardService.getSuperAdminGrowth(parsedDays);
    }
    getTenantsOverview(page, limit, status, search) {
        return this.dashboardService.getSuperAdminTenantsOverview({
            page: page ? parseInt(page, 10) || 1 : 1,
            limit: limit ? parseInt(limit, 10) || 10 : 10,
            status,
            search,
        });
    }
};
exports.SuperAdminDashboardController = SuperAdminDashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperAdminDashboardController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Get)('growth'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperAdminDashboardController.prototype, "getGrowthTrends", null);
__decorate([
    (0, common_1.Get)('tenants-overview'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], SuperAdminDashboardController.prototype, "getTenantsOverview", null);
exports.SuperAdminDashboardController = SuperAdminDashboardController = __decorate([
    (0, common_1.Controller)('super-admin/dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], SuperAdminDashboardController);
//# sourceMappingURL=super-admin-dashboard.controller.js.map
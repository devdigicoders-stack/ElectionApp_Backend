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
exports.DashboardCitizenAliasController = exports.CitizenDashboardController = void 0;
const common_1 = require("@nestjs/common");
const citizen_dashboard_service_1 = require("./citizen-dashboard.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const citizen_dashboard_dto_1 = require("./citizen-dashboard.dto");
let CitizenDashboardController = class CitizenDashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getCitizenDashboard(req) {
        return this.dashboardService.getCitizenDashboard(req.tenant, req.user.sub);
    }
    getCitizenProfile(req) {
        return this.dashboardService.getCitizenProfile(req.tenant, req.user.sub);
    }
    updateCitizenProfile(req, dto) {
        return this.dashboardService.updateCitizenProfile(req.tenant, req.user.sub, dto);
    }
};
exports.CitizenDashboardController = CitizenDashboardController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CitizenDashboardController.prototype, "getCitizenDashboard", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CitizenDashboardController.prototype, "getCitizenProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizen_dashboard_dto_1.UpdateCitizenProfileDto]),
    __metadata("design:returntype", void 0)
], CitizenDashboardController.prototype, "updateCitizenProfile", null);
exports.CitizenDashboardController = CitizenDashboardController = __decorate([
    (0, common_1.Controller)('citizen'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [citizen_dashboard_service_1.CitizenDashboardService])
], CitizenDashboardController);
let DashboardCitizenAliasController = class DashboardCitizenAliasController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getDashboard(req) {
        return this.dashboardService.getCitizenDashboard(req.tenant, req.user.sub);
    }
};
exports.DashboardCitizenAliasController = DashboardCitizenAliasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardCitizenAliasController.prototype, "getDashboard", null);
exports.DashboardCitizenAliasController = DashboardCitizenAliasController = __decorate([
    (0, common_1.Controller)('dashboard/citizen'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [citizen_dashboard_service_1.CitizenDashboardService])
], DashboardCitizenAliasController);
//# sourceMappingURL=citizen-dashboard.controller.js.map
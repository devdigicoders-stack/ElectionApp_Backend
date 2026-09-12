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
exports.MyAreaController = void 0;
const common_1 = require("@nestjs/common");
const citizen_dashboard_service_1 = require("./citizen-dashboard.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const citizen_dashboard_dto_1 = require("./citizen-dashboard.dto");
let MyAreaController = class MyAreaController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getMyAreaFeed(req) {
        return this.dashboardService.getMyAreaFeed(req.tenant, req.user.sub);
    }
    getMyAreaHierarchy(req) {
        return this.dashboardService.getMyAreaHierarchy(req.tenant, req.user.sub);
    }
    getMyAreaWorks(req, query) {
        return this.dashboardService.getMyAreaWorks(req.tenant, req.user.sub, query);
    }
    getMyAreaEvents(req, query) {
        return this.dashboardService.getMyAreaEvents(req.tenant, req.user.sub, query);
    }
    getMyAreaNews(req, query) {
        return this.dashboardService.getMyAreaNews(req.tenant, req.user.sub, query);
    }
    getMyAreaPolls(req) {
        return this.dashboardService.getMyAreaPolls(req.tenant, req.user.sub);
    }
    getMyAreaCoordinator(req) {
        return this.dashboardService.getMyAreaCoordinator(req.tenant, req.user.sub);
    }
    getMyAreaComplaints(req, query) {
        return this.dashboardService.getMyAreaComplaints(req.tenant, req.user.sub, query);
    }
};
exports.MyAreaController = MyAreaController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaFeed", null);
__decorate([
    (0, common_1.Get)('hierarchy'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaHierarchy", null);
__decorate([
    (0, common_1.Get)('works'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizen_dashboard_dto_1.QueryFeedDto]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaWorks", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizen_dashboard_dto_1.QueryFeedDto]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaEvents", null);
__decorate([
    (0, common_1.Get)('news'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizen_dashboard_dto_1.QueryFeedDto]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaNews", null);
__decorate([
    (0, common_1.Get)('polls'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaPolls", null);
__decorate([
    (0, common_1.Get)('coordinator'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaCoordinator", null);
__decorate([
    (0, common_1.Get)('complaints'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizen_dashboard_dto_1.QueryFeedDto]),
    __metadata("design:returntype", void 0)
], MyAreaController.prototype, "getMyAreaComplaints", null);
exports.MyAreaController = MyAreaController = __decorate([
    (0, common_1.Controller)('my-area'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [citizen_dashboard_service_1.CitizenDashboardService])
], MyAreaController);
//# sourceMappingURL=my-area.controller.js.map
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
exports.PlansPublicController = exports.PlansSuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const plans_service_1 = require("./plans.service");
const plan_dto_1 = require("./plan.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
let PlansSuperAdminController = class PlansSuperAdminController {
    constructor(plansService) {
        this.plansService = plansService;
    }
    create(dto) {
        return this.plansService.create(dto);
    }
    findAll(isActive) {
        const filter = isActive !== undefined ? { isActive: isActive === 'true' } : undefined;
        return this.plansService.findAll(filter);
    }
    findOne(id) {
        return this.plansService.findOne(id);
    }
    update(id, dto) {
        return this.plansService.update(id, dto);
    }
    remove(id) {
        return this.plansService.remove(id);
    }
    toggleActive(id, isActive) {
        return this.plansService.toggleActive(id, isActive);
    }
    assignPlanToTenant(tenantId, dto) {
        return this.plansService.assignPlanToTenant(tenantId, dto);
    }
};
exports.PlansSuperAdminController = PlansSuperAdminController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Post)('assign/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, plan_dto_1.AssignPlanDto]),
    __metadata("design:returntype", void 0)
], PlansSuperAdminController.prototype, "assignPlanToTenant", null);
exports.PlansSuperAdminController = PlansSuperAdminController = __decorate([
    (0, common_1.Controller)('super-admin/plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [plans_service_1.PlansService])
], PlansSuperAdminController);
let PlansPublicController = class PlansPublicController {
    constructor(plansService) {
        this.plansService = plansService;
    }
    findActivePlans() {
        return this.plansService.findAll({ isActive: true });
    }
    findBySlug(slug) {
        return this.plansService.findBySlug(slug);
    }
};
exports.PlansPublicController = PlansPublicController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlansPublicController.prototype, "findActivePlans", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansPublicController.prototype, "findBySlug", null);
exports.PlansPublicController = PlansPublicController = __decorate([
    (0, common_1.Controller)('plans'),
    __metadata("design:paramtypes", [plans_service_1.PlansService])
], PlansPublicController);
//# sourceMappingURL=plans.controller.js.map
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
exports.ComplaintsController = void 0;
const common_1 = require("@nestjs/common");
const complaints_service_1 = require("./complaints.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
const complaints_dto_1 = require("./complaints.dto");
let ComplaintsController = class ComplaintsController {
    constructor(complaintsService) {
        this.complaintsService = complaintsService;
    }
    getCategories(req) {
        return this.complaintsService.getCategories(req.tenant);
    }
    createCategory(req, dto) {
        return this.complaintsService.createCategory(req.tenant, dto);
    }
    updateCategory(req, catId, dto) {
        return this.complaintsService.updateCategory(req.tenant, catId, dto);
    }
    deleteCategory(req, catId) {
        return this.complaintsService.deleteCategory(req.tenant, catId);
    }
    findMine(req) {
        return this.complaintsService.findByUser(req.tenant, req.user.sub);
    }
    getMyStats(req) {
        return this.complaintsService.getCitizenDashboardCounters(req.tenant, req.user.sub);
    }
    findPublic(req, query) {
        return this.complaintsService.findPublic(req.tenant, query);
    }
    getAnalytics(req) {
        return this.complaintsService.getAnalytics(req.tenant);
    }
    getStats(req) {
        return this.complaintsService.getDashboardStats(req.tenant);
    }
    create(req, dto) {
        return this.complaintsService.create(req.tenant, req.user.sub, dto);
    }
    findAll(req, query) {
        return this.complaintsService.findAll(req.tenant, query);
    }
    exportComplaints(req, query, res, ip, userAgent) {
        return this.complaintsService.exportComplaints(req.tenant, query, res, query.format || 'csv', req.user, ip, userAgent);
    }
    findOne(req, id) {
        return this.complaintsService.findOne(req.tenant, id, req.user);
    }
    assignComplaint(req, id, dto) {
        return this.complaintsService.assignComplaint(req.tenant, id, dto, req.user);
    }
    updatePriority(req, id, dto) {
        return this.complaintsService.updatePriority(req.tenant, id, dto, req.user);
    }
    addRemark(req, id, dto) {
        return this.complaintsService.addRemark(req.tenant, id, dto, req.user);
    }
    resolveComplaint(req, id, dto) {
        return this.complaintsService.resolveComplaint(req.tenant, id, dto, req.user);
    }
    closeComplaint(req, id, dto) {
        return this.complaintsService.closeComplaint(req.tenant, id, dto, req.user);
    }
    rejectComplaint(req, id, dto) {
        return this.complaintsService.rejectComplaint(req.tenant, id, dto, req.user);
    }
    updateStatus(req, id, body) {
        return this.complaintsService.updateStatus(req.tenant, id, body.status, body.note ?? '', req.user.sub);
    }
    togglePublic(req, id, dto) {
        return this.complaintsService.togglePublic(req.tenant, id, dto, req.user);
    }
};
exports.ComplaintsController = ComplaintsController;
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complaints_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:catId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('catId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:catId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('catId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('my/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, common_1.SetMetadata)(jwt_auth_guard_1.IS_PUBLIC, true),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complaints_dto_1.QueryPublicComplaintsDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complaints_dto_1.CreateComplaintDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complaints_dto_1.QueryComplaintsDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.AREA_COORDINATOR, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "exportComplaints", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.AssignComplaintDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "assignComplaint", null);
__decorate([
    (0, common_1.Patch)(':id/priority'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.UpdatePriorityDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "updatePriority", null);
__decorate([
    (0, common_1.Post)(':id/remarks'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.AddRemarkDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "addRemark", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.ResolveComplaintDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "resolveComplaint", null);
__decorate([
    (0, common_1.Patch)(':id/close'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.CloseComplaintDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "closeComplaint", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.RejectComplaintDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "rejectComplaint", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/public'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.COMPLAINT_MANAGER, types_1.UserRole.AREA_COORDINATOR),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complaints_dto_1.TogglePublicComplaintDto]),
    __metadata("design:returntype", void 0)
], ComplaintsController.prototype, "togglePublic", null);
exports.ComplaintsController = ComplaintsController = __decorate([
    (0, common_1.Controller)('complaints'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.COMPLAINTS),
    __metadata("design:paramtypes", [complaints_service_1.ComplaintsService])
], ComplaintsController);
//# sourceMappingURL=complaints.controller.js.map
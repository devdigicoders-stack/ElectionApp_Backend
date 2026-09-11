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
exports.AreasController = void 0;
const common_1 = require("@nestjs/common");
const areas_service_1 = require("./areas.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
let AreasController = class AreasController {
    constructor(areasService) {
        this.areasService = areasService;
    }
    createLevel(req, body) {
        return this.areasService.createLevel(req.tenant, body);
    }
    getLevels(req) {
        return this.areasService.getLevels(req.tenant);
    }
    updateLevel(req, id, body) {
        return this.areasService.updateLevel(req.tenant, id, body);
    }
    deleteLevel(req, id) {
        return this.areasService.deleteLevel(req.tenant, id);
    }
    createArea(req, body) {
        return this.areasService.createArea(req.tenant, body);
    }
    getTree(req) {
        return this.areasService.getTree(req.tenant);
    }
    getByLevel(req, levelId) {
        return this.areasService.getAreasByLevel(req.tenant, levelId);
    }
    getChildren(req, id) {
        return this.areasService.getChildren(req.tenant, id);
    }
    getAncestors(req, id) {
        return this.areasService.getAncestors(req.tenant, id);
    }
    updateArea(req, id, body) {
        return this.areasService.updateArea(req.tenant, id, body);
    }
    deleteArea(req, id) {
        return this.areasService.deleteArea(req.tenant, id);
    }
};
exports.AreasController = AreasController;
__decorate([
    (0, common_1.Post)('levels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "createLevel", null);
__decorate([
    (0, common_1.Get)('levels'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "getLevels", null);
__decorate([
    (0, common_1.Patch)('levels/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "updateLevel", null);
__decorate([
    (0, common_1.Delete)('levels/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "deleteLevel", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "createArea", null);
__decorate([
    (0, common_1.Get)('tree'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)('by-level/:levelId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('levelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "getByLevel", null);
__decorate([
    (0, common_1.Get)(':id/children'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "getChildren", null);
__decorate([
    (0, common_1.Get)(':id/ancestors'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "getAncestors", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "updateArea", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AreasController.prototype, "deleteArea", null);
exports.AreasController = AreasController = __decorate([
    (0, common_1.Controller)('areas'),
    __metadata("design:paramtypes", [areas_service_1.AreasService])
], AreasController);
//# sourceMappingURL=areas.controller.js.map
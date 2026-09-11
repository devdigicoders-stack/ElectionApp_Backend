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
exports.CitizensController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
const citizens_dto_1 = require("./citizens.dto");
let CitizensController = class CitizensController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findCitizens(req, query) {
        return this.usersService.findCitizens(req.tenant, query);
    }
    getAvailableTags(req) {
        return this.usersService.getAvailableTags(req.tenant);
    }
    getCrmAnalytics(req) {
        return this.usersService.getCrmAnalytics(req.tenant);
    }
    exportCitizens(req, query, res, ipAddress, userAgent) {
        return this.usersService.exportCitizens(req.tenant, query, res, req.user, ipAddress, userAgent);
    }
    bulkAddTags(req, dto) {
        return this.usersService.bulkAddTags(req.tenant, dto.userIds, dto.tags);
    }
    bulkRemoveTag(req, dto) {
        return this.usersService.bulkRemoveTag(req.tenant, dto.userIds, dto.tag);
    }
    getCitizenDetails(req, id) {
        return this.usersService.getCitizenDetails(req.tenant, id);
    }
    updateCitizen(req, id, dto) {
        return this.usersService.updateCitizen(req.tenant, id, dto);
    }
    updateCitizenStatus(req, id, dto) {
        return this.usersService.updateCitizenStatus(req.tenant, id, dto);
    }
    addTags(req, id, dto) {
        return this.usersService.addTags(req.tenant, id, dto.tags);
    }
    removeTag(req, id, tag) {
        return this.usersService.removeTag(req.tenant, id, tag);
    }
    upgradeCategory(req, id, dto) {
        return this.usersService.upgradeCategory(req.tenant, id, dto);
    }
    assignMembership(req, id, dto) {
        const adminId = req.user?.sub || req.user?._id;
        return this.usersService.assignMembership(req.tenant, id, dto, adminId);
    }
    assignVolunteer(req, id, dto) {
        const adminId = req.user?.sub || req.user?._id;
        return this.usersService.assignVolunteer(req.tenant, id, dto, adminId);
    }
};
exports.CitizensController = CitizensController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizens_dto_1.CitizenQueryDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "findCitizens", null);
__decorate([
    (0, common_1.Get)('tags'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "getAvailableTags", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "getCrmAnalytics", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Ip)()),
    __param(4, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizens_dto_1.CitizenQueryDto, Object, String, String]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "exportCitizens", null);
__decorate([
    (0, common_1.Post)('bulk-tags'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizens_dto_1.BulkTagDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "bulkAddTags", null);
__decorate([
    (0, common_1.Post)('bulk-untag'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, citizens_dto_1.BulkUntagDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "bulkRemoveTag", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "getCitizenDetails", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, citizens_dto_1.UpdateCitizenDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "updateCitizen", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, citizens_dto_1.UpdateCitizenStatusDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "updateCitizenStatus", null);
__decorate([
    (0, common_1.Post)(':id/tags'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, citizens_dto_1.AddTagsDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "addTags", null);
__decorate([
    (0, common_1.Delete)(':id/tags/:tag'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "removeTag", null);
__decorate([
    (0, common_1.Patch)(':id/category'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, citizens_dto_1.UpgradeCategoryDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "upgradeCategory", null);
__decorate([
    (0, common_1.Post)(':id/membership'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, citizens_dto_1.AssignMembershipDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "assignMembership", null);
__decorate([
    (0, common_1.Post)(':id/volunteer'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, citizens_dto_1.AssignVolunteerDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "assignVolunteer", null);
exports.CitizensController = CitizensController = __decorate([
    (0, common_1.Controller)('citizens'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], CitizensController);
//# sourceMappingURL=citizens.controller.js.map
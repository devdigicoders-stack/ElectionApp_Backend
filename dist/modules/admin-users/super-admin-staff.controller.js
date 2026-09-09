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
exports.SuperAdminStaffController = void 0;
const common_1 = require("@nestjs/common");
const admin_users_service_1 = require("./admin-users.service");
const super_admin_staff_dto_1 = require("./super-admin-staff.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
let SuperAdminStaffController = class SuperAdminStaffController {
    constructor(adminUsersService) {
        this.adminUsersService = adminUsersService;
    }
    createStaff(dto) {
        return this.adminUsersService.createStaff(dto);
    }
    findAllStaff(query) {
        return this.adminUsersService.findAllStaff(query);
    }
    getAvailableRoles() {
        return {
            roles: Object.values(super_admin_staff_dto_1.PlatformStaffRole),
            defaultPermissions: super_admin_staff_dto_1.DEFAULT_PLATFORM_PERMISSIONS,
        };
    }
    findOneStaff(id) {
        return this.adminUsersService.findOneStaff(id);
    }
    updateStaff(id, dto) {
        return this.adminUsersService.updateStaff(id, dto);
    }
    toggleStaffStatus(id, req) {
        const requesterId = req.user?.sub || req.user?.id;
        return this.adminUsersService.toggleStaffStatus(id, requesterId);
    }
    resetStaffPassword(id, dto) {
        return this.adminUsersService.resetStaffPassword(id, dto.newPassword);
    }
    removeStaff(id, req) {
        const requesterId = req.user?.sub || req.user?.id;
        return this.adminUsersService.removeStaff(id, requesterId);
    }
};
exports.SuperAdminStaffController = SuperAdminStaffController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [super_admin_staff_dto_1.CreateSuperAdminStaffDto]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [super_admin_staff_dto_1.QueryStaffDto]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "findAllStaff", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "getAvailableRoles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "findOneStaff", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, super_admin_staff_dto_1.UpdateSuperAdminStaffDto]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "toggleStaffStatus", null);
__decorate([
    (0, common_1.Patch)(':id/reset-password'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, super_admin_staff_dto_1.ResetStaffPasswordDto]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "resetStaffPassword", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SuperAdminStaffController.prototype, "removeStaff", null);
exports.SuperAdminStaffController = SuperAdminStaffController = __decorate([
    (0, common_1.Controller)('super-admin/staff'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [admin_users_service_1.AdminUsersService])
], SuperAdminStaffController);
//# sourceMappingURL=super-admin-staff.controller.js.map
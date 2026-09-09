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
exports.RegistrationFormController = void 0;
const common_1 = require("@nestjs/common");
const registration_form_service_1 = require("./registration-form.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const registration_form_dto_1 = require("./registration-form.dto");
let RegistrationFormController = class RegistrationFormController {
    constructor(registrationFormService) {
        this.registrationFormService = registrationFormService;
    }
    getPublicForm(req) {
        return this.registrationFormService.getPublicForm(req.tenant);
    }
    getAdminForm(req) {
        return this.registrationFormService.getAdminForm(req.tenant);
    }
    bulkUpdateFields(req, dto) {
        return this.registrationFormService.bulkUpdateFields(req.tenant, dto);
    }
    addField(req, dto) {
        return this.registrationFormService.addField(req.tenant, dto);
    }
    updateField(req, key, dto) {
        return this.registrationFormService.updateField(req.tenant, key, dto);
    }
    deleteField(req, key) {
        return this.registrationFormService.deleteField(req.tenant, key);
    }
    resetToDefault(req) {
        return this.registrationFormService.resetToDefault(req.tenant);
    }
    completeProfile(req, body) {
        return this.registrationFormService.completeCitizenProfile(req.tenant, req.user.sub, body);
    }
};
exports.RegistrationFormController = RegistrationFormController;
__decorate([
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "getPublicForm", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "getAdminForm", null);
__decorate([
    (0, common_1.Put)('fields'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, registration_form_dto_1.BulkUpdateRegistrationFieldsDto]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "bulkUpdateFields", null);
__decorate([
    (0, common_1.Post)('fields'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, registration_form_dto_1.CreateRegistrationFieldDto]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "addField", null);
__decorate([
    (0, common_1.Patch)('fields/:key'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, registration_form_dto_1.UpdateRegistrationFieldDto]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "updateField", null);
__decorate([
    (0, common_1.Delete)('fields/:key'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "deleteField", null);
__decorate([
    (0, common_1.Post)('reset-default'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "resetToDefault", null);
__decorate([
    (0, common_1.Post)('complete-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RegistrationFormController.prototype, "completeProfile", null);
exports.RegistrationFormController = RegistrationFormController = __decorate([
    (0, common_1.Controller)('registration-form'),
    __metadata("design:paramtypes", [registration_form_service_1.RegistrationFormService])
], RegistrationFormController);
//# sourceMappingURL=registration-form.controller.js.map
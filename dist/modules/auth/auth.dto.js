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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginDto = exports.CompleteProfileDto = exports.VerifyOtpDto = exports.SendOtpDto = void 0;
const class_validator_1 = require("class-validator");
class SendOtpDto {
}
exports.SendOtpDto = SendOtpDto;
__decorate([
    (0, class_validator_1.IsMobilePhone)('en-IN'),
    __metadata("design:type", String)
], SendOtpDto.prototype, "mobile", void 0);
class VerifyOtpDto {
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, class_validator_1.IsMobilePhone)('en-IN'),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.otp),
    (0, class_validator_1.IsString)({ message: 'code must be a string' }),
    (0, class_validator_1.Length)(6, 6, { message: 'code must be exactly 6 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.code),
    (0, class_validator_1.IsString)({ message: 'otp must be a string' }),
    (0, class_validator_1.Length)(6, 6, { message: 'otp must be exactly 6 characters' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);
class CompleteProfileDto {
}
exports.CompleteProfileDto = CompleteProfileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteProfileDto.prototype, "name", void 0);
class AdminLoginDto {
}
exports.AdminLoginDto = AdminLoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminLoginDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map
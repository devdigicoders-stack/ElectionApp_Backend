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
exports.RefundPaymentDto = exports.QueryPaymentsDto = exports.VerifyPaymentDto = exports.CreatePaymentOrderDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const types_1 = require("../../shared/types");
class CreatePaymentOrderDto {
}
exports.CreatePaymentOrderDto = CreatePaymentOrderDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Amount must be at least ₹1.00' }),
    __metadata("design:type", Number)
], CreatePaymentOrderDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.PaymentPurpose),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "purpose", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)({ message: 'membershipPlanId must be a valid MongoDB ObjectId' }),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "membershipPlanId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)({ message: 'eventId must be a valid MongoDB ObjectId' }),
    __metadata("design:type", String)
], CreatePaymentOrderDto.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePaymentOrderDto.prototype, "notes", void 0);
class VerifyPaymentDto {
}
exports.VerifyPaymentDto = VerifyPaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "paymentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyPaymentDto.prototype, "signature", void 0);
class QueryPaymentsDto {
}
exports.QueryPaymentsDto = QueryPaymentsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.PaymentStatus),
    __metadata("design:type", String)
], QueryPaymentsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(types_1.PaymentPurpose),
    __metadata("design:type", String)
], QueryPaymentsDto.prototype, "purpose", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPaymentsDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPaymentsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPaymentsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QueryPaymentsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QueryPaymentsDto.prototype, "limit", void 0);
class RefundPaymentDto {
}
exports.RefundPaymentDto = RefundPaymentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RefundPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundPaymentDto.prototype, "reason", void 0);
//# sourceMappingURL=payments.dto.js.map
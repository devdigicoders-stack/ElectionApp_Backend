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
exports.QueryMembershipDto = exports.UpdateMembershipCardDetailsDto = exports.RegenerateCardDto = exports.RejectMembershipDto = exports.ApproveMembershipDto = exports.ApplyMembershipDto = exports.UpdateMembershipPlanDto = exports.CreateMembershipPlanDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const types_1 = require("../../shared/types");
class CreateMembershipPlanDto {
    constructor() {
        this.price = 0;
        this.currency = 'INR';
        this.validityDays = 365;
        this.requiresApproval = false;
        this.isActive = true;
        this.sortOrder = 0;
    }
}
exports.CreateMembershipPlanDto = CreateMembershipPlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plan name is required' }),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plan code is required (e.g. PRIMARY, ACTIVE, PATRON)' }),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Price cannot be negative' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "currency", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'validityDays must be 0 or greater (0 = lifetime)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "validityDays", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "badgeText", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMembershipPlanDto.prototype, "badgeColor", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMembershipPlanDto.prototype, "benefits", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMembershipPlanDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMembershipPlanDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMembershipPlanDto.prototype, "sortOrder", void 0);
class UpdateMembershipPlanDto {
}
exports.UpdateMembershipPlanDto = UpdateMembershipPlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipPlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipPlanDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipPlanDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMembershipPlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipPlanDto.prototype, "currency", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMembershipPlanDto.prototype, "validityDays", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipPlanDto.prototype, "badgeText", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipPlanDto.prototype, "badgeColor", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateMembershipPlanDto.prototype, "benefits", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMembershipPlanDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMembershipPlanDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMembershipPlanDto.prototype, "sortOrder", void 0);
class ApplyMembershipDto {
}
exports.ApplyMembershipDto = ApplyMembershipDto;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'planId must be a valid MongoDB ObjectId' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplyMembershipDto.prototype, "planId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplyMembershipDto.prototype, "designation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApplyMembershipDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ApplyMembershipDto.prototype, "customData", void 0);
class ApproveMembershipDto {
}
exports.ApproveMembershipDto = ApproveMembershipDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveMembershipDto.prototype, "designation", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveMembershipDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveMembershipDto.prototype, "remarks", void 0);
class RejectMembershipDto {
}
exports.RejectMembershipDto = RejectMembershipDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Rejection reason is required' }),
    __metadata("design:type", String)
], RejectMembershipDto.prototype, "reason", void 0);
class RegenerateCardDto {
}
exports.RegenerateCardDto = RegenerateCardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegenerateCardDto.prototype, "designation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegenerateCardDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegenerateCardDto.prototype, "expiresAt", void 0);
class UpdateMembershipCardDetailsDto {
}
exports.UpdateMembershipCardDetailsDto = UpdateMembershipCardDetailsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipCardDetailsDto.prototype, "designation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipCardDetailsDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMembershipCardDetailsDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateMembershipCardDetailsDto.prototype, "customData", void 0);
class QueryMembershipDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.QueryMembershipDto = QueryMembershipDto;
__decorate([
    (0, class_validator_1.IsEnum)(types_1.MembershipStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryMembershipDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryMembershipDto.prototype, "planId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryMembershipDto.prototype, "search", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryMembershipDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryMembershipDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryMembershipDto.prototype, "format", void 0);
//# sourceMappingURL=membership.dto.js.map
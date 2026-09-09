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
exports.CompleteCitizenProfileDto = exports.BulkUpdateRegistrationFieldsDto = exports.UpdateRegistrationFieldDto = exports.CreateRegistrationFieldDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const registration_form_types_1 = require("./registration-form.types");
class CreateRegistrationFieldDto {
    constructor() {
        this.required = false;
        this.sortOrder = 10;
        this.isActive = true;
    }
}
exports.CreateRegistrationFieldDto = CreateRegistrationFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]+$/, {
        message: 'Field key must contain only letters, numbers, hyphens, and underscores (e.g. areaId, voter_id, father_name)',
    }),
    __metadata("design:type", String)
], CreateRegistrationFieldDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Field label is required' }),
    __metadata("design:type", String)
], CreateRegistrationFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(registration_form_types_1.RegistrationFieldType, {
        message: `Field type must be one of: ${Object.values(registration_form_types_1.RegistrationFieldType).join(', ')}`,
    }),
    __metadata("design:type", String)
], CreateRegistrationFieldDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRegistrationFieldDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRegistrationFieldDto.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRegistrationFieldDto.prototype, "placeholder", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRegistrationFieldDto.prototype, "helpText", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRegistrationFieldDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRegistrationFieldDto.prototype, "isActive", void 0);
class UpdateRegistrationFieldDto {
}
exports.UpdateRegistrationFieldDto = UpdateRegistrationFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRegistrationFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(registration_form_types_1.RegistrationFieldType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRegistrationFieldDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRegistrationFieldDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateRegistrationFieldDto.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRegistrationFieldDto.prototype, "placeholder", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRegistrationFieldDto.prototype, "helpText", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRegistrationFieldDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRegistrationFieldDto.prototype, "isActive", void 0);
class BulkUpdateRegistrationFieldsDto {
}
exports.BulkUpdateRegistrationFieldsDto = BulkUpdateRegistrationFieldsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateRegistrationFieldDto),
    __metadata("design:type", Array)
], BulkUpdateRegistrationFieldsDto.prototype, "fields", void 0);
class CompleteCitizenProfileDto {
}
exports.CompleteCitizenProfileDto = CompleteCitizenProfileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteCitizenProfileDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteCitizenProfileDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteCitizenProfileDto.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteCitizenProfileDto.prototype, "areaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CompleteCitizenProfileDto.prototype, "customFields", void 0);
//# sourceMappingURL=registration-form.dto.js.map
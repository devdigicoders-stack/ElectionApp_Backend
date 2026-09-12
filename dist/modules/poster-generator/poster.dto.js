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
exports.QueryPosterTemplatesDto = exports.GeneratePosterDto = exports.UpdatePosterTemplateDto = exports.CreatePosterTemplateDto = exports.TemplateFieldDto = exports.TemplateStyleDto = exports.TemplatePositionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TemplatePositionDto {
}
exports.TemplatePositionDto = TemplatePositionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TemplatePositionDto.prototype, "x", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TemplatePositionDto.prototype, "y", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TemplatePositionDto.prototype, "width", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TemplatePositionDto.prototype, "height", void 0);
class TemplateStyleDto {
}
exports.TemplateStyleDto = TemplateStyleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TemplateStyleDto.prototype, "fontSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TemplateStyleDto.prototype, "fontColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TemplateStyleDto.prototype, "fontWeight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TemplateStyleDto.prototype, "textAlign", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['circle', 'rectangle', 'rounded']),
    __metadata("design:type", String)
], TemplateStyleDto.prototype, "maskShape", void 0);
class TemplateFieldDto {
}
exports.TemplateFieldDto = TemplateFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TemplateFieldDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TemplateFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['photo', 'text']),
    __metadata("design:type", String)
], TemplateFieldDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TemplateFieldDto.prototype, "editable", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TemplateFieldDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TemplateFieldDto.prototype, "defaultValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TemplatePositionDto)
], TemplateFieldDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TemplateStyleDto)
], TemplateFieldDto.prototype, "style", void 0);
class CreatePosterTemplateDto {
    constructor() {
        this.width = 1080;
        this.height = 1080;
        this.dimensionPreset = '1080x1080';
        this.includeTenantBranding = true;
        this.isActive = true;
        this.sortOrder = 0;
    }
}
exports.CreatePosterTemplateDto = CreatePosterTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Template title is required' }),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Template category is required' }),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "templateImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreatePosterTemplateDto.prototype, "width", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreatePosterTemplateDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['1080x1080', '1080x1350', '1080x1920', 'custom']),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "dimensionPreset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePosterTemplateDto.prototype, "fields", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePosterTemplateDto.prototype, "includeTenantBranding", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePosterTemplateDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePosterTemplateDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePosterTemplateDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePosterTemplateDto.prototype, "sortOrder", void 0);
class UpdatePosterTemplateDto {
}
exports.UpdatePosterTemplateDto = UpdatePosterTemplateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "templateImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePosterTemplateDto.prototype, "width", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePosterTemplateDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['1080x1080', '1080x1350', '1080x1920', 'custom']),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "dimensionPreset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdatePosterTemplateDto.prototype, "fields", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePosterTemplateDto.prototype, "includeTenantBranding", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePosterTemplateDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePosterTemplateDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePosterTemplateDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePosterTemplateDto.prototype, "sortOrder", void 0);
class GeneratePosterDto {
    constructor() {
        this.removeBg = false;
        this.format = 'png';
        this.includeBranding = true;
    }
}
exports.GeneratePosterDto = GeneratePosterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GeneratePosterDto.prototype, "fieldValues", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GeneratePosterDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GeneratePosterDto.prototype, "removeBg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['png', 'jpg', 'jpeg']),
    __metadata("design:type", String)
], GeneratePosterDto.prototype, "format", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GeneratePosterDto.prototype, "includeBranding", void 0);
class QueryPosterTemplatesDto {
    constructor() {
        this.includeExpired = false;
    }
}
exports.QueryPosterTemplatesDto = QueryPosterTemplatesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPosterTemplatesDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPosterTemplatesDto.prototype, "preset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPosterTemplatesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryPosterTemplatesDto.prototype, "includeExpired", void 0);
//# sourceMappingURL=poster.dto.js.map
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
exports.PosterTemplateSchema = exports.PosterTemplate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PosterTemplate = class PosterTemplate {
};
exports.PosterTemplate = PosterTemplate;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PosterTemplate.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], PosterTemplate.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], PosterTemplate.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], PosterTemplate.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PosterTemplate.prototype, "templateImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], PosterTemplate.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1080 }),
    __metadata("design:type", Number)
], PosterTemplate.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1080 }),
    __metadata("design:type", Number)
], PosterTemplate.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '1080x1080' }),
    __metadata("design:type", String)
], PosterTemplate.prototype, "dimensionPreset", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], PosterTemplate.prototype, "fields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PosterTemplate.prototype, "includeTenantBranding", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], PosterTemplate.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], PosterTemplate.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PosterTemplate.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PosterTemplate.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PosterTemplate.prototype, "usageCount", void 0);
exports.PosterTemplate = PosterTemplate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PosterTemplate);
exports.PosterTemplateSchema = mongoose_1.SchemaFactory.createForClass(PosterTemplate);
exports.PosterTemplateSchema.index({ tenantId: 1, category: 1, isActive: 1 });
exports.PosterTemplateSchema.index({ tenantId: 1, isActive: 1, expiresAt: 1 });
//# sourceMappingURL=poster-template.schema.js.map
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
exports.GeneratedPosterSchema = exports.GeneratedPoster = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let GeneratedPoster = class GeneratedPoster {
};
exports.GeneratedPoster = GeneratedPoster;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GeneratedPoster.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'PosterTemplate', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GeneratedPoster.prototype, "templateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GeneratedPoster.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GeneratedPoster.prototype, "outputUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'png' }),
    __metadata("design:type", String)
], GeneratedPoster.prototype, "format", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1080 }),
    __metadata("design:type", Number)
], GeneratedPoster.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1080 }),
    __metadata("design:type", Number)
], GeneratedPoster.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], GeneratedPoster.prototype, "downloadUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], GeneratedPoster.prototype, "shareText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], GeneratedPoster.prototype, "userPhotoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], GeneratedPoster.prototype, "fieldValues", void 0);
exports.GeneratedPoster = GeneratedPoster = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GeneratedPoster);
exports.GeneratedPosterSchema = mongoose_1.SchemaFactory.createForClass(GeneratedPoster);
exports.GeneratedPosterSchema.index({ tenantId: 1, userId: 1 });
exports.GeneratedPosterSchema.index({ tenantId: 1, templateId: 1 });
exports.GeneratedPosterSchema.index({ tenantId: 1, createdAt: -1 });
//# sourceMappingURL=generated-poster.schema.js.map
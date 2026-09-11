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
exports.BannerSchema = exports.Banner = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Banner = class Banner {
};
exports.Banner = Banner;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Banner.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Banner.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Banner.prototype, "mobileImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Banner.prototype, "linkUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'homepage' }),
    __metadata("design:type", String)
], Banner.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Banner.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Banner.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Banner.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Banner.prototype, "endDate", void 0);
exports.Banner = Banner = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Banner);
exports.BannerSchema = mongoose_1.SchemaFactory.createForClass(Banner);
exports.BannerSchema.index({ tenantId: 1, isActive: 1, sortOrder: 1 });
exports.BannerSchema.index({ tenantId: 1, category: 1, isActive: 1 });
//# sourceMappingURL=banner.schema.js.map
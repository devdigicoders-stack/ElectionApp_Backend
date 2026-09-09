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
exports.NewsSchema = exports.News = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let News = class News {
};
exports.News = News;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], News.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], News.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], News.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], News.prototype, "shortDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], News.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], News.prototype, "coverImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], News.prototype, "galleryImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, index: true }),
    __metadata("design:type", String)
], News.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: () => ({
            name: 'Office of Leader',
            role: 'Admin',
            avatarUrl: null,
        }),
    }),
    __metadata("design:type", Object)
], News.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now, index: true }),
    __metadata("design:type", Date)
], News.prototype, "publishDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(types_1.NewsStatus),
        default: types_1.NewsStatus.PUBLISHED,
        index: true,
    }),
    __metadata("design:type", String)
], News.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], News.prototype, "scheduledPublishDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], News.prototype, "areaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], News.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], News.prototype, "viewsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], News.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], News.prototype, "allowSharing", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], News.prototype, "createdBy", void 0);
exports.News = News = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], News);
exports.NewsSchema = mongoose_1.SchemaFactory.createForClass(News);
exports.NewsSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
exports.NewsSchema.index({ tenantId: 1, status: 1, publishDate: -1 });
exports.NewsSchema.index({ tenantId: 1, category: 1, status: 1 });
exports.NewsSchema.index({ tenantId: 1, isFeatured: 1, status: 1 });
//# sourceMappingURL=news.schema.js.map
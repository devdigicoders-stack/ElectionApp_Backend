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
exports.GalleryItemSchema = exports.GalleryItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let GalleryItem = class GalleryItem {
};
exports.GalleryItem = GalleryItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GalleryItem.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(types_1.GalleryType) }),
    __metadata("design:type", String)
], GalleryItem.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GalleryItem.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], GalleryItem.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], GalleryItem.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GalleryItem.prototype, "areaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], GalleryItem.prototype, "isPublished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], GalleryItem.prototype, "allowDownload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], GalleryItem.prototype, "sortOrder", void 0);
exports.GalleryItem = GalleryItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GalleryItem);
exports.GalleryItemSchema = mongoose_1.SchemaFactory.createForClass(GalleryItem);
exports.GalleryItemSchema.index({ tenantId: 1, type: 1, isPublished: 1 });
//# sourceMappingURL=gallery.schema.js.map
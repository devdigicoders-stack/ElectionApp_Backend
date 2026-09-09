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
exports.TenantFeatureSchema = exports.TenantFeature = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let TenantFeature = class TenantFeature {
};
exports.TenantFeature = TenantFeature;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TenantFeature.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(types_1.FeatureKey) }),
    __metadata("design:type", String)
], TenantFeature.prototype, "featureKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TenantFeature.prototype, "isEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], TenantFeature.prototype, "config", void 0);
exports.TenantFeature = TenantFeature = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TenantFeature);
exports.TenantFeatureSchema = mongoose_1.SchemaFactory.createForClass(TenantFeature);
exports.TenantFeatureSchema.index({ tenantId: 1, featureKey: 1 }, { unique: true });
//# sourceMappingURL=tenant-feature.schema.js.map
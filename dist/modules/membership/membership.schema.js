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
exports.MembershipSchema = exports.Membership = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let Membership = class Membership {
};
exports.Membership = Membership;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Membership.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Membership.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: types_1.MembershipStatus.PENDING, enum: Object.values(types_1.MembershipStatus) }),
    __metadata("design:type", String)
], Membership.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Membership.prototype, "membershipNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Active Member' }),
    __metadata("design:type", String)
], Membership.prototype, "designation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Membership.prototype, "photoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Membership.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Membership.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Membership.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Membership.prototype, "cardIssuedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Membership.prototype, "cardVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Membership.prototype, "verificationUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Membership.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Membership.prototype, "paymentInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Membership.prototype, "cardUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Membership.prototype, "customData", void 0);
exports.Membership = Membership = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Membership);
exports.MembershipSchema = mongoose_1.SchemaFactory.createForClass(Membership);
exports.MembershipSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
exports.MembershipSchema.index({ tenantId: 1, status: 1 });
exports.MembershipSchema.index({ tenantId: 1, membershipNumber: 1 });
//# sourceMappingURL=membership.schema.js.map
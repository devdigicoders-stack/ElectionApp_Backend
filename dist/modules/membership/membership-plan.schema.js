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
exports.MembershipPlanSchema = exports.MembershipPlan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MembershipPlan = class MembershipPlan {
};
exports.MembershipPlan = MembershipPlan;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MembershipPlan.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], MembershipPlan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, uppercase: true }),
    __metadata("design:type", String)
], MembershipPlan.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], MembershipPlan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], MembershipPlan.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR', uppercase: true }),
    __metadata("design:type", String)
], MembershipPlan.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 365, min: 0 }),
    __metadata("design:type", Number)
], MembershipPlan.prototype, "validityDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'MEMBER' }),
    __metadata("design:type", String)
], MembershipPlan.prototype, "badgeText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#f59e0b' }),
    __metadata("design:type", String)
], MembershipPlan.prototype, "badgeColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], MembershipPlan.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MembershipPlan.prototype, "requiresApproval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], MembershipPlan.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], MembershipPlan.prototype, "sortOrder", void 0);
exports.MembershipPlan = MembershipPlan = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MembershipPlan);
exports.MembershipPlanSchema = mongoose_1.SchemaFactory.createForClass(MembershipPlan);
exports.MembershipPlanSchema.index({ tenantId: 1, code: 1 }, { unique: true });
exports.MembershipPlanSchema.index({ tenantId: 1, isActive: 1, sortOrder: 1 });
//# sourceMappingURL=membership-plan.schema.js.map
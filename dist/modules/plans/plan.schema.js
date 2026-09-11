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
exports.PlanSchema = exports.Plan = exports.PlanOverageRates = exports.PlanLimits = exports.TargetSegment = exports.SupportLevel = exports.BillingCycle = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "monthly";
    BillingCycle["QUARTERLY"] = "quarterly";
    BillingCycle["YEARLY"] = "yearly";
    BillingCycle["ONE_TIME"] = "one_time";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
var SupportLevel;
(function (SupportLevel) {
    SupportLevel["COMMUNITY"] = "community";
    SupportLevel["EMAIL_24H"] = "email_24h";
    SupportLevel["PRIORITY_WHATSAPP"] = "priority_whatsapp";
    SupportLevel["DEDICATED_MANAGER"] = "dedicated_manager";
})(SupportLevel || (exports.SupportLevel = SupportLevel = {}));
var TargetSegment;
(function (TargetSegment) {
    TargetSegment["GRAM_PANCHAYAT"] = "gram_panchayat";
    TargetSegment["MUNICIPAL_WARD"] = "municipal_ward";
    TargetSegment["VIDHAN_SABHA"] = "vidhan_sabha";
    TargetSegment["LOK_SABHA"] = "lok_sabha";
    TargetSegment["POLITICAL_PARTY"] = "political_party";
    TargetSegment["ALL"] = "all";
})(TargetSegment || (exports.TargetSegment = TargetSegment = {}));
let PlanLimits = class PlanLimits {
};
exports.PlanLimits = PlanLimits;
__decorate([
    (0, mongoose_1.Prop)({ default: -1 }),
    __metadata("design:type", Number)
], PlanLimits.prototype, "maxCitizens", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: -1 }),
    __metadata("design:type", Number)
], PlanLimits.prototype, "maxStaffUsers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: -1 }),
    __metadata("design:type", Number)
], PlanLimits.prototype, "maxPostersPerMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: -1 }),
    __metadata("design:type", Number)
], PlanLimits.prototype, "maxNotificationsPerMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: -1 }),
    __metadata("design:type", Number)
], PlanLimits.prototype, "maxStorageMB", void 0);
exports.PlanLimits = PlanLimits = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PlanLimits);
let PlanOverageRates = class PlanOverageRates {
};
exports.PlanOverageRates = PlanOverageRates;
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PlanOverageRates.prototype, "citizenPer1kRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PlanOverageRates.prototype, "storagePerGbRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PlanOverageRates.prototype, "smsRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PlanOverageRates.prototype, "whatsappRate", void 0);
exports.PlanOverageRates = PlanOverageRates = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PlanOverageRates);
let Plan = class Plan {
};
exports.Plan = Plan;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Plan.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR' }),
    __metadata("design:type", String)
], Plan.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Object.values(BillingCycle), default: BillingCycle.YEARLY }),
    __metadata("design:type", String)
], Plan.prototype, "billingCycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 14, min: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "trialDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(SupportLevel),
        default: SupportLevel.EMAIL_24H,
    }),
    __metadata("design:type", String)
], Plan.prototype, "supportLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(TargetSegment),
        default: TargetSegment.VIDHAN_SABHA,
    }),
    __metadata("design:type", String)
], Plan.prototype, "targetSegment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Plan.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PlanLimits, default: () => ({}) }),
    __metadata("design:type", PlanLimits)
], Plan.prototype, "limits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PlanOverageRates, default: () => ({}) }),
    __metadata("design:type", PlanOverageRates)
], Plan.prototype, "overageRates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Plan.prototype, "isPopular", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Plan.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "sortOrder", void 0);
exports.Plan = Plan = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Plan);
exports.PlanSchema = mongoose_1.SchemaFactory.createForClass(Plan);
exports.PlanSchema.index({ isActive: 1, sortOrder: 1 });
exports.PlanSchema.index({ targetSegment: 1, supportLevel: 1 });
//# sourceMappingURL=plan.schema.js.map
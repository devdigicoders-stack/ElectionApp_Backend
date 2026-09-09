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
exports.SubscriptionSchema = exports.Subscription = exports.SubscriptionTimelineItem = exports.PaymentMethod = exports.SubscriptionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_schema_1 = require("../plans/plan.schema");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["EXPIRED"] = "expired";
    SubscriptionStatus["PAUSED"] = "paused";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["UPI"] = "upi";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["NET_BANKING"] = "net_banking";
    PaymentMethod["MANUAL_CASH"] = "manual_cash";
    PaymentMethod["CHEQUE"] = "cheque";
    PaymentMethod["FREE_TRIAL"] = "free_trial";
    PaymentMethod["OTHER"] = "other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let SubscriptionTimelineItem = class SubscriptionTimelineItem {
};
exports.SubscriptionTimelineItem = SubscriptionTimelineItem;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SubscriptionTimelineItem.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Plan', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SubscriptionTimelineItem.prototype, "fromPlanId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Plan', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SubscriptionTimelineItem.prototype, "toPlanId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], SubscriptionTimelineItem.prototype, "fromStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], SubscriptionTimelineItem.prototype, "toStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'super_admin' }),
    __metadata("design:type", String)
], SubscriptionTimelineItem.prototype, "performedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], SubscriptionTimelineItem.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], SubscriptionTimelineItem.prototype, "note", void 0);
exports.SubscriptionTimelineItem = SubscriptionTimelineItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SubscriptionTimelineItem);
let Subscription = class Subscription {
};
exports.Subscription = Subscription;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Plan', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.ACTIVE,
        index: true,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(plan_schema_1.BillingCycle),
        default: plan_schema_1.BillingCycle.YEARLY,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "amountPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR' }),
    __metadata("design:type", String)
], Subscription.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialEndsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "autoRenew", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(PaymentMethod),
        default: PaymentMethod.BANK_TRANSFER,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Subscription.prototype, "invoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Subscription.prototype, "cancelReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Subscription.prototype, "pausedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Subscription.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SubscriptionTimelineItem], default: [] }),
    __metadata("design:type", Array)
], Subscription.prototype, "timeline", void 0);
exports.Subscription = Subscription = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subscription);
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
exports.SubscriptionSchema.index({ tenantId: 1, status: 1 });
exports.SubscriptionSchema.index({ endDate: 1, status: 1 });
exports.SubscriptionSchema.index({ createdAt: -1 });
//# sourceMappingURL=subscription.schema.js.map
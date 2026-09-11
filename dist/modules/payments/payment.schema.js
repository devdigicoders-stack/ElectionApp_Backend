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
exports.PaymentSchema = exports.Payment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let Payment = class Payment {
};
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payment.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "receipt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.PaymentPurpose),
        default: types_1.PaymentPurpose.MEMBERSHIP_FEE,
    }),
    __metadata("design:type", String)
], Payment.prototype, "purpose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amountInPaise", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.PaymentStatus),
        default: types_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'razorpay' }),
    __metadata("design:type", String)
], Payment.prototype, "gateway", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Payment.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, index: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Payment.prototype, "signature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Membership', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payment.prototype, "membershipId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'MembershipPlan', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payment.prototype, "membershipPlanId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Event', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Payment.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Payment.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Payment.prototype, "failedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Payment.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            refundId: String,
            amount: Number,
            refundedAt: Date,
            reason: String,
        },
        default: null,
    }),
    __metadata("design:type", Object)
], Payment.prototype, "refundDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Payment.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Payment.prototype, "rawResponse", void 0);
exports.Payment = Payment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payment);
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
exports.PaymentSchema.index({ tenantId: 1, status: 1 });
exports.PaymentSchema.index({ tenantId: 1, userId: 1 });
exports.PaymentSchema.index({ tenantId: 1, orderId: 1 });
exports.PaymentSchema.index({ tenantId: 1, receipt: 1 });
exports.PaymentSchema.index({ tenantId: 1, createdAt: -1 });
//# sourceMappingURL=payment.schema.js.map
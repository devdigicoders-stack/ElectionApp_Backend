import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus, PaymentPurpose } from '../../shared/types';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  receipt: string; // Format: REC-YYYY-000001

  @Prop({
    type: String,
    enum: Object.values(PaymentPurpose),
    default: PaymentPurpose.MEMBERSHIP_FEE,
  })
  purpose: PaymentPurpose;

  @Prop({ required: true })
  amount: number; // In Indian Rupees (INR)

  @Prop({ required: true })
  amountInPaise: number; // amount * 100

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop({ default: 'razorpay' })
  gateway: string;

  @Prop({ required: true, index: true })
  orderId: string; // Razorpay Order ID (e.g. order_O8k...)

  @Prop({ default: null, index: true })
  paymentId?: string; // Razorpay Payment ID (e.g. pay_O8k...)

  @Prop({ default: null })
  signature?: string;

  @Prop({ type: Types.ObjectId, ref: 'Membership', default: null })
  membershipId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MembershipPlan', default: null })
  membershipPlanId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', default: null })
  eventId?: Types.ObjectId;

  @Prop({ default: null })
  paidAt?: Date;

  @Prop({ default: null })
  failedAt?: Date;

  @Prop({ default: null })
  failureReason?: string;

  @Prop({
    type: {
      refundId: String,
      amount: Number,
      refundedAt: Date,
      reason: String,
    },
    default: null,
  })
  refundDetails?: {
    refundId?: string;
    amount?: number;
    refundedAt?: Date;
    reason?: string;
  };

  @Prop({ type: Object, default: {} })
  notes?: Record<string, any>;

  @Prop({ type: Object, default: {} })
  rawResponse?: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ tenantId: 1, status: 1 });
PaymentSchema.index({ tenantId: 1, userId: 1 });
PaymentSchema.index({ tenantId: 1, orderId: 1 });
PaymentSchema.index({ tenantId: 1, receipt: 1 });
PaymentSchema.index({ tenantId: 1, createdAt: -1 });

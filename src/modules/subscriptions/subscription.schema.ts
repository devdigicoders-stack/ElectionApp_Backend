import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BillingCycle } from '../plans/plan.schema';

export type SubscriptionDocument = Subscription & Document;

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PAUSED = 'paused',
}

export enum PaymentMethod {
  UPI = 'upi',
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  NET_BANKING = 'net_banking',
  MANUAL_CASH = 'manual_cash',
  CHEQUE = 'cheque',
  FREE_TRIAL = 'free_trial',
  OTHER = 'other',
}

@Schema({ _id: false })
export class SubscriptionTimelineItem {
  @Prop({ required: true })
  action: string; // e.g. 'created', 'renewed', 'upgraded', 'trial_extended', 'canceled', 'paused', 'resumed'

  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  fromPlanId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  toPlanId?: Types.ObjectId;

  @Prop({ default: null })
  fromStatus?: string;

  @Prop({ default: null })
  toStatus?: string;

  @Prop({ default: 'super_admin' })
  performedBy: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: '' })
  note?: string;
}

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true, index: true })
  planId: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.ACTIVE,
    index: true,
  })
  status: SubscriptionStatus;

  @Prop({
    required: true,
    enum: Object.values(BillingCycle),
    default: BillingCycle.YEARLY,
  })
  billingCycle: BillingCycle;

  @Prop({ required: true, min: 0 })
  amountPaid: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ required: true, default: Date.now })
  startDate: Date;

  @Prop({ required: true, index: true })
  endDate: Date;

  @Prop({ default: null })
  trialEndsAt?: Date;

  @Prop({ default: false })
  autoRenew: boolean;

  @Prop({
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.BANK_TRANSFER,
  })
  paymentMethod: PaymentMethod;

  @Prop({ default: '' })
  paymentReference?: string; // UTR, Transaction ID, Cheque No

  @Prop({ required: true, unique: true })
  invoiceNumber: string; // e.g. INV-2026-00001

  @Prop({ default: null })
  cancelledAt?: Date;

  @Prop({ default: '' })
  cancelReason?: string;

  @Prop({ default: null })
  pausedAt?: Date;

  @Prop({ default: '' })
  notes?: string;

  @Prop({ type: [SubscriptionTimelineItem], default: [] })
  timeline: SubscriptionTimelineItem[];
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
SubscriptionSchema.index({ tenantId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1, status: 1 });
SubscriptionSchema.index({ createdAt: -1 });

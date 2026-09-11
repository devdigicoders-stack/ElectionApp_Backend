import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time',
}

export enum SupportLevel {
  COMMUNITY = 'community',
  EMAIL_24H = 'email_24h',
  PRIORITY_WHATSAPP = 'priority_whatsapp',
  DEDICATED_MANAGER = 'dedicated_manager',
}

export enum TargetSegment {
  GRAM_PANCHAYAT = 'gram_panchayat',
  MUNICIPAL_WARD = 'municipal_ward',
  VIDHAN_SABHA = 'vidhan_sabha',
  LOK_SABHA = 'lok_sabha',
  POLITICAL_PARTY = 'political_party',
  ALL = 'all',
}

@Schema({ _id: false })
export class PlanLimits {
  @Prop({ default: -1 })
  maxCitizens: number; // -1 means unlimited

  @Prop({ default: -1 })
  maxStaffUsers: number;

  @Prop({ default: -1 })
  maxPostersPerMonth: number;

  @Prop({ default: -1 })
  maxNotificationsPerMonth: number;

  @Prop({ default: -1 })
  maxStorageMB: number;
}

@Schema({ _id: false })
export class PlanOverageRates {
  @Prop({ default: 0 })
  citizenPer1kRate: number; // e.g. ₹500 per 1,000 citizens

  @Prop({ default: 0 })
  storagePerGbRate: number; // e.g. ₹100 per 1 GB storage

  @Prop({ default: 0 })
  smsRate: number; // e.g. ₹0.25 per SMS

  @Prop({ default: 0 })
  whatsappRate: number; // e.g. ₹0.65 per WhatsApp message
}

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, trim: true })
  name: string; // e.g. "Vidhan Sabha Pro"

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string; // e.g. "vidhan-sabha-pro"

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number; // in INR (or currency)

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ required: true, enum: Object.values(BillingCycle), default: BillingCycle.YEARLY })
  billingCycle: BillingCycle;

  @Prop({ default: 14, min: 0 })
  trialDays: number;

  @Prop({
    required: true,
    enum: Object.values(SupportLevel),
    default: SupportLevel.EMAIL_24H,
  })
  supportLevel: SupportLevel;

  @Prop({
    required: true,
    enum: Object.values(TargetSegment),
    default: TargetSegment.VIDHAN_SABHA,
  })
  targetSegment: TargetSegment;

  @Prop({ type: [String], default: [] })
  features: string[]; // enabled feature keys for this plan

  @Prop({ type: PlanLimits, default: () => ({}) })
  limits: PlanLimits;

  @Prop({ type: PlanOverageRates, default: () => ({}) })
  overageRates: PlanOverageRates;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
PlanSchema.index({ isActive: 1, sortOrder: 1 });
PlanSchema.index({ targetSegment: 1, supportLevel: 1 });

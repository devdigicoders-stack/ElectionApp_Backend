import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time',
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

  @Prop({ type: [String], default: [] })
  features: string[]; // enabled feature keys for this plan

  @Prop({ type: PlanLimits, default: () => ({}) })
  limits: PlanLimits;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
PlanSchema.index({ isActive: 1, sortOrder: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MembershipPlanDocument = MembershipPlan & Document;

@Schema({ timestamps: true })
export class MembershipPlan {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string; // e.g. "Primary Member", "Active Member", "Patron Member"

  @Prop({ required: true, trim: true, uppercase: true })
  code: string; // e.g. "PRIMARY", "ACTIVE", "PATRON"

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: 0, min: 0 })
  price: number; // 0 for free membership

  @Prop({ default: 'INR', uppercase: true })
  currency: string;

  @Prop({ default: 365, min: 0 })
  validityDays: number; // 0 = Lifetime validity, 365 = 1 year

  @Prop({ default: 'MEMBER' })
  badgeText?: string; // e.g. "ACTIVE", "VIP", "OFFICIAL", "PATRON"

  @Prop({ default: '#f59e0b' })
  badgeColor?: string; // Hex color for badge

  @Prop({ type: [String], default: [] })
  benefits: string[]; // List of perks / benefits

  @Prop({ default: false })
  requiresApproval: boolean; // if false and (price === 0 or paid), auto-approve immediately

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const MembershipPlanSchema = SchemaFactory.createForClass(MembershipPlan);
MembershipPlanSchema.index({ tenantId: 1, code: 1 }, { unique: true });
MembershipPlanSchema.index({ tenantId: 1, isActive: 1, sortOrder: 1 });

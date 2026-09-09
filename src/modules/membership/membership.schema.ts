import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MembershipStatus } from '../../shared/types';

export type MembershipDocument = Membership & Document;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: MembershipStatus.PENDING, enum: Object.values(MembershipStatus) })
  status: MembershipStatus;

  @Prop({ default: null })
  membershipNumber?: string;

  @Prop({ default: 'Active Member' })
  designation?: string;

  @Prop({ default: null })
  photoUrl?: string;

  @Prop({ default: null })
  approvedBy?: Types.ObjectId;

  @Prop({ default: null })
  approvedAt?: Date;

  @Prop({ default: null })
  expiresAt?: Date;

  @Prop({ default: null })
  cardIssuedAt?: Date;

  @Prop({ default: 1 })
  cardVersion?: number;

  @Prop({ default: null })
  verificationUrl?: string;

  @Prop({ default: null })
  rejectionReason?: string;

  @Prop({ type: Object, default: {} })
  paymentInfo?: { amount?: number; transactionId?: string; paidAt?: Date };

  @Prop({ default: null })
  cardUrl?: string; // digital membership card URL

  @Prop({ type: Object, default: {} })
  customData?: Record<string, any>;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
MembershipSchema.index({ tenantId: 1, status: 1 });
MembershipSchema.index({ tenantId: 1, membershipNumber: 1 });

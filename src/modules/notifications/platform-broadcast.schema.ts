import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlatformBroadcastDocument = PlatformBroadcast & Document;

export enum BroadcastTarget {
  ALL_TENANTS = 'ALL_TENANTS',
  BY_PLAN = 'BY_PLAN',
  BY_STATUS = 'BY_STATUS',
  SPECIFIC_TENANTS = 'SPECIFIC_TENANTS',
  SYSTEM_STAFF = 'SYSTEM_STAFF',
}

export enum BroadcastType {
  ANNOUNCEMENT = 'announcement',
  MAINTENANCE = 'maintenance',
  BILLING = 'billing',
  FEATURE = 'feature',
  ALERT = 'alert',
}

export enum BroadcastPriority {
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Schema({ timestamps: true })
export class PlatformBroadcast {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({
    required: true,
    enum: Object.values(BroadcastType),
    default: BroadcastType.ANNOUNCEMENT,
  })
  type: BroadcastType;

  @Prop({
    required: true,
    enum: Object.values(BroadcastPriority),
    default: BroadcastPriority.NORMAL,
  })
  priority: BroadcastPriority;

  @Prop({
    required: true,
    enum: Object.values(BroadcastTarget),
    default: BroadcastTarget.ALL_TENANTS,
  })
  targetAudience: BroadcastTarget;

  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  targetPlanId?: Types.ObjectId;

  @Prop({ default: null })
  targetStatus?: string; // e.g. 'active', 'trial', 'expired'

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tenant' }], default: [] })
  targetTenantIds: Types.ObjectId[];

  @Prop({ type: [String], default: ['in_app'] })
  channels: string[]; // e.g. ['in_app', 'push']

  @Prop({ default: null })
  actionUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', required: true })
  sentBy: Types.ObjectId;

  @Prop({ required: true })
  sentByName: string;

  @Prop({ default: 0 })
  recipientCount: number;

  @Prop({ default: 0 })
  pushSuccessCount: number;

  @Prop({ default: 0 })
  pushFailureCount: number;

  @Prop({ default: true })
  isSent: boolean;

  @Prop({ default: () => new Date() })
  sentAt: Date;
}

export const PlatformBroadcastSchema = SchemaFactory.createForClass(PlatformBroadcast);
PlatformBroadcastSchema.index({ createdAt: -1 });
PlatformBroadcastSchema.index({ targetAudience: 1, type: 1 });

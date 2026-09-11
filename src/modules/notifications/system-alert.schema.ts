import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SystemAlertDocument = SystemAlert & Document;

export enum AlertType {
  ALERT = 'alert',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum AlertCategory {
  SYSTEM = 'system',
  TENANT = 'tenant',
  SUBSCRIPTION = 'subscription',
  PAYMENT = 'payment',
  DOMAIN = 'domain',
  SECURITY = 'security',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true })
export class SystemAlert {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({
    required: true,
    enum: Object.values(AlertType),
    default: AlertType.INFO,
  })
  type: AlertType;

  @Prop({
    required: true,
    enum: Object.values(AlertCategory),
    default: AlertCategory.SYSTEM,
  })
  category: AlertCategory;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'AdminUser' }], default: [] })
  readBy: Types.ObjectId[];

  @Prop({ default: null })
  actionUrl?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export const SystemAlertSchema = SchemaFactory.createForClass(SystemAlert);
SystemAlertSchema.index({ createdAt: -1 });
SystemAlertSchema.index({ isRead: 1, createdAt: -1 });

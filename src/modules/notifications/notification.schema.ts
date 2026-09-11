import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationTarget } from '../../shared/types';

export type NotificationDocument = Notification & Document;
export type NotificationReadDocument = NotificationRead & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: null })
  imageUrl?: string;

  @Prop({ default: null })
  linkUrl?: string;

  @Prop({ default: 'push' })
  channel?: string;

  @Prop({ required: true, enum: Object.values(NotificationTarget) })
  target: NotificationTarget;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  targetAreaId?: Types.ObjectId; // used when target = 'area'

  @Prop({ type: [Types.ObjectId], default: [] })
  targetUserIds: Types.ObjectId[]; // used when target = 'specific'

  @Prop({ default: false })
  isSent: boolean;

  @Prop({ default: null })
  sentAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ tenantId: 1, createdAt: -1 });

@Schema({ timestamps: true })
export class NotificationRead {
  @Prop({ type: Types.ObjectId, ref: 'Notification', required: true })
  notificationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationReadSchema = SchemaFactory.createForClass(NotificationRead);
NotificationReadSchema.index({ notificationId: 1, userId: 1 }, { unique: true });
NotificationReadSchema.index({ userId: 1, isRead: 1 });

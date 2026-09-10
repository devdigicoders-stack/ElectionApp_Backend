import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventRsvpStatus } from '../../shared/types';

export type EventRsvpDocument = EventRsvp & Document;

@Schema({ timestamps: true })
export class EventRsvp {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true, index: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(EventRsvpStatus),
    default: EventRsvpStatus.GOING,
  })
  status: EventRsvpStatus;

  @Prop({ default: null, index: true })
  ticketNumber?: string; // e.g. "EVT-2026-000123"

  @Prop({ default: null })
  qrData?: string; // Scannable payload for QR check-in

  @Prop({ default: false })
  isCheckedIn: boolean;

  @Prop({ default: null })
  checkedInAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  checkedInBy?: Types.ObjectId;

  @Prop({ default: '' })
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EventRsvpSchema = SchemaFactory.createForClass(EventRsvp);
EventRsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });
EventRsvpSchema.index({ tenantId: 1, ticketNumber: 1 });
EventRsvpSchema.index({ eventId: 1, isCheckedIn: 1 });
EventRsvpSchema.index({ tenantId: 1, eventId: 1, status: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventStatus, EventType } from '../../shared/types';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(EventType),
    default: EventType.JAN_SABHA,
  })
  category: string; // Jan Sabha, Rally, Public Meeting, Membership Campaign, etc.

  @Prop({ default: null })
  bannerUrl?: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: null })
  endDate?: Date;

  @Prop({ default: '' })
  startTime?: string; // e.g. "10:00 AM"

  @Prop({ default: '' })
  endTime?: string; // e.g. "01:00 PM"

  @Prop({ default: '' })
  location?: string; // Venue / Ground / Hall name

  @Prop({ default: null })
  mapLink?: string; // Google Maps URL

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  areaId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: false })
  registrationRequired: boolean;

  @Prop({ default: null })
  maximumParticipants?: number; // Capacity limit

  @Prop({ default: 0 })
  registeredCount: number;

  @Prop({ default: 0 })
  checkedInCount: number;

  @Prop({ default: 0 })
  interestedCount: number;

  @Prop({ default: 0 })
  goingCount: number;

  @Prop({
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Prop({ default: '' })
  organizerName?: string;

  @Prop({ default: '' })
  organizerPhone?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ tenantId: 1, startDate: -1 });
EventSchema.index({ tenantId: 1, status: 1 });
EventSchema.index({ tenantId: 1, category: 1 });
EventSchema.index({ tenantId: 1, areaId: 1 });
EventSchema.index({ tenantId: 1, isPublished: 1 });

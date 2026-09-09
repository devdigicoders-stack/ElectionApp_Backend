import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: null })
  description?: string;

  @Prop({ required: true })
  eventType: string; // Jan Sabha, Rally, Meeting, etc.

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: null })
  endDate?: Date;

  @Prop({ default: null })
  location?: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  areaId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: 0 })
  interestedCount: number;

  @Prop({ default: 0 })
  goingCount: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ tenantId: 1, startDate: -1 });

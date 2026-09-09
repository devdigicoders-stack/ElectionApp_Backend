import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventRsvpStatus } from '../../shared/types';

export type EventRsvpDocument = EventRsvp & Document;

@Schema({ timestamps: true })
export class EventRsvp {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(EventRsvpStatus) })
  status: EventRsvpStatus;
}

export const EventRsvpSchema = SchemaFactory.createForClass(EventRsvp);
EventRsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });

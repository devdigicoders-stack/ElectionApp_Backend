import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VolunteerStatus } from '../../shared/types';

export type VolunteerDocument = Volunteer & Document;

@Schema({ timestamps: true })
export class Volunteer {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: null })
  role?: string; // e.g. "Ward Coordinator", "Booth Agent"

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  assignedAreaId?: Types.ObjectId;

  @Prop({ default: VolunteerStatus.ACTIVE, enum: Object.values(VolunteerStatus) })
  status: VolunteerStatus;

  @Prop({ type: [String], default: [] })
  tasks: string[];

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  assignedBy?: Types.ObjectId;

  @Prop({ default: null })
  notes?: string;
}

export const VolunteerSchema = SchemaFactory.createForClass(Volunteer);
VolunteerSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
VolunteerSchema.index({ tenantId: 1, assignedAreaId: 1 });

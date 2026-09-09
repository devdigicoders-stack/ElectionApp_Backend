import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ComplaintStatus } from '../../shared/types';

export type ComplaintDocument = Complaint & Document;

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  complaintNumber: string; // e.g. CMP-2024-00001

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: true })
  areaId: Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  mediaUrls: string[];

  @Prop({ default: ComplaintStatus.SUBMITTED, enum: Object.values(ComplaintStatus) })
  status: ComplaintStatus;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  assignedTo?: Types.ObjectId;

  @Prop({
    type: [{ status: String, note: String, updatedBy: Types.ObjectId, updatedAt: Date }],
    default: [],
  })
  timeline: { status: string; note?: string; updatedBy?: Types.ObjectId; updatedAt: Date }[];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
ComplaintSchema.index({ tenantId: 1, status: 1 });
ComplaintSchema.index({ tenantId: 1, areaId: 1 });
ComplaintSchema.index({ tenantId: 1, userId: 1 });

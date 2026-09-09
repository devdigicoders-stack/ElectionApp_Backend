import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskPriority, VolunteerTaskStatus } from '../../shared/types';

export type VolunteerTaskDocument = VolunteerTask & Document;

@Schema({ timestamps: true })
export class VolunteerTask {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Volunteer', default: null, index: true })
  assignedVolunteerId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null, index: true })
  assignedUserId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null, index: true })
  areaId?: Types.ObjectId;

  @Prop({ default: null })
  dueDate?: Date;

  @Prop({
    required: true,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
    index: true,
  })
  priority: TaskPriority;

  @Prop({
    required: true,
    enum: Object.values(VolunteerTaskStatus),
    default: VolunteerTaskStatus.PENDING,
    index: true,
  })
  status: VolunteerTaskStatus;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  // Volunteer Submission (Proof of Work)
  @Prop({
    type: Object,
    default: null,
  })
  submission?: {
    submittedAt: Date;
    completionRemark: string;
    images: string[];
    reportUrl?: string;
    submittedBy: Types.ObjectId;
  };

  // Admin Review / Approval
  @Prop({
    type: Object,
    default: null,
  })
  review?: {
    reviewedAt: Date;
    reviewedBy: Types.ObjectId;
    reviewNote?: string;
    isApproved: boolean;
  };

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', required: true })
  createdBy: Types.ObjectId;
}

export const VolunteerTaskSchema = SchemaFactory.createForClass(VolunteerTask);
VolunteerTaskSchema.index({ tenantId: 1, status: 1 });
VolunteerTaskSchema.index({ tenantId: 1, assignedVolunteerId: 1 });
VolunteerTaskSchema.index({ tenantId: 1, assignedUserId: 1 });
VolunteerTaskSchema.index({ tenantId: 1, areaId: 1 });
VolunteerTaskSchema.index({ tenantId: 1, priority: 1 });
VolunteerTaskSchema.index({ tenantId: 1, dueDate: 1 });

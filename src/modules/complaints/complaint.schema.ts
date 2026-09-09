import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ComplaintStatus, ComplaintPriority } from '../../shared/types';

export type ComplaintDocument = Complaint & Document;

export interface IComplaintRemark {
  remark: string;
  addedBy?: Types.ObjectId;
  addedByName?: string;
  isInternal?: boolean;
  createdAt: Date;
}

export interface IComplaintTimelineEvent {
  status: string;
  note?: string;
  action?: string;
  updatedBy?: Types.ObjectId;
  updatedByName?: string;
  updatedByRole?: string;
  isInternal?: boolean;
  proofUrls?: string[];
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  complaintNumber: string; // Format: CMP-2026-000001 (SRS Sec 15)

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

  // Media attachments (photos/documents uploaded by citizen)
  @Prop({ type: [String], default: [] })
  attachments: string[];

  // Legacy field preserved for backward compatibility
  @Prop({ type: [String], default: [] })
  mediaUrls: string[];

  // Optional video URL (SRS Sec 15: "Optional Video")
  @Prop({ default: null })
  videoUrl?: string;

  // Status Lifecycle (SRS Sec 15: Submitted, Under Review, Assigned, In Progress, Resolved, Closed, Rejected)
  @Prop({
    type: String,
    enum: Object.values(ComplaintStatus),
    default: ComplaintStatus.SUBMITTED,
  })
  status: ComplaintStatus;

  // Priority Levels (SRS Sec 16: Low, Medium, High, Urgent)
  @Prop({
    type: String,
    enum: Object.values(ComplaintPriority),
    default: ComplaintPriority.MEDIUM,
  })
  priority: ComplaintPriority;

  // Assignment (SRS Sec 16: "Assign complaint")
  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  assignedTo?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  assignedBy?: Types.ObjectId;

  @Prop({ default: null })
  assignedAt?: Date;

  // Internal Remarks (visible only to Admin team - SRS Sec 16)
  @Prop({
    type: [
      {
        remark: String,
        addedBy: { type: Types.ObjectId, ref: 'AdminUser' },
        addedByName: String,
        isInternal: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  internalRemarks: IComplaintRemark[];

  // Public Remarks (visible to citizen - SRS Sec 16)
  @Prop({
    type: [
      {
        remark: String,
        addedBy: { type: Types.ObjectId, ref: 'AdminUser' },
        addedByName: String,
        isInternal: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  publicRemarks: IComplaintRemark[];

  // Resolution Details & Proof (SRS Sec 15 & 16: "Upload resolution proof", "Resolution Details")
  @Prop({ default: null })
  resolutionDetails?: string;

  @Prop({ type: [String], default: [] })
  resolutionProof: string[];

  @Prop({ default: null })
  resolvedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  resolvedBy?: Types.ObjectId;

  // Closure Details
  @Prop({ default: null })
  closedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  closedBy?: Types.ObjectId;

  @Prop({ default: null })
  closingNote?: string;

  // Rejection Details
  @Prop({ default: null })
  rejectionReason?: string;

  @Prop({ default: null })
  rejectedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  rejectedBy?: Types.ObjectId;

  // Complete Audit & Status Timeline (SRS Sec 15: "Timeline & Status history")
  @Prop({
    type: [
      {
        status: String,
        note: String,
        action: String,
        updatedBy: Types.ObjectId,
        updatedByName: String,
        updatedByRole: String,
        isInternal: { type: Boolean, default: false },
        proofUrls: [String],
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  timeline: IComplaintTimelineEvent[];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

// Performance Indexes
ComplaintSchema.index({ tenantId: 1, status: 1 });
ComplaintSchema.index({ tenantId: 1, priority: 1 });
ComplaintSchema.index({ tenantId: 1, areaId: 1 });
ComplaintSchema.index({ tenantId: 1, category: 1 });
ComplaintSchema.index({ tenantId: 1, userId: 1 });
ComplaintSchema.index({ tenantId: 1, assignedTo: 1 });
ComplaintSchema.index({ tenantId: 1, createdAt: -1 });
ComplaintSchema.index({ tenantId: 1, complaintNumber: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', default: null, index: true })
  tenantId?: Types.ObjectId;

  @Prop({ default: null })
  tenantName?: string;

  @Prop({ required: true, index: true })
  action: string; // e.g. 'TENANT_IMPERSONATION_STARTED', 'TENANT_IMPERSONATION_ENDED', 'TENANT_SUSPENDED', etc.

  @Prop({ type: Object, required: true })
  performedBy: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };

  @Prop({ type: Object, default: null })
  targetUser?: {
    id: string;
    email: string;
    name?: string;
  };

  @Prop({ type: Object, default: {} })
  details: Record<string, any>;

  @Prop({ default: null })
  ipAddress?: string;

  @Prop({ default: null })
  userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ tenantId: 1, action: 1 });

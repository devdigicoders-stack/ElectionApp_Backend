import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkStatus } from '../../shared/types';

export type WorkDocument = Work & Document;

@Schema({ timestamps: true })
export class Work {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: null })
  description?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', required: true })
  areaId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object, default: {} })
  beforeAfter: { before?: string[]; after?: string[] };

  @Prop({ default: WorkStatus.UPCOMING, enum: Object.values(WorkStatus) })
  status: WorkStatus;

  @Prop({ default: true })
  isPublished: boolean;
}

export const WorkSchema = SchemaFactory.createForClass(Work);
WorkSchema.index({ tenantId: 1, areaId: 1 });
WorkSchema.index({ tenantId: 1, status: 1 });

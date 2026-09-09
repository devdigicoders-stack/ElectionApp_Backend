import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ManifestoDocument = Manifesto & Document;

@Schema({ timestamps: true })
export class Manifesto {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  category: string; // Employment, Education, Health, etc.

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  points: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isPublished: boolean;
}

export const ManifestoSchema = SchemaFactory.createForClass(Manifesto);
ManifestoSchema.index({ tenantId: 1, category: 1 });

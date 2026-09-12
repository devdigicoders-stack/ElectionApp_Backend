import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ManifestoDocument = Manifesto & Document;

@Schema({ timestamps: true })
export class Manifesto {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: null })
  pdfUrl?: string;

  @Prop({ default: null })
  fileUrl?: string;

  @Prop({ default: null })
  fileType?: string; // 'pdf' | 'image'

  @Prop({ default: null })
  coverImageUrl?: string;

  @Prop({ default: 'Manifesto' })
  category: string;

  @Prop({ default: '' })
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
ManifestoSchema.index({ tenantId: 1, createdAt: -1 });

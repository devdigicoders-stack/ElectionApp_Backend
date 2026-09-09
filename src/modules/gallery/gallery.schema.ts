import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GalleryType } from '../../shared/types';

export type GalleryItemDocument = GalleryItem & Document;

@Schema({ timestamps: true })
export class GalleryItem {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: Object.values(GalleryType) })
  type: GalleryType; // photo | video

  @Prop({ required: true })
  url: string; // image path or video URL/embed

  @Prop({ default: null })
  thumbnailUrl?: string;

  @Prop({ default: null })
  category?: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  areaId?: Types.ObjectId;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: false })
  allowDownload: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);
GalleryItemSchema.index({ tenantId: 1, type: 1, isPublished: 1 });

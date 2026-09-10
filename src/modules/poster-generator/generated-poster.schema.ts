import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GeneratedPosterDocument = GeneratedPoster & Document;

@Schema({ timestamps: true })
export class GeneratedPoster {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PosterTemplate', required: true })
  templateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  outputUrl: string; // generated poster public file path

  @Prop({ default: 'png' })
  format: string; // 'png' | 'jpg'

  @Prop({ default: 1080 })
  width: number;

  @Prop({ default: 1080 })
  height: number;

  @Prop({ default: null })
  downloadUrl?: string; // direct download endpoint url

  @Prop({ default: null })
  shareText?: string;

  @Prop({ default: null })
  userPhotoUrl?: string; // photo used (or background removed cutout)

  @Prop({ type: Object, default: {} })
  fieldValues: Record<string, string>; // { name: 'Ram Kumar', designation: 'Ward Member', area: 'Ward 5', ... }
}

export const GeneratedPosterSchema = SchemaFactory.createForClass(GeneratedPoster);
GeneratedPosterSchema.index({ tenantId: 1, userId: 1 });
GeneratedPosterSchema.index({ tenantId: 1, templateId: 1 });
GeneratedPosterSchema.index({ tenantId: 1, createdAt: -1 });

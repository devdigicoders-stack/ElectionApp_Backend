import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PosterTemplateDocument = PosterTemplate & Document;

export interface TemplateField {
  key: string;         // 'photo', 'name', 'designation', 'area', 'custom_text'
  label: string;
  type: 'photo' | 'text';
  editable: boolean;
  required: boolean;
  defaultValue?: string;
  position?: {         // position on canvas (percentage based: 0-100)
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: {
    fontSize?: number;
    fontColor?: string;
    fontWeight?: string;
    textAlign?: string;
    maskShape?: 'circle' | 'rectangle' | 'rounded'; // photo shape mask
  };
}

@Schema({ timestamps: true })
export class PosterTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  category: string; // Festival, Birthday, Political Campaign, Event Promotion, National Day, Congratulations, Support Campaign, General

  @Prop({ default: '' })
  description?: string;

  @Prop({ required: true })
  templateImageUrl: string; // base template image path or URL

  @Prop({ default: null })
  thumbnailUrl?: string;

  @Prop({ default: 1080 })
  width: number;

  @Prop({ default: 1080 })
  height: number;

  @Prop({ default: '1080x1080' })
  dimensionPreset: string; // '1080x1080' (Square), '1080x1350' (Portrait), '1080x1920' (Story), 'custom'

  @Prop({ type: [Object], default: [] })
  fields: TemplateField[]; // configurable editable fields

  @Prop({ default: true })
  includeTenantBranding: boolean; // overlay tenant/leader logo & slogan

  @Prop({ default: null })
  expiresAt?: Date; // Optional expiration date for festival/event templates

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: 0 })
  usageCount: number;
}

export const PosterTemplateSchema = SchemaFactory.createForClass(PosterTemplate);
PosterTemplateSchema.index({ tenantId: 1, category: 1, isActive: 1 });
PosterTemplateSchema.index({ tenantId: 1, isActive: 1, expiresAt: 1 });

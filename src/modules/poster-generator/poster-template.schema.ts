import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PosterTemplateDocument = PosterTemplate & Document;

export interface TemplateField {
  key: string;         // 'photo', 'name', 'designation', 'custom_text'
  label: string;
  type: 'photo' | 'text';
  editable: boolean;
  required: boolean;
  defaultValue?: string;
  position?: {         // position on canvas (percentage based)
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
  };
}

@Schema({ timestamps: true })
export class PosterTemplate {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string; // Festival, Birthday, Campaign, Event, National Days, Congratulations

  @Prop({ required: true })
  templateImageUrl: string; // base template image

  @Prop({ default: null })
  thumbnailUrl?: string;

  @Prop({ type: [Object], default: [] })
  fields: TemplateField[]; // configurable editable fields

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: 0 })
  usageCount: number;
}

export const PosterTemplateSchema = SchemaFactory.createForClass(PosterTemplate);
PosterTemplateSchema.index({ tenantId: 1, category: 1, isActive: 1 });

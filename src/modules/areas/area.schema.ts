import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AreaLevelDocument = AreaLevel & Document;
export type AreaDocument = Area & Document;

@Schema({ timestamps: true })
export class AreaLevel {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  levelOrder: number; // 1 = top, higher = deeper

  @Prop({ required: true })
  name: string; // e.g. "District", "Block", "Ward"

  @Prop({ default: true })
  isRequired: boolean;
}

export const AreaLevelSchema = SchemaFactory.createForClass(AreaLevel);
AreaLevelSchema.index({ tenantId: 1, levelOrder: 1 }, { unique: true });

@Schema({ timestamps: true })
export class Area {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AreaLevel', required: true })
  levelId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  parentId?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  code?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
AreaSchema.index({ tenantId: 1, parentId: 1 });
AreaSchema.index({ tenantId: 1, levelId: 1 });

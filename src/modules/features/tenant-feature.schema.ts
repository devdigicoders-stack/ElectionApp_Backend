import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FeatureKey } from '../../shared/types';

export type TenantFeatureDocument = TenantFeature & Document;

@Schema({ timestamps: true })
export class TenantFeature {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(FeatureKey) })
  featureKey: FeatureKey;

  @Prop({ default: false })
  isEnabled: boolean;

  @Prop({ type: Object, default: {} })
  config: Record<string, any>;
}

export const TenantFeatureSchema = SchemaFactory.createForClass(TenantFeature);
TenantFeatureSchema.index({ tenantId: 1, featureKey: 1 }, { unique: true });

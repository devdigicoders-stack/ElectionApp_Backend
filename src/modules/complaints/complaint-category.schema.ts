import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComplaintCategoryDocument = ComplaintCategory & Document;

@Schema({ timestamps: true })
export class ComplaintCategory {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  icon?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const ComplaintCategorySchema = SchemaFactory.createForClass(ComplaintCategory);
ComplaintCategorySchema.index({ tenantId: 1, name: 1 }, { unique: true });
ComplaintCategorySchema.index({ tenantId: 1, isActive: 1, order: 1 });

export const DEFAULT_COMPLAINT_CATEGORIES = [
  { name: 'Roads & Infrastructure', description: 'Potholes, broken roads, footpaths, bridges, public construction' },
  { name: 'Electricity & Street Lights', description: 'Faulty street lights, power outages, damaged electric poles/transformers' },
  { name: 'Water Supply & Pipelines', description: 'Drinking water shortage, pipeline leakage, dirty water supply' },
  { name: 'Sanitation & Garbage', description: 'Uncollected garbage, open dumping, overflowing drains, sewer blockage' },
  { name: 'Health & Hospitals', description: 'Primary health center issues, lack of medicines, sanitation around clinics' },
  { name: 'Public Safety & Law/Order', description: 'Nuisance, dark alleys, security concerns, police reporting assistance' },
  { name: 'Education & Schools', description: 'Government school infrastructure, midday meal, teacher absenteeism' },
  { name: 'Ration & Food Security', description: 'Ration card issues, fair price shop irregularities, supply shortage' },
  { name: 'Pension & Welfare Schemes', description: 'Old age pension, widow pension, disability allowance delays' },
  { name: 'Other / Miscellaneous', description: 'Other civic grievances and local community issues' },
];

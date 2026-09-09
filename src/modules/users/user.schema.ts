import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  mobile: string;

  @Prop({ default: null })
  name?: string;

  @Prop({ default: null })
  dob?: Date;

  @Prop({ default: null })
  gender?: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  areaId?: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  customFields: Record<string, any>; // dynamic registration fields

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isProfileComplete: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[]; // CRM tags: ['Supporter', 'Youth', 'Farmer', etc.]

  @Prop({ default: 'citizen', enum: ['citizen', 'supporter', 'member', 'volunteer'] })
  category: string; // Public user category (SRS Sec 5.7 & Sec 40)

  @Prop({ default: 'active', enum: ['active', 'inactive', 'blocked'] })
  status: string; // User CRM status

  @Prop({ default: null })
  email?: string;

  @Prop({ default: null })
  profilePhoto?: string;

  @Prop({ default: null })
  address?: string;

  @Prop({ default: null })
  notes?: string; // Internal admin CRM remarks

  @Prop({ default: null })
  lastActiveAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ tenantId: 1, mobile: 1 }, { unique: true });
UserSchema.index({ tenantId: 1, areaId: 1 });
UserSchema.index({ tenantId: 1, tags: 1 });
UserSchema.index({ tenantId: 1, category: 1 });
UserSchema.index({ tenantId: 1, status: 1 });
UserSchema.index({ tenantId: 1, createdAt: -1 });

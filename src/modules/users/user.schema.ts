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
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ tenantId: 1, mobile: 1 }, { unique: true });
UserSchema.index({ tenantId: 1, areaId: 1 });

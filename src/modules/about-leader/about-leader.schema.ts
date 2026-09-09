import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AboutLeaderDocument = AboutLeader & Document;

@Schema({ timestamps: true })
export class AboutLeader {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, unique: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: null })
  designation?: string; // MLA, Gram Pradhan, Councillor etc.

  @Prop({ default: null })
  party?: string;

  @Prop({ default: null })
  constituency?: string;

  @Prop({ default: null })
  profileImageUrl?: string;

  @Prop({ default: null })
  coverImageUrl?: string;

  @Prop({ default: null })
  bio?: string; // short bio

  @Prop({ default: null })
  message?: string; // leader's message to citizens

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ type: Object, default: {} })
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
    officeAddress?: string;
  };

  @Prop({ type: Object, default: {} })
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    website?: string;
  };

  @Prop({ type: [{ year: String, title: String, description: String }], default: [] })
  timeline: { year: string; title: string; description?: string }[];
}

export const AboutLeaderSchema = SchemaFactory.createForClass(AboutLeader);

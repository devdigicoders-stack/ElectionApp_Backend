import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TenantStatus } from '../../shared/types';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: null })
  title?: string;

  @Prop({ unique: true, sparse: true })
  customDomain?: string;

  @Prop({ default: false })
  isCustomDomainVerified?: boolean;

  @Prop({ default: null })
  customDomainVerifiedAt?: Date;

  @Prop({
    type: Object,
    default: () => ({
      domain: null,
      status: 'unconfigured',
      verificationToken: null,
      targetCname: 'cname.madiyayu.com',
      dnsRecords: [],
      lastCheckedAt: null,
      failureReason: null,
    }),
  })
  customDomainVerification?: {
    domain?: string | null;
    status?: 'unconfigured' | 'pending' | 'verified' | 'failed';
    verificationToken?: string | null;
    targetCname?: string | null;
    dnsRecords?: Array<{
      type: 'TXT' | 'CNAME' | 'A';
      name: string;
      value: string;
      purpose: string;
      ttl?: string;
    }>;
    lastCheckedAt?: Date | null;
    failureReason?: string | null;
  };

  @Prop({ type: String, default: null })
  contactPerson?: string | null;

  @Prop({ type: String, default: null })
  mobileNumber?: string | null;

  @Prop({ type: String, default: null })
  email?: string | null;

  @Prop({ type: String, default: null })
  gstin?: string | null;

  @Prop({ type: String, default: null })
  billingState?: string | null;

  @Prop({ type: String, default: null })
  billingAddress?: string | null;

  @Prop({ type: String, default: 'other' })
  electionType?: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: TenantStatus.TRIAL, enum: Object.values(TenantStatus) })
  status: TenantStatus;

  @Prop({ type: Object, default: {} })
  branding: {
    platformName?: string;
    title?: string;
    logoUrl?: string;
    logo?: string;
    faviconUrl?: string;
    pwaIconUrl?: string;
    leaderPhotoUrl?: string;
    loginBgUrl?: string;
    splashScreenUrl?: string;
    splashScreens?: Array<{
      title?: string;
      subtitle?: string;
      mediaType?: 'image' | 'video';
      mediaUrl: string;
      order?: number;
    }>;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    leaderName?: string;
    tagline?: string;
    footerText?: string;
    privacyPolicyUrl?: string;
    termsUrl?: string;
    privacyPolicyContent?: string;
    termsContent?: string;
    socialLinks?: Record<string, string>;
  };

  @Prop({ type: Object, default: {} })
  settings: {
    registrationFields?: any[];
    areaLevels?: string[];
    timezone?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'Plan', default: null })
  planId?: Types.ObjectId;

  @Prop({ default: null })
  trialEndsAt?: Date;

  @Prop({ default: null })
  subscriptionStartsAt?: Date;

  @Prop({ default: null })
  subscriptionEndsAt?: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

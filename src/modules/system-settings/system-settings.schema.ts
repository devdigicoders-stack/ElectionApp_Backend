import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemSettingsDocument = SystemSettings & Document;

@Schema({ _id: false })
export class SmsSettings {
  @Prop({ default: 'msg91' })
  provider: string; // 'msg91' | 'fast2sms' | 'twilio' | 'custom'

  @Prop({ default: '' })
  apiKey: string;

  @Prop({ default: '' })
  senderId: string; // DLT approved 6-char header

  @Prop({ default: '' })
  entityId: string; // Principal Entity ID (DLT)

  @Prop({ default: false })
  enabled: boolean;

  @Prop({ default: true })
  isTestMode: boolean;
}

@Schema({ _id: false })
export class WhatsAppSettings {
  @Prop({ default: 'meta_cloud' })
  provider: string; // 'meta_cloud' | 'gupshup' | 'aisensy'

  @Prop({ default: '' })
  accessToken: string;

  @Prop({ default: '' })
  phoneNumberId: string;

  @Prop({ default: '' })
  businessAccountId: string;

  @Prop({ default: '' })
  webhookSecret: string;

  @Prop({ default: false })
  enabled: boolean;
}

@Schema({ _id: false })
export class StorageSettings {
  @Prop({ default: 'local' })
  provider: string; // 'local' | 'aws_s3' | 'cloudflare_r2' | 'minio'

  @Prop({ default: '' })
  bucket: string;

  @Prop({ default: 'ap-south-1' })
  region: string;

  @Prop({ default: '' })
  accessKeyId: string;

  @Prop({ default: '' })
  secretAccessKey: string;

  @Prop({ default: '' })
  cdnUrl: string;

  @Prop({ default: '' })
  endpoint: string; // custom endpoint for R2 or MinIO

  @Prop({ default: true })
  enabled: boolean;
}

@Schema({ _id: false })
export class PaymentSettings {
  @Prop({ default: 'razorpay' })
  provider: string; // 'razorpay' | 'cashfree' | 'stripe'

  @Prop({ default: '' })
  keyId: string;

  @Prop({ default: '' })
  keySecret: string;

  @Prop({ default: '' })
  webhookSecret: string;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ default: false })
  isLiveMode: boolean;

  @Prop({ default: false })
  enabled: boolean;
}

@Schema({ _id: false })
export class AiPosterSettings {
  @Prop({ default: 'remove_bg' })
  provider: string; // 'remove_bg' | 'clipdrop' | 'photoroom'

  @Prop({ default: '' })
  apiKey: string;

  @Prop({ default: false })
  enabled: boolean;
}

@Schema({ _id: false })
export class GeneralSettings {
  @Prop({ default: 'JanConnect / JanSampark SaaS' })
  platformName: string;

  @Prop({ default: 'support@madiyayu.com' })
  supportEmail: string;

  @Prop({ default: '+91 98765 43210' })
  supportPhone: string;

  @Prop({ default: false })
  maintenanceMode: boolean;

  @Prop({ default: 'System scheduled maintenance in progress. Normal operations will resume shortly.' })
  maintenanceMessage: string;

  @Prop({ default: 14 })
  defaultTrialDays: number;
}

@Schema({ timestamps: true })
export class SystemSettings {
  @Prop({ default: 'platform_singleton', unique: true })
  key: string;

  @Prop({ type: SmsSettings, default: () => ({}) })
  sms: SmsSettings;

  @Prop({ type: WhatsAppSettings, default: () => ({}) })
  whatsapp: WhatsAppSettings;

  @Prop({ type: StorageSettings, default: () => ({}) })
  storage: StorageSettings;

  @Prop({ type: PaymentSettings, default: () => ({}) })
  payment: PaymentSettings;

  @Prop({ type: AiPosterSettings, default: () => ({}) })
  aiPoster: AiPosterSettings;

  @Prop({ type: GeneralSettings, default: () => ({}) })
  general: GeneralSettings;
}

export const SystemSettingsSchema = SchemaFactory.createForClass(SystemSettings);

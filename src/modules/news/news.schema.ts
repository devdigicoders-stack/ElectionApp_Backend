import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NewsStatus } from '../../shared/types';

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  slug: string;

  @Prop({ required: true, trim: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string; // Markdown or HTML rich content

  @Prop({ default: null })
  coverImageUrl?: string;

  @Prop({ type: [String], default: [] })
  galleryImages: string[];

  @Prop({ required: true, trim: true, index: true })
  category: string; // e.g., 'News', 'Press Release', 'Announcement', 'Article', 'Leader Message'

  @Prop({
    type: Object,
    default: () => ({
      name: 'Office of Leader',
      role: 'Admin',
      avatarUrl: null,
    }),
  })
  author: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };

  @Prop({ required: true, default: Date.now, index: true })
  publishDate: Date;

  @Prop({
    required: true,
    enum: Object.values(NewsStatus),
    default: NewsStatus.PUBLISHED,
    index: true,
  })
  status: NewsStatus;

  @Prop({ default: null })
  scheduledPublishDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null, index: true })
  areaId?: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ default: false, index: true })
  isFeatured: boolean;

  @Prop({ default: true })
  allowSharing: boolean;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser', default: null })
  createdBy?: Types.ObjectId;
}

export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
NewsSchema.index({ tenantId: 1, status: 1, publishDate: -1 });
NewsSchema.index({ tenantId: 1, category: 1, status: 1 });
NewsSchema.index({ tenantId: 1, isFeatured: 1, status: 1 });

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './gallery.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { GalleryType } from '../../shared/types';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(GalleryItem.name) private galleryModel: Model<GalleryItemDocument>) {}

  async create(tenant: TenantDocument, data: any) {
    return this.galleryModel.create({ tenantId: tenant._id, ...data });
  }

  async findAll(tenant: TenantDocument, filters: { type?: GalleryType; category?: string; page?: number; limit?: number }) {
    const { type, category, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id, isPublished: true };
    if (type) query.type = type;
    if (category) query.category = category;

    const [data, total] = await Promise.all([
      this.galleryModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      this.galleryModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findOne(tenant: TenantDocument, id: string) {
    const item = await this.galleryModel.findOne({ _id: id, tenantId: tenant._id });
    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const item = await this.galleryModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.galleryModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './gallery.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { GalleryType } from '../../shared/types';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(GalleryItem.name) private galleryModel: Model<GalleryItemDocument>) {}

  async create(tenant: TenantDocument, data: any) {
    return this.galleryModel.create({ tenantId: tenant._id, ...data });
  }

  async findAll(
    tenant: TenantDocument,
    filters: {
      type?: GalleryType;
      category?: string;
      tag?: string;
      search?: string;
      all?: boolean;
      page?: number;
      limit?: number;
    },
  ) {
    const { type, category, tag, search, all, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id };
    if (!all) query.isPublished = true;
    if (type) query.type = type;
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.galleryModel
        .find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.galleryModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findOne(tenant: TenantDocument, id: string) {
    let item: any = null;
    const tenantCondition = {
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    };

    if (Types.ObjectId.isValid(id)) {
      item = await this.galleryModel.findOne({
        _id: new Types.ObjectId(id),
        ...tenantCondition,
      });
    }

    if (!item) {
      item = await this.galleryModel.findOne({
        _id: id,
        ...tenantCondition,
      });
    }

    if (!item && Types.ObjectId.isValid(id)) {
      const candidate = await this.galleryModel.findById(id);
      if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
        item = candidate;
      }
    }

    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const tenantCondition = {
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    };
    const idFilter = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;

    let item = await this.galleryModel.findOneAndUpdate(
      { _id: idFilter, ...tenantCondition },
      { $set: data },
      { new: true },
    );

    if (!item && Types.ObjectId.isValid(id)) {
      const candidate = await this.galleryModel.findById(id);
      if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
        item = await this.galleryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
      }
    }

    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }

  async remove(tenant: TenantDocument, id: string) {
    const tenantCondition = {
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    };
    const idFilter = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;

    let item = await this.galleryModel.findOneAndDelete({ _id: idFilter, ...tenantCondition });

    if (!item && Types.ObjectId.isValid(id)) {
      const candidate = await this.galleryModel.findById(id);
      if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
        item = await this.galleryModel.findByIdAndDelete(id);
      }
    }

    if (!item) throw new NotFoundException('Gallery item not found');
    return item;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Manifesto, ManifestoDocument } from './manifesto.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class ManifestoService {
  constructor(@InjectModel(Manifesto.name) private manifestoModel: Model<ManifestoDocument>) {}

  private getManifestoFilter(tenant: TenantDocument, id: string) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    const tenantObjectId = Types.ObjectId.isValid(tenant?._id) ? new Types.ObjectId(tenant._id) : tenant?._id;
    return {
      _id: objectId,
      $or: [
        { tenantId: tenantObjectId },
        { tenantId: tenant?._id?.toString() },
        { tenantId: tenant?._id },
      ],
    };
  }

  async create(tenant: TenantDocument, data: any) {
    const tenantObjectId = Types.ObjectId.isValid(tenant?._id) ? new Types.ObjectId(tenant._id) : tenant?._id;
    return this.manifestoModel.create({ tenantId: tenantObjectId, ...data });
  }

  async findAll(tenant: TenantDocument, category?: string, includeUnpublished = false) {
    const tenantObjectId = Types.ObjectId.isValid(tenant?._id) ? new Types.ObjectId(tenant._id) : tenant?._id;
    const query: any = {
      $or: [
        { tenantId: tenantObjectId },
        { tenantId: tenant?._id?.toString() },
        { tenantId: tenant?._id },
      ],
    };
    if (!includeUnpublished) {
      query.isPublished = true;
    }
    if (category) query.category = category;
    return this.manifestoModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
  }

  async getCategories(tenant: TenantDocument) {
    const tenantObjectId = Types.ObjectId.isValid(tenant?._id) ? new Types.ObjectId(tenant._id) : tenant?._id;
    return this.manifestoModel.distinct('category', {
      $or: [
        { tenantId: tenantObjectId },
        { tenantId: tenant?._id?.toString() },
        { tenantId: tenant?._id },
      ],
      isPublished: true,
    });
  }

  async findOne(tenant: TenantDocument, id: string) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    let item = await this.manifestoModel.findOne(this.getManifestoFilter(tenant, id));

    if (!item && Types.ObjectId.isValid(id)) {
      const candidate = await this.manifestoModel.findById(objectId);
      if (
        candidate &&
        (candidate.tenantId?.toString() === tenant?._id?.toString() || !candidate.tenantId)
      ) {
        item = candidate;
      }
    }

    if (!item) throw new NotFoundException('Manifesto item not found');
    return item;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    let item = await this.manifestoModel.findOneAndUpdate(
      this.getManifestoFilter(tenant, id),
      { $set: data },
      { new: true },
    );

    if (!item && Types.ObjectId.isValid(id)) {
      const candidate = await this.manifestoModel.findById(objectId);
      if (
        candidate &&
        (candidate.tenantId?.toString() === tenant?._id?.toString() || !candidate.tenantId)
      ) {
        item = await this.manifestoModel.findByIdAndUpdate(objectId, { $set: data }, { new: true });
      }
    }

    if (!item) throw new NotFoundException('Manifesto item not found');
    return item;
  }

  async remove(tenant: TenantDocument, id: string) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    let item = await this.manifestoModel.findOneAndDelete(this.getManifestoFilter(tenant, id));

    if (!item && Types.ObjectId.isValid(id)) {
      const candidate = await this.manifestoModel.findById(objectId);
      if (
        candidate &&
        (candidate.tenantId?.toString() === tenant?._id?.toString() || !candidate.tenantId)
      ) {
        item = await this.manifestoModel.findByIdAndDelete(objectId);
      }
    }

    if (!item) throw new NotFoundException('Manifesto item not found');
    return { success: true, message: 'Manifesto item deleted successfully' };
  }
}

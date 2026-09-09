import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manifesto, ManifestoDocument } from './manifesto.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class ManifestoService {
  constructor(@InjectModel(Manifesto.name) private manifestoModel: Model<ManifestoDocument>) {}

  async create(tenant: TenantDocument, data: any) {
    return this.manifestoModel.create({ tenantId: tenant._id, ...data });
  }

  async findAll(tenant: TenantDocument, category?: string) {
    const query: any = { tenantId: tenant._id, isPublished: true };
    if (category) query.category = category;
    return this.manifestoModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
  }

  async getCategories(tenant: TenantDocument) {
    return this.manifestoModel.distinct('category', { tenantId: tenant._id, isPublished: true });
  }

  async findOne(tenant: TenantDocument, id: string) {
    const item = await this.manifestoModel.findOne({ _id: id, tenantId: tenant._id });
    if (!item) throw new NotFoundException('Manifesto item not found');
    return item;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const item = await this.manifestoModel.findOneAndUpdate(
      { _id: id, tenantId: tenant._id },
      { $set: data },
      { new: true },
    );
    if (!item) throw new NotFoundException('Manifesto item not found');
    return item;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.manifestoModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }
}

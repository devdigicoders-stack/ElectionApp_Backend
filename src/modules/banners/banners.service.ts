import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banner.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class BannersService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<BannerDocument>) {}

  async create(tenant: TenantDocument, data: any) {
    return this.bannerModel.create({ tenantId: tenant._id, ...data });
  }

  async findActive(tenant: TenantDocument) {
    return this.bannerModel.find({ tenantId: tenant._id, isActive: true }).sort({ sortOrder: 1 });
  }

  async findAll(tenant: TenantDocument) {
    return this.bannerModel.find({ tenantId: tenant._id }).sort({ sortOrder: 1 });
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const banner = await this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.bannerModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }

  async reorder(tenant: TenantDocument, orders: { id: string; sortOrder: number }[]) {
    await Promise.all(
      orders.map(({ id, sortOrder }) =>
        this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { sortOrder }),
      ),
    );
    return { message: 'Reordered' };
  }
}

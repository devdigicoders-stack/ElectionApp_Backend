import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banner.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class BannersService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<BannerDocument>) {}

  private formatBanner(banner: any, req?: any, tenant?: any) {
    if (!banner) return null;
    const doc = banner.toObject ? banner.toObject() : { ...banner };

    let host = req?.get ? req.get('host') : (req?.headers ? req.headers['host'] : null);
    if (!host && tenant) {
      host = tenant.customDomain || `${tenant.slug}.localhost:3001`;
    }
    const protocol = req?.protocol || 'http';

    if (doc.imageUrl) {
      if (doc.imageUrl.startsWith('/')) {
        doc.fullImageUrl = host ? `${protocol}://${host}${doc.imageUrl}` : doc.imageUrl;
      } else {
        doc.fullImageUrl = doc.imageUrl;
      }
    }

    if (doc.mobileImageUrl) {
      if (doc.mobileImageUrl.startsWith('/')) {
        doc.fullMobileImageUrl = host ? `${protocol}://${host}${doc.mobileImageUrl}` : doc.mobileImageUrl;
      } else {
        doc.fullMobileImageUrl = doc.mobileImageUrl;
      }
    }

    return doc;
  }

  async create(tenant: TenantDocument, data: any, req?: any) {
    if (!data.title) {
      throw new BadRequestException('Banner title is required');
    }
    if (!data.imageUrl) {
      throw new BadRequestException('Banner image is required (upload image via form-data or provide imageUrl)');
    }

    const banner = await this.bannerModel.create({
      tenantId: tenant._id,
      ...data,
    });
    return this.formatBanner(banner, req, tenant);
  }

  async findActive(tenant: TenantDocument, req?: any) {
    const banners = await this.bannerModel.find({ tenantId: tenant._id, isActive: true }).sort({ sortOrder: 1 });
    return banners.map((b) => this.formatBanner(b, req, tenant));
  }

  async findAll(tenant: TenantDocument, req?: any) {
    const banners = await this.bannerModel.find({ tenantId: tenant._id }).sort({ sortOrder: 1 });
    return banners.map((b) => this.formatBanner(b, req, tenant));
  }

  async findOne(tenant: TenantDocument, id: string, req?: any) {
    const banner = await this.bannerModel.findOne({ _id: id, tenantId: tenant._id });
    if (!banner) throw new NotFoundException('Banner not found');
    return this.formatBanner(banner, req, tenant);
  }

  async update(tenant: TenantDocument, id: string, data: any, req?: any) {
    const banner = await this.bannerModel.findOneAndUpdate(
      { _id: id, tenantId: tenant._id },
      { $set: data },
      { new: true },
    );
    if (!banner) throw new NotFoundException('Banner not found');
    return this.formatBanner(banner, req, tenant);
  }

  async remove(tenant: TenantDocument, id: string) {
    const banner = await this.bannerModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    if (!banner) throw new NotFoundException('Banner not found');
    return { success: true, message: 'Banner deleted successfully' };
  }

  async reorder(tenant: TenantDocument, orders: { id: string; sortOrder: number }[]) {
    await Promise.all(
      (orders || []).map(({ id, sortOrder }) =>
        this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { sortOrder }),
      ),
    );
    return { message: 'Reordered successfully' };
  }
}

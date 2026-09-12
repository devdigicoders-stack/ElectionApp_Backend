import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AboutLeader, AboutLeaderDocument } from './about-leader.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class AboutLeaderService {
  constructor(@InjectModel(AboutLeader.name) private aboutModel: Model<AboutLeaderDocument>) {}

  async get(tenant: TenantDocument) {
    return this.aboutModel.findOne({ tenantId: tenant._id });
  }

  async upsert(tenant: TenantDocument, data: any) {
    const cleanData = { ...(data || {}) };
    delete cleanData._id;
    delete cleanData.__v;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    delete cleanData.tenantId;

    return this.aboutModel.findOneAndUpdate(
      { $or: [{ tenantId: tenant._id }, { tenantId: tenant._id?.toString() }] },
      { $set: { tenantId: tenant._id, ...cleanData } },
      { new: true, upsert: true },
    );
  }
}

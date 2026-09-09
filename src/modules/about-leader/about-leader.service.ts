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
    return this.aboutModel.findOneAndUpdate(
      { tenantId: tenant._id },
      { $set: { tenantId: tenant._id, ...data } },
      { new: true, upsert: true },
    );
  }
}

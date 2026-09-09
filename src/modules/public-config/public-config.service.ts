import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantDocument } from '../tenants/tenant.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import { AreaLevel, AreaLevelDocument } from '../areas/area.schema';

@Injectable()
export class PublicConfigService {
  constructor(
    @InjectModel(TenantFeature.name) private featureModel: Model<TenantFeatureDocument>,
    @InjectModel(AreaLevel.name) private areaLevelModel: Model<AreaLevelDocument>,
  ) {}

  async getConfig(tenant: TenantDocument) {
    const [features, areaLevels] = await Promise.all([
      this.featureModel.find({ tenantId: tenant._id, isEnabled: true }).select('featureKey config'),
      this.areaLevelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 }).select('levelOrder name isRequired'),
    ]);

    return {
      tenant: {
        id: tenant._id,
        slug: tenant.slug,
        name: tenant.name,
        status: tenant.status,
      },
      branding: tenant.branding,
      // registration form config from tenant settings
      registrationFields: tenant.settings?.registrationFields ?? [],
      // which features are ON for this tenant
      enabledFeatures: features.map((f) => ({ key: f.featureKey, config: f.config })),
      // area hierarchy levels for this tenant
      areaLevels,
    };
  }
}

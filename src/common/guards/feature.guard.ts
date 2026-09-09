import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FEATURE_KEY } from '../decorators/feature.decorator';
import { TenantFeature, TenantFeatureDocument } from '../../modules/features/tenant-feature.schema';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(TenantFeature.name) private featureModel: Model<TenantFeatureDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const featureKey =
      this.reflector.get<string>(FEATURE_KEY, context.getHandler()) ||
      this.reflector.get<string>(FEATURE_KEY, context.getClass());
    if (!featureKey) return true;

    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;
    if (!tenant) return false;

    const feature = await this.featureModel.findOne({
      tenantId: tenant._id,
      featureKey,
      isEnabled: true,
    } as any);

    if (!feature) throw new ForbiddenException(`Feature '${featureKey}' is not enabled for this account`);
    return true;
  }
}

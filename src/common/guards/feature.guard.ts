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
    // getAllAndOverride gives handler-level priority over class-level.
    // If a method explicitly sets FEATURE_KEY to null it overrides the class decorator.
    const featureKey = this.reflector.getAllAndOverride<string | null>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!featureKey) return true; // null / undefined → no feature gate, allow through

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

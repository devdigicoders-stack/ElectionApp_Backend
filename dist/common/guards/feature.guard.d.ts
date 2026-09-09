import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';
import { TenantFeatureDocument } from '../../modules/features/tenant-feature.schema';
export declare class FeatureGuard implements CanActivate {
    private reflector;
    private featureModel;
    constructor(reflector: Reflector, featureModel: Model<TenantFeatureDocument>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

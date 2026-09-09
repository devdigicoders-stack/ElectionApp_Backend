import { SetMetadata } from '@nestjs/common';
import { FeatureKey } from '../../shared/types';

export const FEATURE_KEY = 'feature';
export const RequireFeature = (feature: FeatureKey) => SetMetadata(FEATURE_KEY, feature);

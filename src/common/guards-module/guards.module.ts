import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FeatureGuard } from '../guards/feature.guard';
import { RolesGuard } from '../guards/roles.guard';
import { TenantFeature, TenantFeatureSchema } from '../../modules/features/tenant-feature.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: TenantFeature.name, schema: TenantFeatureSchema }]),
  ],
  providers: [
    JwtAuthGuard,
    FeatureGuard,
    RolesGuard,
  ],
  exports: [JwtAuthGuard, FeatureGuard, RolesGuard],
})
export class GuardsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicConfigService } from './public-config.service';
import { PublicConfigController } from './public-config.controller';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { AreaLevel, AreaLevelSchema } from '../areas/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: AreaLevel.name, schema: AreaLevelSchema },
    ]),
  ],
  controllers: [PublicConfigController],
  providers: [PublicConfigService],
})
export class PublicConfigModule {}

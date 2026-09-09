import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { Work, WorkSchema } from './work.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Work.name, schema: WorkSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [WorksController],
  providers: [WorksService],
  exports: [WorksService],
})
export class WorksModule {}

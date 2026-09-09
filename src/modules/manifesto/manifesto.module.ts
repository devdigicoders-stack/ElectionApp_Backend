import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManifestoService } from './manifesto.service';
import { ManifestoController } from './manifesto.controller';
import { Manifesto, ManifestoSchema } from './manifesto.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manifesto.name, schema: ManifestoSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [ManifestoController],
  providers: [ManifestoService],
})
export class ManifestoModule {}

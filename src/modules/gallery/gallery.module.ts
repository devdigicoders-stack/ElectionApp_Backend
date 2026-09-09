import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { GalleryItem, GalleryItemSchema } from './gallery.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GalleryItem.name, schema: GalleryItemSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}

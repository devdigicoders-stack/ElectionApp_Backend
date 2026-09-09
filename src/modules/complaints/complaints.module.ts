import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint, ComplaintSchema } from './complaint.schema';
import { ComplaintCategory, ComplaintCategorySchema } from './complaint-category.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
      { name: ComplaintCategory.name, schema: ComplaintCategorySchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}

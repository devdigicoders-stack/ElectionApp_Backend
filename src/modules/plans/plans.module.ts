import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './plan.schema';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { PlansService } from './plans.service';
import { PlansSuperAdminController, PlansPublicController } from './plans.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Tenant.name, schema: TenantSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [PlansSuperAdminController, PlansPublicController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}

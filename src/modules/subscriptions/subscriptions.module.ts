import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './subscription.schema';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { Plan, PlanSchema } from '../plans/plan.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { SubscriptionsService } from './subscriptions.service';
import {
  SubscriptionsSuperAdminController,
  SubscriptionsTenantController,
} from './subscriptions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Tenant.name, schema: TenantSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [
    SubscriptionsSuperAdminController,
    SubscriptionsTenantController,
  ],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}

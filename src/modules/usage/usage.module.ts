import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsageService } from './usage.service';
import { UsageSuperAdminController } from './usage.controller';
import { TenantUsageController } from './tenant-usage.controller';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { Plan, PlanSchema } from '../plans/plan.schema';
import { Subscription, SubscriptionSchema } from '../subscriptions/subscription.schema';
import { User, UserSchema } from '../users/user.schema';
import { AdminUser, AdminUserSchema } from '../admin-users/admin-user.schema';
import { GeneratedPoster, GeneratedPosterSchema } from '../poster-generator/generated-poster.schema';
import { Notification, NotificationSchema } from '../notifications/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: GeneratedPoster.name, schema: GeneratedPosterSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [UsageSuperAdminController, TenantUsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}

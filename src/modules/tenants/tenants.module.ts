import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { SuperAdminDomainsController } from './super-admin-domains.controller';
import { TenantDomainController } from './tenant-domain.controller';
import { CustomDomainsService } from './custom-domains.service';
import { Tenant, TenantSchema } from './tenant.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserSchema } from '../admin-users/admin-user.schema';
import { Area, AreaSchema, AreaLevel, AreaLevelSchema } from '../areas/area.schema';
import { User, UserSchema } from '../users/user.schema';
import { Complaint, ComplaintSchema } from '../complaints/complaint.schema';
import { Volunteer, VolunteerSchema } from '../volunteers/volunteer.schema';
import { Event, EventSchema } from '../events/event.schema';
import { Poll, PollSchema } from '../polls/poll.schema';
import { Subscription, SubscriptionSchema } from '../subscriptions/subscription.schema';
import { Plan, PlanSchema } from '../plans/plan.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: AreaLevel.name, schema: AreaLevelSchema },
      { name: Area.name, schema: AreaSchema },
      { name: User.name, schema: UserSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: Volunteer.name, schema: VolunteerSchema },
      { name: Event.name, schema: EventSchema },
      { name: Poll.name, schema: PollSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [
    TenantsController,
    SuperAdminDomainsController,
    TenantDomainController,
  ],
  providers: [TenantsService, CustomDomainsService],
  exports: [TenantsService, CustomDomainsService, MongooseModule],
})
export class TenantsModule {}


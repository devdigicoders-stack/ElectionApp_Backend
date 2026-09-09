import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SuperAdminDashboardController } from './super-admin-dashboard.controller';
import { User, UserSchema } from '../users/user.schema';
import { Complaint, ComplaintSchema } from '../complaints/complaint.schema';
import { Work, WorkSchema } from '../works/work.schema';
import { Event, EventSchema } from '../events/event.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { Volunteer, VolunteerSchema } from '../volunteers/volunteer.schema';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { Subscription, SubscriptionSchema } from '../subscriptions/subscription.schema';
import { Plan, PlanSchema } from '../plans/plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: Work.name, schema: WorkSchema },
      { name: Event.name, schema: EventSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Volunteer.name, schema: VolunteerSchema },
      { name: Tenant.name, schema: TenantSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Plan.name, schema: PlanSchema },
    ]),
  ],
  controllers: [DashboardController, SuperAdminDashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}


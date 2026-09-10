import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Membership, MembershipSchema } from './membership.schema';
import { MembershipPlan, MembershipPlanSchema } from './membership-plan.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { User, UserSchema } from '../users/user.schema';
import { Area, AreaSchema } from '../areas/area.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: MembershipPlan.name, schema: MembershipPlanSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: User.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService, MongooseModule],
})
export class MembershipModule {}

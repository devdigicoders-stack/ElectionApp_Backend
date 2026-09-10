import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { Poll, PollSchema, PollVote, PollVoteSchema } from './poll.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { User, UserSchema } from '../users/user.schema';
import { Area, AreaSchema } from '../areas/area.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { Volunteer, VolunteerSchema } from '../volunteers/volunteer.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: PollVote.name, schema: PollVoteSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: User.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Volunteer.name, schema: VolunteerSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService],
})
export class PollsModule {}

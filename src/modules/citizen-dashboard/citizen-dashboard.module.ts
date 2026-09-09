import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitizenDashboardService } from './citizen-dashboard.service';
import { MyAreaController } from './my-area.controller';
import {
  CitizenDashboardController,
  DashboardCitizenAliasController,
} from './citizen-dashboard.controller';

import { User, UserSchema } from '../users/user.schema';
import { Area, AreaSchema, AreaLevel, AreaLevelSchema } from '../areas/area.schema';
import { Work, WorkSchema } from '../works/work.schema';
import { Event, EventSchema } from '../events/event.schema';
import { EventRsvp, EventRsvpSchema } from '../events/event-rsvp.schema';
import { Poll, PollSchema, PollVote, PollVoteSchema } from '../polls/poll.schema';
import { News, NewsSchema } from '../news/news.schema';
import { Complaint, ComplaintSchema } from '../complaints/complaint.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { Volunteer, VolunteerSchema } from '../volunteers/volunteer.schema';
import { Banner, BannerSchema } from '../banners/banner.schema';
import {
  Notification,
  NotificationSchema,
  NotificationRead,
  NotificationReadSchema,
} from '../notifications/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
      { name: AreaLevel.name, schema: AreaLevelSchema },
      { name: Work.name, schema: WorkSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventRsvp.name, schema: EventRsvpSchema },
      { name: Poll.name, schema: PollSchema },
      { name: PollVote.name, schema: PollVoteSchema },
      { name: News.name, schema: NewsSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Volunteer.name, schema: VolunteerSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationRead.name, schema: NotificationReadSchema },
    ]),
  ],
  controllers: [
    MyAreaController,
    CitizenDashboardController,
    DashboardCitizenAliasController,
  ],
  providers: [CitizenDashboardService],
  exports: [CitizenDashboardService],
})
export class CitizenDashboardModule {}

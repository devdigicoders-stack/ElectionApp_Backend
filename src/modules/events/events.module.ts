import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './event.schema';
import { EventRsvp, EventRsvpSchema } from './event-rsvp.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { User, UserSchema } from '../users/user.schema';
import { Area, AreaSchema } from '../areas/area.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventRsvp.name, schema: EventRsvpSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: User.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

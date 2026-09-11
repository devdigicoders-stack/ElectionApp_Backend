import { Module } from '@nestjs/common';
import { ExportsController } from './exports.controller';
import { UsersModule } from '../users/users.module';
import { MembershipModule } from '../membership/membership.module';
import { ComplaintsModule } from '../complaints/complaints.module';
import { EventsModule } from '../events/events.module';
import { PollsModule } from '../polls/polls.module';
import { VolunteersModule } from '../volunteers/volunteers.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UsersModule,
    MembershipModule,
    ComplaintsModule,
    EventsModule,
    PollsModule,
    VolunteersModule,
    AuditLogsModule,
  ],
  controllers: [ExportsController],
  providers: [],
  exports: [],
})
export class ExportsModule {}

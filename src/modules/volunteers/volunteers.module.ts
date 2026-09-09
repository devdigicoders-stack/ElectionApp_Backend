import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VolunteersService } from './volunteers.service';
import { VolunteersController } from './volunteers.controller';
import { VolunteerTasksService } from './volunteer-tasks.service';
import { VolunteerTasksController } from './volunteer-tasks.controller';
import { Volunteer, VolunteerSchema } from './volunteer.schema';
import { VolunteerTask, VolunteerTaskSchema } from './volunteer-task.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Volunteer.name, schema: VolunteerSchema },
      { name: VolunteerTask.name, schema: VolunteerTaskSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [VolunteerTasksController, VolunteersController],
  providers: [VolunteersService, VolunteerTasksService],
  exports: [VolunteersService, VolunteerTasksService],
})
export class VolunteersModule {}

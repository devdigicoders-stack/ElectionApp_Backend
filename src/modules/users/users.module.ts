import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CitizensController } from './citizens.controller';
import { User, UserSchema } from './user.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { Volunteer, VolunteerSchema } from '../volunteers/volunteer.schema';
import { Complaint, ComplaintSchema } from '../complaints/complaint.schema';
import { Area, AreaSchema } from '../areas/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Volunteer.name, schema: VolunteerSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [UsersController, CitizensController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}

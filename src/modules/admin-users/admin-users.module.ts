import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { SuperAdminStaffController } from './super-admin-staff.controller';
import { AdminUser, AdminUserSchema } from './admin-user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AdminUser.name, schema: AdminUserSchema }])],
  controllers: [AdminUsersController, SuperAdminStaffController],
  providers: [AdminUsersService],
  exports: [AdminUsersService, MongooseModule],
})
export class AdminUsersModule {}


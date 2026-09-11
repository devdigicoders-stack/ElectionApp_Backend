import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SuperAdminNotificationsController } from './super-admin-notifications.controller';
import { FirebaseService } from './firebase.service';
import { Notification, NotificationSchema, NotificationRead, NotificationReadSchema } from './notification.schema';
import { PlatformBroadcast, PlatformBroadcastSchema } from './platform-broadcast.schema';
import { SystemAlert, SystemAlertSchema } from './system-alert.schema';
import { User, UserSchema } from '../users/user.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { Volunteer, VolunteerSchema } from '../volunteers/volunteer.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserSchema } from '../admin-users/admin-user.schema';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationRead.name, schema: NotificationReadSchema },
      { name: PlatformBroadcast.name, schema: PlatformBroadcastSchema },
      { name: SystemAlert.name, schema: SystemAlertSchema },
      { name: User.name, schema: UserSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Volunteer.name, schema: VolunteerSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  controllers: [NotificationsController, SuperAdminNotificationsController],
  providers: [NotificationsService, FirebaseService],
  exports: [NotificationsService, FirebaseService],
})
export class NotificationsModule {}

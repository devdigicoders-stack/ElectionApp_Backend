import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationSchema, NotificationRead, NotificationReadSchema } from './notification.schema';
import { User, UserSchema } from '../users/user.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationRead.name, schema: NotificationReadSchema },
      { name: User.name, schema: UserSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}

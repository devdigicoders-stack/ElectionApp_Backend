import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint, ComplaintSchema } from './complaint.schema';
import { ComplaintCategory, ComplaintCategorySchema } from './complaint-category.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserSchema } from '../admin-users/admin-user.schema';
import { User, UserSchema } from '../users/user.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
      { name: ComplaintCategory.name, schema: ComplaintCategorySchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuditLogsModule,
    NotificationsModule,
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}

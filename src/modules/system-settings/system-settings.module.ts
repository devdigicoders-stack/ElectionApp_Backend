import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemSettings, SystemSettingsSchema } from './system-settings.schema';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsController } from './system-settings.controller';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { MaintenanceMiddleware } from '../../common/middleware/maintenance.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemSettings.name, schema: SystemSettingsSchema },
    ]),
    AuditLogsModule,
  ],
  controllers: [SystemSettingsController],
  providers: [SystemSettingsService, MaintenanceMiddleware],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}

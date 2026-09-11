import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { MaintenanceMiddleware } from './common/middleware/maintenance.middleware';
import { Tenant, TenantSchema } from './modules/tenants/tenant.schema';
import { SystemSettings, SystemSettingsSchema } from './modules/system-settings/system-settings.schema';
import { GuardsModule } from './common/guards-module/guards.module';

import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AreasModule } from './modules/areas/areas.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { WorksModule } from './modules/works/works.module';
import { EventsModule } from './modules/events/events.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { BannersModule } from './modules/banners/banners.module';
import { PollsModule } from './modules/polls/polls.module';
import { MembershipModule } from './modules/membership/membership.module';
import { VolunteersModule } from './modules/volunteers/volunteers.module';
import { ManifestoModule } from './modules/manifesto/manifesto.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UsersModule } from './modules/users/users.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { PublicConfigModule } from './modules/public-config/public-config.module';
import { PosterGeneratorModule } from './modules/poster-generator/poster-generator.module';
import { AboutLeaderModule } from './modules/about-leader/about-leader.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { UsageModule } from './modules/usage/usage.module';
import { NewsModule } from './modules/news/news.module';
import { RegistrationFormModule } from './modules/registration-form/registration-form.module';
import { CitizenDashboardModule } from './modules/citizen-dashboard/citizen-dashboard.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ExportsModule } from './modules/exports/exports.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: SystemSettings.name, schema: SystemSettingsSchema },
    ]),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // Global guards — available in all modules
    GuardsModule,

    AuthModule,
    TenantsModule,
    AreasModule,
    ComplaintsModule,
    WorksModule,
    EventsModule,
    GalleryModule,
    BannersModule,
    PollsModule,
    MembershipModule,
    VolunteersModule,
    ManifestoModule,
    NotificationsModule,
    UsersModule,
    AdminUsersModule,
    PublicConfigModule,
    DashboardModule,
    UploadsModule,
    PosterGeneratorModule,
    AboutLeaderModule,
    PlansModule,
    SubscriptionsModule,
    AuditLogsModule,
    UsageModule,
    NewsModule,
    RegistrationFormModule,
    CitizenDashboardModule,
    PaymentsModule,
    ExportsModule,
    SystemSettingsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Maintenance Mode — runs first on ALL routes
    //    (internally bypasses /super-admin/* and /auth/super-admin/*)
    consumer
      .apply(MaintenanceMiddleware)
      .forRoutes('*');

    // 2. Tenant resolution — skips super-admin and other non-tenant paths
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'super-admin/(.*)', method: RequestMethod.ALL },
        { path: 'auth/super-admin/(.*)', method: RequestMethod.ALL },
        { path: 'plans', method: RequestMethod.GET },
        { path: 'plans/(.*)', method: RequestMethod.GET },
        { path: 'uploads/(.*)', method: RequestMethod.ALL },
        { path: 'master-areas', method: RequestMethod.ALL },
        { path: 'master-areas/(.*)', method: RequestMethod.ALL },
        { path: 'payments/webhook', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const tenant_schema_1 = require("./modules/tenants/tenant.schema");
const guards_module_1 = require("./common/guards-module/guards.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const areas_module_1 = require("./modules/areas/areas.module");
const complaints_module_1 = require("./modules/complaints/complaints.module");
const works_module_1 = require("./modules/works/works.module");
const events_module_1 = require("./modules/events/events.module");
const gallery_module_1 = require("./modules/gallery/gallery.module");
const banners_module_1 = require("./modules/banners/banners.module");
const polls_module_1 = require("./modules/polls/polls.module");
const membership_module_1 = require("./modules/membership/membership.module");
const volunteers_module_1 = require("./modules/volunteers/volunteers.module");
const manifesto_module_1 = require("./modules/manifesto/manifesto.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const users_module_1 = require("./modules/users/users.module");
const admin_users_module_1 = require("./modules/admin-users/admin-users.module");
const public_config_module_1 = require("./modules/public-config/public-config.module");
const poster_generator_module_1 = require("./modules/poster-generator/poster-generator.module");
const about_leader_module_1 = require("./modules/about-leader/about-leader.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const plans_module_1 = require("./modules/plans/plans.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const audit_logs_module_1 = require("./modules/audit-logs/audit-logs.module");
const usage_module_1 = require("./modules/usage/usage.module");
const news_module_1 = require("./modules/news/news.module");
const registration_form_module_1 = require("./modules/registration-form/registration-form.module");
const citizen_dashboard_module_1 = require("./modules/citizen-dashboard/citizen-dashboard.module");
const payments_module_1 = require("./modules/payments/payments.module");
const exports_module_1 = require("./modules/exports/exports.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .exclude({ path: 'super-admin/(.*)', method: common_1.RequestMethod.ALL }, { path: 'auth/super-admin/(.*)', method: common_1.RequestMethod.ALL }, { path: 'plans', method: common_1.RequestMethod.GET }, { path: 'plans/(.*)', method: common_1.RequestMethod.GET }, { path: 'uploads/(.*)', method: common_1.RequestMethod.ALL }, { path: 'payments/webhook', method: common_1.RequestMethod.ALL })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI'),
                }),
            }),
            mongoose_1.MongooseModule.forFeature([{ name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema }]),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            guards_module_1.GuardsModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            areas_module_1.AreasModule,
            complaints_module_1.ComplaintsModule,
            works_module_1.WorksModule,
            events_module_1.EventsModule,
            gallery_module_1.GalleryModule,
            banners_module_1.BannersModule,
            polls_module_1.PollsModule,
            membership_module_1.MembershipModule,
            volunteers_module_1.VolunteersModule,
            manifesto_module_1.ManifestoModule,
            notifications_module_1.NotificationsModule,
            users_module_1.UsersModule,
            admin_users_module_1.AdminUsersModule,
            public_config_module_1.PublicConfigModule,
            dashboard_module_1.DashboardModule,
            uploads_module_1.UploadsModule,
            poster_generator_module_1.PosterGeneratorModule,
            about_leader_module_1.AboutLeaderModule,
            plans_module_1.PlansModule,
            subscriptions_module_1.SubscriptionsModule,
            audit_logs_module_1.AuditLogsModule,
            usage_module_1.UsageModule,
            news_module_1.NewsModule,
            registration_form_module_1.RegistrationFormModule,
            citizen_dashboard_module_1.CitizenDashboardModule,
            payments_module_1.PaymentsModule,
            exports_module_1.ExportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
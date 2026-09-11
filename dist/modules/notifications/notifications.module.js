"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notifications_service_1 = require("./notifications.service");
const notifications_controller_1 = require("./notifications.controller");
const super_admin_notifications_controller_1 = require("./super-admin-notifications.controller");
const firebase_service_1 = require("./firebase.service");
const notification_schema_1 = require("./notification.schema");
const platform_broadcast_schema_1 = require("./platform-broadcast.schema");
const system_alert_schema_1 = require("./system-alert.schema");
const user_schema_1 = require("../users/user.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const tenant_schema_1 = require("../tenants/tenant.schema");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                { name: notification_schema_1.NotificationRead.name, schema: notification_schema_1.NotificationReadSchema },
                { name: platform_broadcast_schema_1.PlatformBroadcast.name, schema: platform_broadcast_schema_1.PlatformBroadcastSchema },
                { name: system_alert_schema_1.SystemAlert.name, schema: system_alert_schema_1.SystemAlertSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: membership_schema_1.Membership.name, schema: membership_schema_1.MembershipSchema },
                { name: volunteer_schema_1.Volunteer.name, schema: volunteer_schema_1.VolunteerSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
                { name: admin_user_schema_1.AdminUser.name, schema: admin_user_schema_1.AdminUserSchema },
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
            ]),
        ],
        controllers: [notifications_controller_1.NotificationsController, super_admin_notifications_controller_1.SuperAdminNotificationsController],
        providers: [notifications_service_1.NotificationsService, firebase_service_1.FirebaseService],
        exports: [notifications_service_1.NotificationsService, firebase_service_1.FirebaseService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map
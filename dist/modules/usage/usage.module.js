"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const usage_service_1 = require("./usage.service");
const usage_controller_1 = require("./usage.controller");
const tenant_usage_controller_1 = require("./tenant-usage.controller");
const tenant_schema_1 = require("../tenants/tenant.schema");
const plan_schema_1 = require("../plans/plan.schema");
const subscription_schema_1 = require("../subscriptions/subscription.schema");
const user_schema_1 = require("../users/user.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const generated_poster_schema_1 = require("../poster-generator/generated-poster.schema");
const notification_schema_1 = require("../notifications/notification.schema");
let UsageModule = class UsageModule {
};
exports.UsageModule = UsageModule;
exports.UsageModule = UsageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
                { name: plan_schema_1.Plan.name, schema: plan_schema_1.PlanSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: admin_user_schema_1.AdminUser.name, schema: admin_user_schema_1.AdminUserSchema },
                { name: generated_poster_schema_1.GeneratedPoster.name, schema: generated_poster_schema_1.GeneratedPosterSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
            ]),
        ],
        controllers: [usage_controller_1.UsageSuperAdminController, tenant_usage_controller_1.TenantUsageController],
        providers: [usage_service_1.UsageService],
        exports: [usage_service_1.UsageService],
    })
], UsageModule);
//# sourceMappingURL=usage.module.js.map
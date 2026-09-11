"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tenants_service_1 = require("./tenants.service");
const tenants_controller_1 = require("./tenants.controller");
const super_admin_domains_controller_1 = require("./super-admin-domains.controller");
const tenant_domain_controller_1 = require("./tenant-domain.controller");
const custom_domains_service_1 = require("./custom-domains.service");
const tenant_schema_1 = require("./tenant.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const area_schema_1 = require("../areas/area.schema");
const user_schema_1 = require("../users/user.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const event_schema_1 = require("../events/event.schema");
const poll_schema_1 = require("../polls/poll.schema");
const subscription_schema_1 = require("../subscriptions/subscription.schema");
const plan_schema_1 = require("../plans/plan.schema");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
let TenantsModule = class TenantsModule {
};
exports.TenantsModule = TenantsModule;
exports.TenantsModule = TenantsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
                { name: admin_user_schema_1.AdminUser.name, schema: admin_user_schema_1.AdminUserSchema },
                { name: area_schema_1.AreaLevel.name, schema: area_schema_1.AreaLevelSchema },
                { name: area_schema_1.Area.name, schema: area_schema_1.AreaSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: complaint_schema_1.Complaint.name, schema: complaint_schema_1.ComplaintSchema },
                { name: volunteer_schema_1.Volunteer.name, schema: volunteer_schema_1.VolunteerSchema },
                { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                { name: poll_schema_1.Poll.name, schema: poll_schema_1.PollSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: plan_schema_1.Plan.name, schema: plan_schema_1.PlanSchema },
            ]),
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [
            tenants_controller_1.TenantsController,
            super_admin_domains_controller_1.SuperAdminDomainsController,
            tenant_domain_controller_1.TenantDomainController,
        ],
        providers: [tenants_service_1.TenantsService, custom_domains_service_1.CustomDomainsService],
        exports: [tenants_service_1.TenantsService, custom_domains_service_1.CustomDomainsService, mongoose_1.MongooseModule],
    })
], TenantsModule);
//# sourceMappingURL=tenants.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
const super_admin_dashboard_controller_1 = require("./super-admin-dashboard.controller");
const user_schema_1 = require("../users/user.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const work_schema_1 = require("../works/work.schema");
const event_schema_1 = require("../events/event.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const tenant_schema_1 = require("../tenants/tenant.schema");
const subscription_schema_1 = require("../subscriptions/subscription.schema");
const plan_schema_1 = require("../plans/plan.schema");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: complaint_schema_1.Complaint.name, schema: complaint_schema_1.ComplaintSchema },
                { name: work_schema_1.Work.name, schema: work_schema_1.WorkSchema },
                { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                { name: membership_schema_1.Membership.name, schema: membership_schema_1.MembershipSchema },
                { name: volunteer_schema_1.Volunteer.name, schema: volunteer_schema_1.VolunteerSchema },
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: plan_schema_1.Plan.name, schema: plan_schema_1.PlanSchema },
            ]),
        ],
        controllers: [dashboard_controller_1.DashboardController, super_admin_dashboard_controller_1.SuperAdminDashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map
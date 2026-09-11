"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitizenDashboardModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const citizen_dashboard_service_1 = require("./citizen-dashboard.service");
const my_area_controller_1 = require("./my-area.controller");
const citizen_dashboard_controller_1 = require("./citizen-dashboard.controller");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
const work_schema_1 = require("../works/work.schema");
const event_schema_1 = require("../events/event.schema");
const event_rsvp_schema_1 = require("../events/event-rsvp.schema");
const poll_schema_1 = require("../polls/poll.schema");
const news_schema_1 = require("../news/news.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const banner_schema_1 = require("../banners/banner.schema");
const notification_schema_1 = require("../notifications/notification.schema");
let CitizenDashboardModule = class CitizenDashboardModule {
};
exports.CitizenDashboardModule = CitizenDashboardModule;
exports.CitizenDashboardModule = CitizenDashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: area_schema_1.Area.name, schema: area_schema_1.AreaSchema },
                { name: area_schema_1.AreaLevel.name, schema: area_schema_1.AreaLevelSchema },
                { name: work_schema_1.Work.name, schema: work_schema_1.WorkSchema },
                { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                { name: event_rsvp_schema_1.EventRsvp.name, schema: event_rsvp_schema_1.EventRsvpSchema },
                { name: poll_schema_1.Poll.name, schema: poll_schema_1.PollSchema },
                { name: poll_schema_1.PollVote.name, schema: poll_schema_1.PollVoteSchema },
                { name: news_schema_1.News.name, schema: news_schema_1.NewsSchema },
                { name: complaint_schema_1.Complaint.name, schema: complaint_schema_1.ComplaintSchema },
                { name: membership_schema_1.Membership.name, schema: membership_schema_1.MembershipSchema },
                { name: volunteer_schema_1.Volunteer.name, schema: volunteer_schema_1.VolunteerSchema },
                { name: banner_schema_1.Banner.name, schema: banner_schema_1.BannerSchema },
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                { name: notification_schema_1.NotificationRead.name, schema: notification_schema_1.NotificationReadSchema },
            ]),
        ],
        controllers: [
            my_area_controller_1.MyAreaController,
            citizen_dashboard_controller_1.CitizenDashboardController,
            citizen_dashboard_controller_1.DashboardCitizenAliasController,
        ],
        providers: [citizen_dashboard_service_1.CitizenDashboardService],
        exports: [citizen_dashboard_service_1.CitizenDashboardService],
    })
], CitizenDashboardModule);
//# sourceMappingURL=citizen-dashboard.module.js.map
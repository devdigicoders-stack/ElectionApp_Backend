"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRsvpStatus = exports.GalleryType = exports.NotificationTarget = exports.VolunteerTaskStatus = exports.TaskPriority = exports.VolunteerStatus = exports.MembershipStatus = exports.WorkStatus = exports.ComplaintStatus = exports.NewsStatus = exports.FeatureKey = exports.UserRole = exports.TenantStatus = void 0;
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "active";
    TenantStatus["SUSPENDED"] = "suspended";
    TenantStatus["TRIAL"] = "trial";
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["LEADER"] = "leader";
    UserRole["ADMIN"] = "admin";
    UserRole["CONTENT_MANAGER"] = "content_manager";
    UserRole["COMPLAINT_MANAGER"] = "complaint_manager";
    UserRole["VOLUNTEER_MANAGER"] = "volunteer_manager";
    UserRole["AREA_COORDINATOR"] = "area_coordinator";
    UserRole["CITIZEN"] = "citizen";
})(UserRole || (exports.UserRole = UserRole = {}));
var FeatureKey;
(function (FeatureKey) {
    FeatureKey["COMPLAINTS"] = "complaints";
    FeatureKey["WORKS"] = "works";
    FeatureKey["EVENTS"] = "events";
    FeatureKey["POLLS"] = "polls";
    FeatureKey["MEMBERSHIP"] = "membership";
    FeatureKey["VOLUNTEERS"] = "volunteers";
    FeatureKey["GALLERY"] = "gallery";
    FeatureKey["MANIFESTO"] = "manifesto";
    FeatureKey["POSTER_GENERATOR"] = "poster_generator";
    FeatureKey["NOTIFICATIONS"] = "notifications";
    FeatureKey["BANNERS"] = "banners";
    FeatureKey["NEWS"] = "news";
})(FeatureKey || (exports.FeatureKey = FeatureKey = {}));
var NewsStatus;
(function (NewsStatus) {
    NewsStatus["DRAFT"] = "draft";
    NewsStatus["SCHEDULED"] = "scheduled";
    NewsStatus["PUBLISHED"] = "published";
    NewsStatus["ARCHIVED"] = "archived";
})(NewsStatus || (exports.NewsStatus = NewsStatus = {}));
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["SUBMITTED"] = "submitted";
    ComplaintStatus["UNDER_REVIEW"] = "under_review";
    ComplaintStatus["ASSIGNED"] = "assigned";
    ComplaintStatus["IN_PROGRESS"] = "in_progress";
    ComplaintStatus["RESOLVED"] = "resolved";
    ComplaintStatus["CLOSED"] = "closed";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
var WorkStatus;
(function (WorkStatus) {
    WorkStatus["UPCOMING"] = "upcoming";
    WorkStatus["IN_PROGRESS"] = "in_progress";
    WorkStatus["COMPLETED"] = "completed";
})(WorkStatus || (exports.WorkStatus = WorkStatus = {}));
var MembershipStatus;
(function (MembershipStatus) {
    MembershipStatus["PENDING"] = "pending";
    MembershipStatus["APPROVED"] = "approved";
    MembershipStatus["REJECTED"] = "rejected";
    MembershipStatus["EXPIRED"] = "expired";
})(MembershipStatus || (exports.MembershipStatus = MembershipStatus = {}));
var VolunteerStatus;
(function (VolunteerStatus) {
    VolunteerStatus["ACTIVE"] = "active";
    VolunteerStatus["INACTIVE"] = "inactive";
})(VolunteerStatus || (exports.VolunteerStatus = VolunteerStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var VolunteerTaskStatus;
(function (VolunteerTaskStatus) {
    VolunteerTaskStatus["PENDING"] = "pending";
    VolunteerTaskStatus["ACCEPTED"] = "accepted";
    VolunteerTaskStatus["IN_PROGRESS"] = "in_progress";
    VolunteerTaskStatus["COMPLETED"] = "completed";
    VolunteerTaskStatus["REJECTED"] = "rejected";
})(VolunteerTaskStatus || (exports.VolunteerTaskStatus = VolunteerTaskStatus = {}));
var NotificationTarget;
(function (NotificationTarget) {
    NotificationTarget["ALL"] = "all";
    NotificationTarget["MEMBERS"] = "members";
    NotificationTarget["VOLUNTEERS"] = "volunteers";
    NotificationTarget["AREA"] = "area";
    NotificationTarget["SPECIFIC"] = "specific";
})(NotificationTarget || (exports.NotificationTarget = NotificationTarget = {}));
var GalleryType;
(function (GalleryType) {
    GalleryType["PHOTO"] = "photo";
    GalleryType["VIDEO"] = "video";
})(GalleryType || (exports.GalleryType = GalleryType = {}));
var EventRsvpStatus;
(function (EventRsvpStatus) {
    EventRsvpStatus["INTERESTED"] = "interested";
    EventRsvpStatus["GOING"] = "going";
})(EventRsvpStatus || (exports.EventRsvpStatus = EventRsvpStatus = {}));
//# sourceMappingURL=types.js.map
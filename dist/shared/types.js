"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollResultVisibility = exports.PollTargetAudience = exports.ElectionType = exports.EventStatus = exports.EventType = exports.EventRsvpStatus = exports.GalleryType = exports.NotificationTarget = exports.VolunteerTaskStatus = exports.TaskPriority = exports.VolunteerStatus = exports.PaymentPurpose = exports.PaymentStatus = exports.MembershipStatus = exports.WorkStatus = exports.ComplaintPriority = exports.ComplaintStatus = exports.NewsStatus = exports.FeatureKey = exports.UserRole = exports.TenantStatus = void 0;
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
    FeatureKey["PAYMENTS"] = "payments";
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
    ComplaintStatus["REJECTED"] = "rejected";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
var ComplaintPriority;
(function (ComplaintPriority) {
    ComplaintPriority["LOW"] = "low";
    ComplaintPriority["MEDIUM"] = "medium";
    ComplaintPriority["HIGH"] = "high";
    ComplaintPriority["URGENT"] = "urgent";
})(ComplaintPriority || (exports.ComplaintPriority = ComplaintPriority = {}));
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
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESSFUL"] = "successful";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentPurpose;
(function (PaymentPurpose) {
    PaymentPurpose["MEMBERSHIP_FEE"] = "membership_fee";
    PaymentPurpose["VOLUNTARY_CONTRIBUTION"] = "voluntary_contribution";
    PaymentPurpose["EVENT_PASS"] = "event_pass";
    PaymentPurpose["PLATFORM_SUBSCRIPTION"] = "platform_subscription";
})(PaymentPurpose || (exports.PaymentPurpose = PaymentPurpose = {}));
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
    EventRsvpStatus["NOT_GOING"] = "not_going";
})(EventRsvpStatus || (exports.EventRsvpStatus = EventRsvpStatus = {}));
var EventType;
(function (EventType) {
    EventType["JAN_SABHA"] = "Jan Sabha";
    EventType["RALLY"] = "Rally";
    EventType["PUBLIC_MEETING"] = "Public Meeting";
    EventType["MEMBERSHIP_CAMPAIGN"] = "Membership Campaign";
    EventType["PRESS_CONFERENCE"] = "Press Conference";
    EventType["SPECIAL_EVENT"] = "Special Event";
    EventType["SOCIAL_PROGRAM"] = "Social Program";
    EventType["OTHER"] = "Other";
})(EventType || (exports.EventType = EventType = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["UPCOMING"] = "upcoming";
    EventStatus["ONGOING"] = "ongoing";
    EventStatus["COMPLETED"] = "completed";
    EventStatus["CANCELLED"] = "cancelled";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var ElectionType;
(function (ElectionType) {
    ElectionType["GRAM_PRADHAN"] = "gram_pradhan";
    ElectionType["BDC_MEMBER"] = "bdc_member";
    ElectionType["BLOCK_PRAMUKH"] = "block_pramukh";
    ElectionType["ZILA_PANCHAYAT"] = "zila_panchayat";
    ElectionType["MUNICIPAL_COUNCILLOR"] = "municipal_councillor";
    ElectionType["MAYOR"] = "mayor";
    ElectionType["MLA"] = "mla";
    ElectionType["MP"] = "mp";
    ElectionType["POLITICAL_PARTY"] = "political_party";
    ElectionType["OTHER"] = "other";
})(ElectionType || (exports.ElectionType = ElectionType = {}));
var PollTargetAudience;
(function (PollTargetAudience) {
    PollTargetAudience["ALL"] = "ALL";
    PollTargetAudience["SPECIFIC_AREA"] = "SPECIFIC_AREA";
    PollTargetAudience["MEMBERS_ONLY"] = "MEMBERS_ONLY";
    PollTargetAudience["VOLUNTEERS_ONLY"] = "VOLUNTEERS_ONLY";
    PollTargetAudience["AGE_GROUP"] = "AGE_GROUP";
    PollTargetAudience["GENDER"] = "GENDER";
})(PollTargetAudience || (exports.PollTargetAudience = PollTargetAudience = {}));
var PollResultVisibility;
(function (PollResultVisibility) {
    PollResultVisibility["ALWAYS_PUBLIC"] = "ALWAYS_PUBLIC";
    PollResultVisibility["AFTER_VOTE"] = "AFTER_VOTE";
    PollResultVisibility["AFTER_END"] = "AFTER_END";
    PollResultVisibility["ADMIN_ONLY"] = "ADMIN_ONLY";
})(PollResultVisibility || (exports.PollResultVisibility = PollResultVisibility = {}));
//# sourceMappingURL=types.js.map
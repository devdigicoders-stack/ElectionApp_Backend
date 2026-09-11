export declare enum TenantStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    TRIAL = "trial"
}
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    LEADER = "leader",
    ADMIN = "admin",
    CONTENT_MANAGER = "content_manager",
    COMPLAINT_MANAGER = "complaint_manager",
    VOLUNTEER_MANAGER = "volunteer_manager",
    AREA_COORDINATOR = "area_coordinator",
    CITIZEN = "citizen"
}
export declare enum FeatureKey {
    COMPLAINTS = "complaints",
    WORKS = "works",
    EVENTS = "events",
    POLLS = "polls",
    MEMBERSHIP = "membership",
    VOLUNTEERS = "volunteers",
    GALLERY = "gallery",
    MANIFESTO = "manifesto",
    POSTER_GENERATOR = "poster_generator",
    NOTIFICATIONS = "notifications",
    BANNERS = "banners",
    NEWS = "news",
    PAYMENTS = "payments"
}
export declare enum NewsStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum ComplaintStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed",
    REJECTED = "rejected"
}
export declare enum ComplaintPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum WorkStatus {
    UPCOMING = "upcoming",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed"
}
export declare enum MembershipStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentPurpose {
    MEMBERSHIP_FEE = "membership_fee",
    VOLUNTARY_CONTRIBUTION = "voluntary_contribution",
    EVENT_PASS = "event_pass",
    PLATFORM_SUBSCRIPTION = "platform_subscription"
}
export declare enum VolunteerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum VolunteerTaskStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    REJECTED = "rejected"
}
export declare enum NotificationTarget {
    ALL = "all",
    MEMBERS = "members",
    VOLUNTEERS = "volunteers",
    AREA = "area",
    SPECIFIC = "specific"
}
export declare enum GalleryType {
    PHOTO = "photo",
    VIDEO = "video"
}
export declare enum EventRsvpStatus {
    INTERESTED = "interested",
    GOING = "going",
    NOT_GOING = "not_going"
}
export declare enum EventType {
    JAN_SABHA = "Jan Sabha",
    RALLY = "Rally",
    PUBLIC_MEETING = "Public Meeting",
    MEMBERSHIP_CAMPAIGN = "Membership Campaign",
    PRESS_CONFERENCE = "Press Conference",
    SPECIAL_EVENT = "Special Event",
    SOCIAL_PROGRAM = "Social Program",
    OTHER = "Other"
}
export declare enum EventStatus {
    UPCOMING = "upcoming",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum ElectionType {
    GRAM_PRADHAN = "gram_pradhan",
    BDC_MEMBER = "bdc_member",
    BLOCK_PRAMUKH = "block_pramukh",
    ZILA_PANCHAYAT = "zila_panchayat",
    MUNICIPAL_COUNCILLOR = "municipal_councillor",
    MAYOR = "mayor",
    MLA = "mla",
    MP = "mp",
    POLITICAL_PARTY = "political_party",
    OTHER = "other"
}
export interface BrandingConfig {
    platformName?: string;
    title?: string;
    logoUrl?: string;
    logo?: string;
    faviconUrl?: string;
    pwaIconUrl?: string;
    leaderPhotoUrl?: string;
    loginBgUrl?: string;
    splashScreenUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    leaderName: string;
    tagline?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        whatsapp?: string;
    };
}
export interface RegistrationField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'phone' | 'area_selector';
    required: boolean;
    options?: string[];
    areaLevels?: string[];
}
export declare enum PollTargetAudience {
    ALL = "ALL",
    SPECIFIC_AREA = "SPECIFIC_AREA",
    MEMBERS_ONLY = "MEMBERS_ONLY",
    VOLUNTEERS_ONLY = "VOLUNTEERS_ONLY",
    AGE_GROUP = "AGE_GROUP",
    GENDER = "GENDER"
}
export declare enum PollStatus {
    UPCOMING = "UPCOMING",
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED"
}
export declare enum PollResultVisibility {
    ALWAYS_PUBLIC = "ALWAYS_PUBLIC",
    AFTER_VOTE = "AFTER_VOTE",
    AFTER_END = "AFTER_END",
    SCHEDULED_DATE = "SCHEDULED_DATE",
    ADMIN_ONLY = "ADMIN_ONLY"
}

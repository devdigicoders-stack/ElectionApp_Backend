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
    GOING = "going"
}
export interface BrandingConfig {
    logoUrl?: string;
    faviconUrl?: string;
    pwaIconUrl?: string;
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

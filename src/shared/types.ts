export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  LEADER = 'leader',
  ADMIN = 'admin',
  CONTENT_MANAGER = 'content_manager',
  COMPLAINT_MANAGER = 'complaint_manager',
  VOLUNTEER_MANAGER = 'volunteer_manager',
  AREA_COORDINATOR = 'area_coordinator',
  CITIZEN = 'citizen',
}

export enum FeatureKey {
  COMPLAINTS = 'complaints',
  WORKS = 'works',
  EVENTS = 'events',
  POLLS = 'polls',
  MEMBERSHIP = 'membership',
  VOLUNTEERS = 'volunteers',
  GALLERY = 'gallery',
  MANIFESTO = 'manifesto',
  POSTER_GENERATOR = 'poster_generator',
  NOTIFICATIONS = 'notifications',
  BANNERS = 'banners',
  NEWS = 'news',
  PAYMENTS = 'payments',
}

export enum NewsStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ComplaintStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum WorkStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum MembershipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentPurpose {
  MEMBERSHIP_FEE = 'membership_fee',
  VOLUNTARY_CONTRIBUTION = 'voluntary_contribution',
  EVENT_PASS = 'event_pass',
  PLATFORM_SUBSCRIPTION = 'platform_subscription',
}

export enum VolunteerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum VolunteerTaskStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum NotificationTarget {
  ALL = 'all',
  MEMBERS = 'members',
  VOLUNTEERS = 'volunteers',
  AREA = 'area',
  SPECIFIC = 'specific',
}

export enum GalleryType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export enum EventRsvpStatus {
  INTERESTED = 'interested',
  GOING = 'going',
}

export enum ElectionType {
  GRAM_PRADHAN = 'gram_pradhan',
  BDC_MEMBER = 'bdc_member',
  BLOCK_PRAMUKH = 'block_pramukh',
  ZILA_PANCHAYAT = 'zila_panchayat',
  MUNICIPAL_COUNCILLOR = 'municipal_councillor',
  MAYOR = 'mayor',
  MLA = 'mla',
  MP = 'mp',
  POLITICAL_PARTY = 'political_party',
  OTHER = 'other',
}

export interface BrandingConfig {
  platformName?: string;
  logoUrl?: string;
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


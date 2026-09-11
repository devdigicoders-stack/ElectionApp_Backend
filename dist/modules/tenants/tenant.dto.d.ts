import { TenantStatus, UserRole } from '../../shared/types';
export declare class CreateTenantDto {
    slug: string;
    name?: string;
    title?: string;
    logo?: string;
    logoUrl?: string;
    leaderName?: string;
    contactPerson?: string;
    mobileNumber?: string;
    email?: string;
    electionType?: string;
    planId?: string;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    customDomain?: string;
    branding?: Record<string, any>;
    settings?: Record<string, any>;
}
export declare class UpdateTenantDto {
    name?: string;
    title?: string;
    logo?: string;
    logoUrl?: string;
    contactPerson?: string;
    mobileNumber?: string;
    email?: string;
    electionType?: string;
    customDomain?: string;
    status?: TenantStatus;
    isPublished?: boolean;
    branding?: Record<string, any>;
    settings?: Record<string, any>;
}
export declare class UpdateBrandingDto {
    platformName?: string;
    title?: string;
    logoUrl?: string;
    logo?: string;
    leaderPhotoUrl?: string;
    faviconUrl?: string;
    pwaIconUrl?: string;
    loginBgUrl?: string;
    splashScreenUrl?: string;
    splashScreens?: Array<{
        title?: string;
        subtitle?: string;
        mediaType?: 'image' | 'video';
        mediaUrl: string;
        order?: number;
    }>;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    leaderName?: string;
    tagline?: string;
    footerText?: string;
    privacyPolicyUrl?: string;
    termsUrl?: string;
    privacyPolicyContent?: string;
    termsContent?: string;
    socialLinks?: Record<string, string>;
}
export declare class OnboardFullTenantDto extends CreateTenantDto {
    adminUser?: {
        name: string;
        email: string;
        password: string;
        role?: UserRole;
    };
    areaLevels?: Array<{
        levelOrder: number;
        name: string;
        isRequired?: boolean;
    }>;
}
export declare class ImpersonateTenantDto {
    reason?: string;
    durationHours?: number;
}
export declare class ExitImpersonationDto {
    notes?: string;
}

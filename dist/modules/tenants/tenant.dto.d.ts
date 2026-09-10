import { TenantStatus, UserRole } from '../../shared/types';
export declare class CreateTenantDto {
    slug: string;
    name: string;
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
    logoUrl?: string;
    leaderPhotoUrl?: string;
    faviconUrl?: string;
    pwaIconUrl?: string;
    loginBgUrl?: string;
    splashScreenUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    leaderName?: string;
    tagline?: string;
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

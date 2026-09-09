import { TenantStatus } from '../../shared/types';
export declare class CreateTenantDto {
    slug: string;
    name: string;
    customDomain?: string;
    branding?: Record<string, any>;
    settings?: Record<string, any>;
}
export declare class UpdateTenantDto {
    name?: string;
    customDomain?: string;
    status?: TenantStatus;
    branding?: Record<string, any>;
    settings?: Record<string, any>;
}
export declare class ImpersonateTenantDto {
    reason?: string;
    durationHours?: number;
}
export declare class ExitImpersonationDto {
    notes?: string;
}

import { BillingCycle, SupportLevel, TargetSegment } from './plan.schema';
import { TenantStatus } from '../../shared/types';
export declare class PlanLimitsDto {
    maxCitizens?: number;
    maxStaffUsers?: number;
    maxPostersPerMonth?: number;
    maxNotificationsPerMonth?: number;
    maxStorageMB?: number;
}
export declare class PlanOverageRatesDto {
    citizenPer1kRate?: number;
    storagePerGbRate?: number;
    smsRate?: number;
    whatsappRate?: number;
}
export declare class CreatePlanDto {
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency?: string;
    billingCycle?: BillingCycle;
    trialDays?: number;
    supportLevel?: SupportLevel;
    targetSegment?: TargetSegment;
    features?: string[];
    limits?: PlanLimitsDto;
    overageRates?: PlanOverageRatesDto;
    isPopular?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class UpdatePlanDto {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
    billingCycle?: BillingCycle;
    trialDays?: number;
    supportLevel?: SupportLevel;
    targetSegment?: TargetSegment;
    features?: string[];
    limits?: PlanLimitsDto;
    overageRates?: PlanOverageRatesDto;
    isPopular?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class AssignPlanDto {
    planId: string;
    durationMonths?: number;
    isTrial?: boolean;
    trialDays?: number;
    status?: TenantStatus;
}

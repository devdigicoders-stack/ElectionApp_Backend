import { MembershipStatus } from '../../shared/types';
export declare class CreateMembershipPlanDto {
    name: string;
    code: string;
    description?: string;
    price?: number;
    currency?: string;
    validityDays?: number;
    badgeText?: string;
    badgeColor?: string;
    benefits?: string[];
    requiresApproval?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class UpdateMembershipPlanDto {
    name?: string;
    code?: string;
    description?: string;
    price?: number;
    currency?: string;
    validityDays?: number;
    badgeText?: string;
    badgeColor?: string;
    benefits?: string[];
    requiresApproval?: boolean;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class ApplyMembershipDto {
    planId?: string;
    designation?: string;
    photoUrl?: string;
    customData?: Record<string, any>;
}
export declare class ApproveMembershipDto {
    designation?: string;
    expiresAt?: string;
    remarks?: string;
}
export declare class RejectMembershipDto {
    reason: string;
}
export declare class RegenerateCardDto {
    designation?: string;
    photoUrl?: string;
    expiresAt?: string;
}
export declare class UpdateMembershipCardDetailsDto {
    designation?: string;
    photoUrl?: string;
    expiresAt?: string;
    customData?: Record<string, any>;
}
export declare class QueryMembershipDto {
    status?: MembershipStatus;
    planId?: string;
    search?: string;
    page?: number;
    limit?: number;
    format?: string;
}

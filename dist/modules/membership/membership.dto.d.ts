import { MembershipStatus } from '../../shared/types';
export declare class ApplyMembershipDto {
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
    search?: string;
    page?: number;
    limit?: number;
}

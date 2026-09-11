import { MembershipStatus, VolunteerStatus } from '../../shared/types';
export declare enum PublicUserCategory {
    CITIZEN = "citizen",
    SUPPORTER = "supporter",
    MEMBER = "member",
    VOLUNTEER = "volunteer"
}
export declare enum CitizenStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BLOCKED = "blocked"
}
export declare const PREDEFINED_CRM_TAGS: string[];
export declare class CitizenQueryDto {
    search?: string;
    name?: string;
    mobile?: string;
    areaId?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    ageGroup?: string;
    tag?: string;
    tags?: string;
    category?: PublicUserCategory;
    status?: CitizenStatus;
    membershipStatus?: string;
    volunteerStatus?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    format?: string;
}
export declare class UpdateCitizenDto {
    name?: string;
    email?: string;
    dob?: string;
    gender?: string;
    areaId?: string;
    profilePhoto?: string;
    address?: string;
    notes?: string;
    customFields?: Record<string, any>;
}
export declare class UpdateCitizenStatusDto {
    status: CitizenStatus;
    reason?: string;
}
export declare class AddTagsDto {
    tags: string[];
}
export declare class RemoveTagDto {
    tag: string;
}
export declare class BulkTagDto {
    userIds: string[];
    tags: string[];
}
export declare class BulkUntagDto {
    userIds: string[];
    tag: string;
}
export declare class UpgradeCategoryDto {
    category: PublicUserCategory;
    notes?: string;
}
export declare class AssignMembershipDto {
    status?: MembershipStatus;
    designation?: string;
    membershipNumber?: string;
    expiresAt?: string;
    photoUrl?: string;
    paymentInfo?: {
        amount?: number;
        transactionId?: string;
        paidAt?: Date;
    };
    notes?: string;
}
export declare class AssignVolunteerDto {
    role: string;
    assignedAreaId?: string;
    status?: VolunteerStatus;
    tasks?: string[];
    notes?: string;
}

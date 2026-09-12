import { ComplaintStatus, ComplaintPriority } from '../../shared/types';
export declare class CreateComplaintDto {
    title: string;
    description: string;
    category: string;
    areaId: string;
    attachments?: string[];
    mediaUrls?: string[];
    videoUrl?: string;
    priority?: ComplaintPriority;
}
export declare class QueryComplaintsDto {
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    areaId?: string;
    category?: string;
    assignedTo?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    isPublic?: boolean;
}
export declare class AssignComplaintDto {
    assignedTo: string;
    note?: string;
    priority?: ComplaintPriority;
}
export declare class UpdatePriorityDto {
    priority: ComplaintPriority;
    note?: string;
}
export declare class AddRemarkDto {
    remark: string;
    isInternal?: boolean;
}
export declare class ResolveComplaintDto {
    resolutionDetails: string;
    resolutionProof?: string[];
    note?: string;
}
export declare class CloseComplaintDto {
    closingNote?: string;
}
export declare class RejectComplaintDto {
    reason: string;
}
export declare class UpdateComplaintStatusDto {
    status: ComplaintStatus;
    note?: string;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    icon?: string;
    order?: number;
}
export declare class TogglePublicComplaintDto {
    isPublic: boolean;
}
export declare class QueryPublicComplaintsDto {
    status?: ComplaintStatus;
    areaId?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    order?: number;
}

import { TaskPriority, VolunteerTaskStatus } from '../../shared/types';
export declare class CreateVolunteerTaskDto {
    title: string;
    description: string;
    assignedVolunteerId?: string;
    assignedUserId?: string;
    areaId?: string;
    dueDate?: string;
    priority?: TaskPriority;
    attachments?: string[];
}
export declare class UpdateVolunteerTaskDto {
    title?: string;
    description?: string;
    assignedVolunteerId?: string;
    assignedUserId?: string;
    areaId?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: VolunteerTaskStatus;
    attachments?: string[];
}
export declare class SubmitVolunteerTaskDto {
    completionRemark: string;
    images?: string[];
    reportUrl?: string;
}
export declare class ReviewVolunteerTaskDto {
    isApproved: boolean;
    reviewNote?: string;
}
export declare class QueryVolunteerTaskDto {
    status?: VolunteerTaskStatus;
    priority?: TaskPriority;
    areaId?: string;
    volunteerId?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'dueDate' | 'createdAt' | 'priority';
    sortOrder?: 'asc' | 'desc';
}

export declare class UpdateCitizenProfileDto {
    name?: string;
    email?: string;
    dob?: string;
    gender?: string;
    areaId?: string;
    profilePhoto?: string;
    address?: string;
    customFields?: Record<string, any>;
}
export declare class QueryFeedDto {
    limit?: number;
    page?: number;
}

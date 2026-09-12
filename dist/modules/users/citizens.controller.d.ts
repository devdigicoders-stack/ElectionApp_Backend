import { Response } from 'express';
import { UsersService } from './users.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { CitizenQueryDto, UpdateCitizenDto, UpdateCitizenStatusDto, AddTagsDto, BulkTagDto, BulkUntagDto, UpgradeCategoryDto, AssignMembershipDto, AssignVolunteerDto } from './citizens.dto';
export declare class CitizensController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findCitizens(req: TenantRequest, query: CitizenQueryDto): Promise<{
        data: {
            age: number | null;
            membership: {
                status: import("../../shared/types").MembershipStatus;
                designation: string | undefined;
                membershipNumber: string | undefined;
                cardUrl: string | undefined;
                expiresAt: Date | undefined;
            } | null;
            volunteer: {
                role: string | undefined;
                status: import("../../shared/types").VolunteerStatus;
            } | null;
            tenantId: import("mongoose").Types.ObjectId;
            mobile: string;
            name?: string;
            dob?: Date;
            gender?: string;
            areaId?: import("mongoose").Types.ObjectId;
            customFields: Record<string, any>;
            isActive: boolean;
            isProfileComplete: boolean;
            tags: string[];
            category: string;
            status: string;
            email?: string;
            profilePhoto?: string;
            address?: string;
            notes?: string;
            lastActiveAt?: Date;
            fcmTokens: string[];
            createdAt?: Date;
            updatedAt?: Date;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAvailableTags(req: TenantRequest): Promise<{
        tags: {
            tag: any;
            count: any;
        }[];
        suggestedTags: string[];
        totalUniqueTags: number;
    }>;
    getCrmAnalytics(req: TenantRequest): Promise<{
        overview: {
            totalCitizens: number;
            newToday: number;
            newThisWeek: number;
            newThisMonth: number;
            active: number;
            inactive: number;
            blocked: number;
            profileComplete: number;
            profileCompleteRate: string;
        };
        categories: Record<string, number>;
        demographics: {
            gender: Record<string, number>;
        };
        topTags: {
            tag: any;
            count: any;
        }[];
        topAreas: any[];
    }>;
    exportCitizens(req: TenantRequest & {
        user?: any;
    }, query: CitizenQueryDto, res: Response, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
    bulkAddTags(req: TenantRequest, dto: BulkTagDto): Promise<{
        success: boolean;
        matchedCount: number;
        modifiedCount: number;
        tagsAdded: string[];
        message: string;
    }>;
    bulkRemoveTag(req: TenantRequest, dto: BulkUntagDto): Promise<{
        success: boolean;
        matchedCount: number;
        modifiedCount: number;
        tagRemoved: string;
        message: string;
    }>;
    getCitizenDetails(req: TenantRequest, id: string): Promise<{
        citizen: {
            age: number | null;
            tenantId: import("mongoose").Types.ObjectId;
            mobile: string;
            name?: string;
            dob?: Date;
            gender?: string;
            areaId?: import("mongoose").Types.ObjectId;
            customFields: Record<string, any>;
            isActive: boolean;
            isProfileComplete: boolean;
            tags: string[];
            category: string;
            status: string;
            email?: string;
            profilePhoto?: string;
            address?: string;
            notes?: string;
            lastActiveAt?: Date;
            fcmTokens: string[];
            createdAt?: Date;
            updatedAt?: Date;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        };
        membership: (import("../membership/membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        volunteer: (import("../volunteers/volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        activity: {
            complaintsCount: number;
            recentComplaints: (import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
    }>;
    updateCitizen(req: TenantRequest, id: string, dto: UpdateCitizenDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateCitizenStatus(req: TenantRequest, id: string, dto: UpdateCitizenStatusDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    addTags(req: TenantRequest, id: string, dto: AddTagsDto): Promise<{
        message: string;
        tags: string[];
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    removeTag(req: TenantRequest, id: string, tag: string): Promise<{
        message: string;
        tags: string[];
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    upgradeCategory(req: TenantRequest, id: string, dto: UpgradeCategoryDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    assignMembership(req: any, id: string, dto: AssignMembershipDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        membership: import("mongoose").Document<unknown, {}, import("../membership/membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../membership/membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    assignVolunteer(req: any, id: string, dto: AssignVolunteerDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        volunteer: import("mongoose").Document<unknown, {}, import("../volunteers/volunteer.schema").VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../volunteers/volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}

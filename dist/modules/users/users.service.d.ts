import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { User, UserDocument } from './user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import { AreaDocument } from '../areas/area.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CitizenQueryDto, UpdateCitizenDto, UpdateCitizenStatusDto, UpgradeCategoryDto, AssignMembershipDto, AssignVolunteerDto } from './citizens.dto';
import { MembershipStatus, VolunteerStatus } from '../../shared/types';
export declare class UsersService {
    private userModel;
    private membershipModel;
    private volunteerModel;
    private complaintModel;
    private areaModel;
    private auditLogsService?;
    constructor(userModel: Model<UserDocument>, membershipModel: Model<MembershipDocument>, volunteerModel: Model<VolunteerDocument>, complaintModel: Model<ComplaintDocument>, areaModel: Model<AreaDocument>, auditLogsService?: AuditLogsService | undefined);
    findAll(tenant: TenantDocument, filters: {
        areaId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProfile(tenant: TenantDocument, userId: string, data: any): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    toggleActive(tenant: TenantDocument, id: string, isActive: boolean): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getStats(tenant: TenantDocument): Promise<{
        total: number;
        active: number;
        profileComplete: number;
    }>;
    getAreaWiseCount(tenant: TenantDocument): Promise<any[]>;
    private buildCitizenFilterQuery;
    private calculateAge;
    findCitizens(tenant: TenantDocument, queryDto: CitizenQueryDto): Promise<{
        data: {
            age: number | null;
            membership: {
                status: MembershipStatus;
                designation: string | undefined;
                membershipNumber: string | undefined;
                cardUrl: string | undefined;
                expiresAt: Date | undefined;
            } | null;
            volunteer: {
                role: string | undefined;
                status: VolunteerStatus;
            } | null;
            tenantId: Types.ObjectId;
            mobile: string;
            name?: string;
            dob?: Date;
            gender?: string;
            areaId?: Types.ObjectId;
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
            _id: Types.ObjectId;
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
    getCitizenDetails(tenant: TenantDocument, id: string): Promise<{
        citizen: {
            age: number | null;
            tenantId: Types.ObjectId;
            mobile: string;
            name?: string;
            dob?: Date;
            gender?: string;
            areaId?: Types.ObjectId;
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
            _id: Types.ObjectId;
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
        membership: (Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        volunteer: (Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        activity: {
            complaintsCount: number;
            recentComplaints: (Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
    }>;
    updateCitizen(tenant: TenantDocument, id: string, dto: UpdateCitizenDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateCitizenStatus(tenant: TenantDocument, id: string, dto: UpdateCitizenStatusDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getAvailableTags(tenant: TenantDocument): Promise<{
        tags: {
            tag: any;
            count: any;
        }[];
        suggestedTags: string[];
        totalUniqueTags: number;
    }>;
    addTags(tenant: TenantDocument, id: string, tags: string[]): Promise<{
        message: string;
        tags: string[];
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    removeTag(tenant: TenantDocument, id: string, tag: string): Promise<{
        message: string;
        tags: string[];
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    bulkAddTags(tenant: TenantDocument, userIds: string[], tags: string[]): Promise<{
        success: boolean;
        matchedCount: number;
        modifiedCount: number;
        tagsAdded: string[];
        message: string;
    }>;
    bulkRemoveTag(tenant: TenantDocument, userIds: string[], tag: string): Promise<{
        success: boolean;
        matchedCount: number;
        modifiedCount: number;
        tagRemoved: string;
        message: string;
    }>;
    upgradeCategory(tenant: TenantDocument, id: string, dto: UpgradeCategoryDto): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    assignMembership(tenant: TenantDocument, id: string, dto: AssignMembershipDto, adminId?: string): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        membership: import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    assignVolunteer(tenant: TenantDocument, id: string, dto: AssignVolunteerDto, adminId?: string): Promise<{
        message: string;
        citizen: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        volunteer: import("mongoose").Document<unknown, {}, VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    exportCitizens(tenant: TenantDocument, queryDto: CitizenQueryDto, res: Response, adminUser?: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
    getCrmAnalytics(tenant: TenantDocument): Promise<{
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
}

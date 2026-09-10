import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { Membership, MembershipDocument } from './membership.schema';
import { MembershipPlan, MembershipPlanDocument } from './membership-plan.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { UserDocument } from '../users/user.schema';
import { AreaDocument } from '../areas/area.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { MembershipStatus } from '../../shared/types';
import { ApplyMembershipDto, ApproveMembershipDto, QueryMembershipDto, RegenerateCardDto, UpdateMembershipCardDetailsDto, CreateMembershipPlanDto, UpdateMembershipPlanDto } from './membership.dto';
export declare class MembershipService {
    private membershipModel;
    private planModel;
    private userModel;
    private areaModel;
    private auditLogsService?;
    constructor(membershipModel: Model<MembershipDocument>, planModel: Model<MembershipPlanDocument>, userModel: Model<UserDocument>, areaModel: Model<AreaDocument>, auditLogsService?: AuditLogsService | undefined);
    private generateMemberNumber;
    private formatDate;
    private drawRoundedRect;
    seedDefaultPlansIfEmpty(tenant: TenantDocument): Promise<void>;
    createPlan(tenant: TenantDocument, dto: CreateMembershipPlanDto): Promise<import("mongoose").Document<unknown, {}, MembershipPlanDocument, {}, import("mongoose").DefaultSchemaOptions> & MembershipPlan & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllPlans(tenant: TenantDocument, onlyActive?: boolean): Promise<(MembershipPlan & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findPlanById(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, MembershipPlanDocument, {}, import("mongoose").DefaultSchemaOptions> & MembershipPlan & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePlan(tenant: TenantDocument, id: string, dto: UpdateMembershipPlanDto): Promise<import("mongoose").Document<unknown, {}, MembershipPlanDocument, {}, import("mongoose").DefaultSchemaOptions> & MembershipPlan & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deletePlan(tenant: TenantDocument, id: string): Promise<{
        message: string;
        plan: import("mongoose").Document<unknown, {}, MembershipPlanDocument, {}, import("mongoose").DefaultSchemaOptions> & MembershipPlan & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    } | {
        message: string;
        plan?: undefined;
    }>;
    generateDigitalCard(tenant: TenantDocument, membership: MembershipDocument, userDoc?: any): Promise<{
        cardUrl: string;
        filePath: string;
    }>;
    apply(tenant: TenantDocument, userId: string, dto?: ApplyMembershipDto): Promise<{
        message: string;
        autoApproved: boolean;
        membership: (import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        requiresPayment?: undefined;
        paymentDetails?: undefined;
    } | {
        message: string;
        autoApproved: boolean;
        requiresPayment: any;
        paymentDetails: {
            amount: any;
            currency: any;
            planId: any;
            planName: any;
            paymentOrderUrl: string;
        } | null;
        membership: (import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    findByUser(tenant: TenantDocument, userId: string): Promise<(import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyCard(tenant: TenantDocument, userId: string): Promise<{
        hasCard: boolean;
        status: MembershipStatus.PENDING | MembershipStatus.REJECTED | MembershipStatus.EXPIRED;
        message: string;
        membership: import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        membershipNumber?: undefined;
        designation?: undefined;
        plan?: undefined;
        cardUrl?: undefined;
        downloadUrl?: undefined;
        verificationUrl?: undefined;
        shareData?: undefined;
        approvedAt?: undefined;
        expiresAt?: undefined;
        member?: undefined;
    } | {
        hasCard: boolean;
        status: MembershipStatus.APPROVED;
        membershipNumber: string | undefined;
        designation: string | undefined;
        plan: Types.ObjectId | null;
        cardUrl: string;
        downloadUrl: string;
        verificationUrl: string;
        shareData: {
            title: string;
            text: string;
            url: string;
            whatsappUrl: string;
        };
        approvedAt: Date | undefined;
        expiresAt: Date | undefined;
        member: Types.ObjectId;
        message?: undefined;
        membership?: undefined;
    }>;
    findAll(tenant: TenantDocument, filters: QueryMembershipDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approve(tenant: TenantDocument, id: string, approvedBy: string, dto?: ApproveMembershipDto): Promise<(import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reject(tenant: TenantDocument, id: string, reason: string): Promise<import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    regenerateCard(tenant: TenantDocument, id: string, dto?: RegenerateCardDto): Promise<import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateCardDetails(tenant: TenantDocument, id: string, dto: UpdateMembershipCardDetailsDto): Promise<(import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    verifyCard(tenant: TenantDocument, membershipNumber: string): Promise<{
        valid: boolean;
        status: string;
        message: string;
        membershipNumber: string;
        expiredAt?: undefined;
        member?: undefined;
        tenant?: undefined;
        cardUrl?: undefined;
        issueDate?: undefined;
        expiryDate?: undefined;
        verifiedAt?: undefined;
    } | {
        valid: boolean;
        status: string;
        message: string;
        membershipNumber: string;
        expiredAt: Date;
        member?: undefined;
        tenant?: undefined;
        cardUrl?: undefined;
        issueDate?: undefined;
        expiryDate?: undefined;
        verifiedAt?: undefined;
    } | {
        valid: boolean;
        status: string;
        message: string;
        membershipNumber: string | undefined;
        member: {
            name: any;
            mobile: string;
            area: string;
            designation: string;
            photoUrl: any;
            plan: any;
        };
        tenant: {
            name: string;
            slug: string;
            leaderName: string | null;
            logoUrl: string | null;
        };
        cardUrl: string | undefined;
        issueDate: any;
        expiryDate: Date | null;
        verifiedAt: Date;
        expiredAt?: undefined;
    }>;
    getCardFilePath(tenant: TenantDocument, membershipNumberOrId: string): Promise<string>;
    getStats(tenant: TenantDocument): Promise<Record<string, any>>;
    exportMembers(tenant: TenantDocument, filters: QueryMembershipDto, res: Response, adminUser?: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
}

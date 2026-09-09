import { Response } from 'express';
import { MembershipService } from './membership.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { ApplyMembershipDto, ApproveMembershipDto, RejectMembershipDto, RegenerateCardDto, UpdateMembershipCardDetailsDto, QueryMembershipDto } from './membership.dto';
export declare class MembershipController {
    private membershipService;
    constructor(membershipService: MembershipService);
    apply(req: TenantRequest & {
        user: any;
    }, dto: ApplyMembershipDto): Promise<import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyMembership(req: TenantRequest & {
        user: any;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyCard(req: TenantRequest & {
        user: any;
    }): Promise<{
        hasCard: boolean;
        status: import("../../shared/types").MembershipStatus.PENDING | import("../../shared/types").MembershipStatus.REJECTED | import("../../shared/types").MembershipStatus.EXPIRED;
        message: string;
        membership: import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        membershipNumber?: undefined;
        designation?: undefined;
        cardUrl?: undefined;
        downloadUrl?: undefined;
        verificationUrl?: undefined;
        approvedAt?: undefined;
        expiresAt?: undefined;
        member?: undefined;
    } | {
        hasCard: boolean;
        status: import("../../shared/types").MembershipStatus.APPROVED;
        membershipNumber: string | undefined;
        designation: string | undefined;
        cardUrl: string;
        downloadUrl: string;
        verificationUrl: string | undefined;
        approvedAt: Date | undefined;
        expiresAt: Date | undefined;
        member: import("mongoose").Types.ObjectId;
        message?: undefined;
        membership?: undefined;
    }>;
    downloadMyCard(req: TenantRequest & {
        user: any;
    }, res: Response): Promise<void>;
    verifyCard(req: TenantRequest, membershipNumber: string): Promise<{
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
    getStats(req: TenantRequest): Promise<Record<string, number>>;
    findAll(req: TenantRequest, query: QueryMembershipDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    downloadMemberCard(req: TenantRequest, id: string, res: Response): Promise<void>;
    approve(req: TenantRequest & {
        user: any;
    }, id: string, dto: ApproveMembershipDto): Promise<(import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reject(req: TenantRequest, id: string, dto: RejectMembershipDto): Promise<import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    regenerateCard(req: TenantRequest, id: string, dto: RegenerateCardDto): Promise<import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateCardDetails(req: TenantRequest, id: string, dto: UpdateMembershipCardDetailsDto): Promise<(import("mongoose").Document<unknown, {}, import("./membership.schema").MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

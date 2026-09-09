import { Model, Types } from 'mongoose';
import { Membership, MembershipDocument } from './membership.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { UserDocument } from '../users/user.schema';
import { AreaDocument } from '../areas/area.schema';
import { MembershipStatus } from '../../shared/types';
import { ApplyMembershipDto, ApproveMembershipDto, QueryMembershipDto, RegenerateCardDto, UpdateMembershipCardDetailsDto } from './membership.dto';
export declare class MembershipService {
    private membershipModel;
    private userModel;
    private areaModel;
    constructor(membershipModel: Model<MembershipDocument>, userModel: Model<UserDocument>, areaModel: Model<AreaDocument>);
    private generateMemberNumber;
    private formatDate;
    private drawRoundedRect;
    generateDigitalCard(tenant: TenantDocument, membership: MembershipDocument, userDoc?: any): Promise<{
        cardUrl: string;
        filePath: string;
    }>;
    apply(tenant: TenantDocument, userId: string, dto?: ApplyMembershipDto): Promise<import("mongoose").Document<unknown, {}, MembershipDocument, {}, import("mongoose").DefaultSchemaOptions> & Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
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
        cardUrl?: undefined;
        downloadUrl?: undefined;
        verificationUrl?: undefined;
        approvedAt?: undefined;
        expiresAt?: undefined;
        member?: undefined;
    } | {
        hasCard: boolean;
        status: MembershipStatus.APPROVED;
        membershipNumber: string | undefined;
        designation: string | undefined;
        cardUrl: string;
        downloadUrl: string;
        verificationUrl: string | undefined;
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
    getStats(tenant: TenantDocument): Promise<Record<string, number>>;
}

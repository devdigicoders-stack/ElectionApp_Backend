import { Model, Types } from 'mongoose';
import { Poll, PollDocument, PollVoteDocument } from './poll.schema';
import { UserDocument } from '../users/user.schema';
import { AreaDocument } from '../areas/area.schema';
import { MembershipDocument } from '../membership/membership.schema';
import { VolunteerDocument } from '../volunteers/volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PollTargetAudience, PollResultVisibility } from '../../shared/types';
import { CreatePollDto, UpdatePollDto, QueryPollsDto } from './polls.dto';
import { Response } from 'express';
export declare class PollsService {
    private pollModel;
    private voteModel;
    private userModel;
    private areaModel;
    private membershipModel;
    private volunteerModel;
    private auditLogsService?;
    private readonly logger;
    constructor(pollModel: Model<PollDocument>, voteModel: Model<PollVoteDocument>, userModel: Model<UserDocument>, areaModel: Model<AreaDocument>, membershipModel: Model<MembershipDocument>, volunteerModel: Model<VolunteerDocument>, auditLogsService?: AuditLogsService | undefined);
    seedDefaultPollsIfEmpty(tenant: TenantDocument): Promise<void>;
    create(tenant: TenantDocument, dto: CreatePollDto): Promise<import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, queryDto: QueryPollsDto, user?: any, isAdmin?: boolean): Promise<{
        items: {
            _id: Types.ObjectId;
            question: string;
            description: string | undefined;
            category: string | undefined;
            options: ({
                optionId: string;
                text: string;
                votes: number;
                percentage: number;
            } | {
                optionId: string;
                text: string;
                votes?: undefined;
                percentage?: undefined;
            })[];
            totalVotes: number | undefined;
            targetAudience: PollTargetAudience;
            targetArea: Types.ObjectId | undefined;
            startsAt: Date | undefined;
            endsAt: Date | undefined;
            isActive: boolean;
            isEnded: boolean;
            allowRevote: boolean;
            resultVisibility: PollResultVisibility;
            hasVoted: boolean;
            myOptionId: string | null;
            canViewResults: boolean;
            createdAt: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(tenant: TenantDocument, id: string, user?: any, isAdmin?: boolean): Promise<{
        _id: Types.ObjectId;
        question: string;
        description: string | undefined;
        category: string | undefined;
        options: ({
            optionId: string;
            text: string;
            votes: number;
            percentage: number;
        } | {
            optionId: string;
            text: string;
            votes?: undefined;
            percentage?: undefined;
        })[];
        totalVotes: number | undefined;
        targetAudience: PollTargetAudience;
        targetArea: Types.ObjectId | undefined;
        targetGender: string | undefined;
        targetMinAge: number | undefined;
        targetMaxAge: number | undefined;
        startsAt: Date | undefined;
        endsAt: Date | undefined;
        isActive: boolean;
        isEnded: boolean;
        allowRevote: boolean;
        resultVisibility: PollResultVisibility;
        hasVoted: boolean;
        myOptionId: string | null;
        votedAt: Date | null;
        canViewResults: boolean;
        createdAt: any;
        updatedAt: any;
    }>;
    vote(tenant: TenantDocument, pollId: string, userId: string, optionId: string): Promise<{
        message: string;
        hasVoted: boolean;
        optionId: string;
        totalVotes: number;
    } | {
        message: string;
        hasVoted: boolean;
        optionId: string;
        totalVotes?: undefined;
    }>;
    getUserVote(tenant: TenantDocument, pollId: string, userId: string): Promise<{
        hasVoted: boolean;
        optionId: null;
        votedAt?: undefined;
    } | {
        hasVoted: boolean;
        optionId: string;
        votedAt: Date | undefined;
    }>;
    getAnalytics(tenant: TenantDocument, pollId: string): Promise<{
        poll: {
            _id: Types.ObjectId;
            question: string;
            category: string | undefined;
            targetAudience: PollTargetAudience;
            targetArea: Types.ObjectId | undefined;
            startsAt: Date | undefined;
            endsAt: Date | undefined;
            isActive: boolean;
        };
        summary: {
            totalVotes: number;
            totalEligibleUsers: number;
            participationRate: number;
        };
        options: {
            optionId: string;
            text: string;
            votes: number;
            percentage: number;
        }[];
        areaBreakdown: {
            areaId: any;
            areaName: string;
            votes: any;
            percentage: number;
        }[];
        genderBreakdown: {
            gender: any;
            votes: any;
            percentage: number;
        }[];
        ageGroupBreakdown: {
            group: string;
            votes: any;
            percentage: number;
        }[];
        timeline: {
            date: any;
            votes: any;
        }[];
    }>;
    exportPollCsv(tenant: TenantDocument, pollId: string, res: Response, format?: string, adminUser?: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
    update(tenant: TenantDocument, id: string, dto: UpdatePollDto): Promise<import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<{
        message: string;
    }>;
}

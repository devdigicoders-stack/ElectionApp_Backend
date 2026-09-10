import { PollsService } from './polls.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { CreatePollDto, UpdatePollDto, VotePollDto, QueryPollsDto } from './polls.dto';
import { Response } from 'express';
export declare class PollsController {
    private pollsService;
    constructor(pollsService: PollsService);
    private extractOptionalUser;
    findAll(req: TenantRequest, query: QueryPollsDto): Promise<{
        items: {
            _id: import("mongoose").Types.ObjectId;
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
            targetAudience: import("../../shared/types").PollTargetAudience;
            targetArea: import("mongoose").Types.ObjectId | undefined;
            startsAt: Date | undefined;
            endsAt: Date | undefined;
            isActive: boolean;
            isEnded: boolean;
            allowRevote: boolean;
            resultVisibility: import("../../shared/types").PollResultVisibility;
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
    findOne(req: TenantRequest, id: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
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
        targetAudience: import("../../shared/types").PollTargetAudience;
        targetArea: import("mongoose").Types.ObjectId | undefined;
        targetGender: string | undefined;
        targetMinAge: number | undefined;
        targetMaxAge: number | undefined;
        startsAt: Date | undefined;
        endsAt: Date | undefined;
        isActive: boolean;
        isEnded: boolean;
        allowRevote: boolean;
        resultVisibility: import("../../shared/types").PollResultVisibility;
        hasVoted: boolean;
        myOptionId: string | null;
        votedAt: Date | null;
        canViewResults: boolean;
        createdAt: any;
        updatedAt: any;
    }>;
    vote(req: TenantRequest & {
        user: any;
    }, id: string, dto: VotePollDto): Promise<{
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
    getMyVote(req: TenantRequest & {
        user: any;
    }, id: string): Promise<{
        hasVoted: boolean;
        optionId: null;
        votedAt?: undefined;
    } | {
        hasVoted: boolean;
        optionId: string;
        votedAt: Date | undefined;
    }>;
    create(req: TenantRequest, dto: CreatePollDto): Promise<import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAnalytics(req: TenantRequest, id: string): Promise<{
        poll: {
            _id: import("mongoose").Types.ObjectId;
            question: string;
            category: string | undefined;
            targetAudience: import("../../shared/types").PollTargetAudience;
            targetArea: import("mongoose").Types.ObjectId | undefined;
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
    exportCsv(req: TenantRequest & {
        user?: any;
    }, id: string, res: Response, format?: string, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
    update(req: TenantRequest, id: string, dto: UpdatePollDto): Promise<import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<{
        message: string;
    }>;
}

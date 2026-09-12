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
                optionId: any;
                text: any;
                votes: any;
                percentage: number;
            } | {
                optionId: any;
                text: any;
                votes?: undefined;
                percentage?: undefined;
            })[];
            winnerOption: any;
            totalVotes: number | undefined;
            targetAudience: import("../../shared/types").PollTargetAudience;
            targetArea: import("mongoose").Types.ObjectId | undefined;
            startsAt: Date | undefined;
            endsAt: Date | undefined;
            durationHours: number | undefined;
            isActive: boolean;
            status: import("../../shared/types").PollStatus;
            isOpenForVoting: boolean;
            isEnded: boolean;
            isUpcoming: boolean;
            allowRevote: boolean;
            allowMultipleChoices: boolean;
            maxChoices: number;
            resultVisibility: import("../../shared/types").PollResultVisibility;
            resultDeclaredAt: Date | null;
            isResultDeclared: boolean;
            resultStatus: "ADMIN_ONLY" | "PENDING" | "DECLARED" | "SCHEDULED";
            resultMessage: string;
            hasVoted: boolean;
            myOptionId: string | null;
            myOptionIds: string[];
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
            optionId: any;
            text: any;
            votes: any;
            percentage: number;
        } | {
            optionId: any;
            text: any;
            votes?: undefined;
            percentage?: undefined;
        })[];
        winnerOption: any;
        totalVotes: number | undefined;
        targetAudience: import("../../shared/types").PollTargetAudience;
        targetArea: import("mongoose").Types.ObjectId | undefined;
        targetGender: string | undefined;
        targetMinAge: number | undefined;
        targetMaxAge: number | undefined;
        startsAt: Date | undefined;
        endsAt: Date | undefined;
        durationHours: number | undefined;
        isActive: boolean;
        status: import("../../shared/types").PollStatus;
        isOpenForVoting: boolean;
        isEnded: boolean;
        isUpcoming: boolean;
        allowRevote: boolean;
        allowMultipleChoices: boolean;
        maxChoices: number;
        resultVisibility: import("../../shared/types").PollResultVisibility;
        resultDeclaredAt: Date | null;
        isResultDeclared: boolean;
        resultStatus: "ADMIN_ONLY" | "PENDING" | "DECLARED" | "SCHEDULED";
        resultMessage: string;
        hasVoted: boolean;
        myOptionId: string | null;
        myOptionIds: string[];
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
        optionIds: string[];
        status: import("../../shared/types").PollStatus;
        isResultDeclared: boolean;
        resultDeclaredAt: Date | null;
        resultStatus: "ADMIN_ONLY" | "PENDING" | "DECLARED" | "SCHEDULED";
        resultMessage: string;
        totalVotes: number | undefined;
    }>;
    getMyVote(req: TenantRequest & {
        user: any;
    }, id: string): Promise<{
        hasVoted: boolean;
        optionId: null;
        optionIds: never[];
        votedAt?: undefined;
    } | {
        hasVoted: boolean;
        optionId: string | null;
        optionIds: string[];
        votedAt: Date | undefined;
    }>;
    create(req: TenantRequest, dto: CreatePollDto): Promise<{
        status: import("../../shared/types").PollStatus;
        isOpenForVoting: boolean;
        isEnded: boolean;
        isUpcoming: boolean;
        isResultDeclared: boolean;
        resultStatus: "ADMIN_ONLY" | "PENDING" | "DECLARED" | "SCHEDULED";
        resultMessage: string;
        tenantId: import("mongoose").Types.ObjectId;
        question: string;
        description?: string;
        category?: string;
        options: {
            optionId: string;
            text: string;
            votes: number;
        }[];
        targetAreaId?: import("mongoose").Types.ObjectId;
        targetAudience: import("../../shared/types").PollTargetAudience;
        targetGender?: string;
        targetMinAge?: number;
        targetMaxAge?: number;
        resultVisibility: import("../../shared/types").PollResultVisibility;
        allowRevote: boolean;
        allowMultipleChoices: boolean;
        maxChoices: number;
        isActive: boolean;
        startsAt?: Date;
        endsAt?: Date;
        durationHours?: number;
        resultDeclaredAt?: Date;
        totalVotes: number;
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
    update(req: TenantRequest, id: string, dto: UpdatePollDto): Promise<{
        status: import("../../shared/types").PollStatus;
        isOpenForVoting: boolean;
        isEnded: boolean;
        isUpcoming: boolean;
        isResultDeclared: boolean;
        resultStatus: "ADMIN_ONLY" | "PENDING" | "DECLARED" | "SCHEDULED";
        resultMessage: string;
        tenantId: import("mongoose").Types.ObjectId;
        question: string;
        description?: string;
        category?: string;
        options: {
            optionId: string;
            text: string;
            votes: number;
        }[];
        targetAreaId?: import("mongoose").Types.ObjectId;
        targetAudience: import("../../shared/types").PollTargetAudience;
        targetGender?: string;
        targetMinAge?: number;
        targetMaxAge?: number;
        resultVisibility: import("../../shared/types").PollResultVisibility;
        allowRevote: boolean;
        allowMultipleChoices: boolean;
        maxChoices: number;
        isActive: boolean;
        startsAt?: Date;
        endsAt?: Date;
        durationHours?: number;
        resultDeclaredAt?: Date;
        totalVotes: number;
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
    }>;
    declareResult(req: TenantRequest, id: string): Promise<{
        message: string;
        pollId: import("mongoose").Types.ObjectId;
        isResultDeclared: boolean;
        resultDeclaredAt: Date;
        resultVisibility: import("../../shared/types").PollResultVisibility.ALWAYS_PUBLIC;
        resultStatus: "ADMIN_ONLY" | "PENDING" | "DECLARED" | "SCHEDULED";
        totalVotes: number;
        options: {
            optionId: string;
            text: string;
            votes: number;
        }[];
    }>;
    closePoll(req: TenantRequest, id: string): Promise<{
        message: string;
        pollId: import("mongoose").Types.ObjectId;
        status: import("../../shared/types").PollStatus;
        isActive: boolean;
        endsAt: Date;
        isResultDeclared: boolean;
        resultDeclaredAt: Date | null;
    }>;
    remove(req: TenantRequest, id: string): Promise<{
        message: string;
    }>;
}

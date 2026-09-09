import { Model, Types } from 'mongoose';
import { Poll, PollDocument, PollVote, PollVoteDocument } from './poll.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class PollsService {
    private pollModel;
    private voteModel;
    constructor(pollModel: Model<PollDocument>, voteModel: Model<PollVoteDocument>);
    create(tenant: TenantDocument, data: {
        question: string;
        options: string[];
        targetAreaId?: string;
        endsAt?: Date;
    }): Promise<import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, userAreaId?: string): Promise<(import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    vote(tenant: TenantDocument, pollId: string, userId: string, optionId: string): Promise<{
        message: string;
    }>;
    getUserVote(pollId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, PollVoteDocument, {}, import("mongoose").DefaultSchemaOptions> & PollVote & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(tenant: TenantDocument, id: string, data: any): Promise<(import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, PollDocument, {}, import("mongoose").DefaultSchemaOptions> & Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

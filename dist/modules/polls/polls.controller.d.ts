import { PollsService } from './polls.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class PollsController {
    private pollsService;
    constructor(pollsService: PollsService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest & {
        user?: any;
    }, areaId?: string): Promise<(import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    vote(req: TenantRequest & {
        user: any;
    }, id: string, optionId: string): Promise<{
        message: string;
    }>;
    getMyVote(req: any, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./poll.schema").PollVoteDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").PollVote & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(req: TenantRequest, id: string, body: any): Promise<(import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./poll.schema").PollDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

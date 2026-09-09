import { AboutLeaderService } from './about-leader.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class AboutLeaderController {
    private aboutLeaderService;
    constructor(aboutLeaderService: AboutLeaderService);
    get(req: TenantRequest): Promise<(import("mongoose").Document<unknown, {}, import("./about-leader.schema").AboutLeaderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./about-leader.schema").AboutLeader & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    upsert(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./about-leader.schema").AboutLeaderDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./about-leader.schema").AboutLeader & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

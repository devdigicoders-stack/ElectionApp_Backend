import { Model } from 'mongoose';
import { AboutLeader, AboutLeaderDocument } from './about-leader.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class AboutLeaderService {
    private aboutModel;
    constructor(aboutModel: Model<AboutLeaderDocument>);
    get(tenant: TenantDocument): Promise<(import("mongoose").Document<unknown, {}, AboutLeaderDocument, {}, import("mongoose").DefaultSchemaOptions> & AboutLeader & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    upsert(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, AboutLeaderDocument, {}, import("mongoose").DefaultSchemaOptions> & AboutLeader & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

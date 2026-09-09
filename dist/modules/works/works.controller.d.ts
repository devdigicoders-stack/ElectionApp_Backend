import { WorksService } from './works.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { WorkStatus } from '../../shared/types';
export declare class WorksController {
    private worksService;
    constructor(worksService: WorksService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./work.schema").WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, status?: WorkStatus, areaId?: string, category?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./work.schema").WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStats(req: TenantRequest): Promise<any[]>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./work.schema").WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./work.schema").WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./work.schema").WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

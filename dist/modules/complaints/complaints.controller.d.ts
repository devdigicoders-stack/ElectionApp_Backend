import { ComplaintsService } from './complaints.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { ComplaintStatus } from '../../shared/types';
export declare class ComplaintsController {
    private complaintsService;
    constructor(complaintsService: ComplaintsService);
    create(req: TenantRequest & {
        user: any;
    }, body: any): Promise<import("mongoose").Document<unknown, {}, import("./complaint.schema").ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, status?: string, areaId?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./complaint.schema").ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findMine(req: TenantRequest & {
        user: any;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./complaint.schema").ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getStats(req: TenantRequest): Promise<any>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./complaint.schema").ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateStatus(req: TenantRequest & {
        user: any;
    }, id: string, body: {
        status: ComplaintStatus;
        note?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./complaint.schema").ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

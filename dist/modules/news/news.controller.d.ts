import { NewsService } from './news.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { CreateNewsDto, UpdateNewsDto, UpdateNewsStatusDto, QueryNewsDto } from './news.dto';
export declare class NewsController {
    private newsService;
    constructor(newsService: NewsService);
    create(req: TenantRequest & {
        user: any;
    }, dto: CreateNewsDto): Promise<import("mongoose").Document<unknown, {}, import("./news.schema").NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllPublished(req: TenantRequest, query: QueryNewsDto): Promise<{
        data: (import("./news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllAdmin(req: TenantRequest, query: QueryNewsDto): Promise<{
        data: (import("./news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCategories(req: TenantRequest): Promise<{
        category: any;
        count: any;
    }[]>;
    getStats(req: TenantRequest): Promise<{
        total: number;
        published: number;
        draft: number;
        scheduled: number;
        archived: number;
        totalViews: number;
    }>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./news.schema").NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: TenantRequest, id: string, dto: UpdateNewsDto): Promise<import("mongoose").Document<unknown, {}, import("./news.schema").NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateStatus(req: TenantRequest, id: string, dto: UpdateNewsStatusDto): Promise<import("mongoose").Document<unknown, {}, import("./news.schema").NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

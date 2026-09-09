import { Model, Types } from 'mongoose';
import { News, NewsDocument } from './news.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { CreateNewsDto, UpdateNewsDto, UpdateNewsStatusDto, QueryNewsDto } from './news.dto';
export declare class NewsService {
    private newsModel;
    constructor(newsModel: Model<NewsDocument>);
    private generateSlug;
    create(tenant: TenantDocument, dto: CreateNewsDto, user?: any): Promise<import("mongoose").Document<unknown, {}, NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllPublished(tenant: TenantDocument, query: QueryNewsDto): Promise<{
        data: (News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    findAllAdmin(tenant: TenantDocument, query: QueryNewsDto): Promise<{
        data: (News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    findOne(tenant: TenantDocument, idOrSlug: string, isPublic?: boolean): Promise<import("mongoose").Document<unknown, {}, NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getCategories(tenant: TenantDocument): Promise<{
        category: any;
        count: any;
    }[]>;
    getStats(tenant: TenantDocument): Promise<{
        total: number;
        published: number;
        draft: number;
        scheduled: number;
        archived: number;
        totalViews: number;
    }>;
    update(tenant: TenantDocument, id: string, dto: UpdateNewsDto): Promise<import("mongoose").Document<unknown, {}, NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateStatus(tenant: TenantDocument, id: string, dto: UpdateNewsStatusDto): Promise<import("mongoose").Document<unknown, {}, NewsDocument, {}, import("mongoose").DefaultSchemaOptions> & News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

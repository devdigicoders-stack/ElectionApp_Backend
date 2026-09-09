import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banner.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class BannersService {
    private bannerModel;
    constructor(bannerModel: Model<BannerDocument>);
    create(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findActive(tenant: TenantDocument): Promise<(import("mongoose").Document<unknown, {}, BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(tenant: TenantDocument): Promise<(import("mongoose").Document<unknown, {}, BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    reorder(tenant: TenantDocument, orders: {
        id: string;
        sortOrder: number;
    }[]): Promise<{
        message: string;
    }>;
}

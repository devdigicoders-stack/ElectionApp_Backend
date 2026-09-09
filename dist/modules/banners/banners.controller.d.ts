import { BannersService } from './banners.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class BannersController {
    private bannersService;
    constructor(bannersService: BannersService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./banner.schema").BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findActive(req: TenantRequest): Promise<(import("mongoose").Document<unknown, {}, import("./banner.schema").BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(req: TenantRequest): Promise<(import("mongoose").Document<unknown, {}, import("./banner.schema").BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    reorder(req: TenantRequest, body: {
        orders: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<{
        message: string;
    }>;
    update(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./banner.schema").BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./banner.schema").BannerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

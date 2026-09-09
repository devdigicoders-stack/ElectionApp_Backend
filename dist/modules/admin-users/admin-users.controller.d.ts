import { AdminUsersService } from './admin-users.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class AdminUsersController {
    private adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./admin-user.schema").AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest): Promise<(import("mongoose").Document<unknown, {}, import("./admin-user.schema").AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./admin-user.schema").AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./admin-user.schema").AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./admin-user.schema").AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

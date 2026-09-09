import { UsersService } from './users.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    updateProfile(req: TenantRequest & {
        user: any;
    }, body: any): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, areaId?: string, search?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getStats(req: TenantRequest): Promise<{
        total: number;
        active: number;
        profileComplete: number;
    }>;
    getAreaCount(req: TenantRequest): Promise<any[]>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    toggleActive(req: TenantRequest, id: string, isActive: boolean): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

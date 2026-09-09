import { Model } from 'mongoose';
import { AdminUser, AdminUserDocument } from './admin-user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { UserRole } from '../../shared/types';
export declare class AdminUsersService {
    private adminUserModel;
    constructor(adminUserModel: Model<AdminUserDocument>);
    create(tenant: TenantDocument, data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        assignedAreaId?: string;
    }): Promise<import("mongoose").Document<unknown, {}, AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument): Promise<(import("mongoose").Document<unknown, {}, AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, AdminUserDocument, {}, import("mongoose").DefaultSchemaOptions> & AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createStaff(dto: any): Promise<any>;
    findAllStaff(query: any): Promise<{
        items: (AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOneStaff(id: string): Promise<AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStaff(id: string, dto: any): Promise<AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggleStaffStatus(id: string, requesterId?: string): Promise<AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    resetStaffPassword(id: string, newPassword: string): Promise<{
        message: string;
    }>;
    removeStaff(id: string, requesterId?: string): Promise<{
        message: string;
    }>;
}

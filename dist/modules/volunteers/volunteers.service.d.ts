import { Model, Types } from 'mongoose';
import { Volunteer, VolunteerDocument } from './volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { VolunteerStatus } from '../../shared/types';
export declare class VolunteersService {
    private volunteerModel;
    constructor(volunteerModel: Model<VolunteerDocument>);
    add(tenant: TenantDocument, data: {
        userId?: string;
        role?: string;
        assignedAreaId?: string;
        areaId?: string;
        tasks?: string[];
        notes?: string;
        skills?: string[];
        interests?: string[];
    }, callerUserId: string): Promise<import("mongoose").Document<unknown, {}, VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, filters: {
        areaId?: string;
        status?: VolunteerStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByUser(tenant: TenantDocument, userId: string): Promise<(import("mongoose").Document<unknown, {}, VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

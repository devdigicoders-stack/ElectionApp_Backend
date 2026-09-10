import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { Volunteer, VolunteerDocument } from './volunteer.schema';
import { VolunteerTaskDocument } from './volunteer-task.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { VolunteerStatus } from '../../shared/types';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class VolunteersService {
    private volunteerModel;
    private taskModel;
    private auditLogsService?;
    constructor(volunteerModel: Model<VolunteerDocument>, taskModel: Model<VolunteerTaskDocument>, auditLogsService?: AuditLogsService | undefined);
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
    exportVolunteers(tenant: TenantDocument, query: {
        status?: VolunteerStatus;
        areaId?: string;
        role?: string;
        search?: string;
        format?: string;
    }, res: Response, format?: string, adminUser?: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
}

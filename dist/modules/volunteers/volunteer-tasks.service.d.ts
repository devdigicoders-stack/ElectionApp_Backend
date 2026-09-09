import { Model, Types } from 'mongoose';
import { VolunteerTask, VolunteerTaskDocument } from './volunteer-task.schema';
import { VolunteerDocument } from './volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { VolunteerTaskStatus } from '../../shared/types';
import { CreateVolunteerTaskDto, UpdateVolunteerTaskDto, SubmitVolunteerTaskDto, ReviewVolunteerTaskDto, QueryVolunteerTaskDto } from './volunteer-task.dto';
export declare class VolunteerTasksService {
    private taskModel;
    private volunteerModel;
    constructor(taskModel: Model<VolunteerTaskDocument>, volunteerModel: Model<VolunteerDocument>);
    create(tenant: TenantDocument, dto: CreateVolunteerTaskDto, adminUser: any): Promise<import("mongoose").Document<unknown, {}, VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, query: QueryVolunteerTaskDto): Promise<{
        data: (VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findMyTasks(tenant: TenantDocument, userId: string, query?: {
        status?: VolunteerTaskStatus;
    }): Promise<(VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenant: TenantDocument, id: string, dto: UpdateVolunteerTaskDto): Promise<import("mongoose").Document<unknown, {}, VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    acceptTask(tenant: TenantDocument, id: string, user: any): Promise<{
        success: boolean;
        message: string;
        task: import("mongoose").Document<unknown, {}, VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    submitTask(tenant: TenantDocument, id: string, dto: SubmitVolunteerTaskDto, user: any): Promise<{
        success: boolean;
        message: string;
        task: import("mongoose").Document<unknown, {}, VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    reviewTask(tenant: TenantDocument, id: string, dto: ReviewVolunteerTaskDto, adminUser: any): Promise<{
        success: boolean;
        message: string;
        task: import("mongoose").Document<unknown, {}, VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & VolunteerTask & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getStats(tenant: TenantDocument): Promise<{
        totalTasks: number;
        pending: number;
        accepted: number;
        inProgress: number;
        completed: number;
        rejected: number;
        overdueTasks: number;
        byPriority: {
            low: number;
            medium: number;
            high: number;
            urgent: number;
        };
    }>;
    remove(tenant: TenantDocument, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

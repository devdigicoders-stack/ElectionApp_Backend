import { VolunteerTasksService } from './volunteer-tasks.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { CreateVolunteerTaskDto, UpdateVolunteerTaskDto, SubmitVolunteerTaskDto, ReviewVolunteerTaskDto, QueryVolunteerTaskDto } from './volunteer-task.dto';
import { VolunteerTaskStatus } from '../../shared/types';
export declare class VolunteerTasksController {
    private tasksService;
    constructor(tasksService: VolunteerTasksService);
    create(req: TenantRequest & {
        user: any;
    }, dto: CreateVolunteerTaskDto): Promise<import("mongoose").Document<unknown, {}, import("./volunteer-task.schema").VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, query: QueryVolunteerTaskDto): Promise<{
        data: (import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findMyTasks(req: TenantRequest & {
        user: any;
    }, status?: VolunteerTaskStatus): Promise<(import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getStats(req: TenantRequest): Promise<{
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
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./volunteer-task.schema").VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: TenantRequest, id: string, dto: UpdateVolunteerTaskDto): Promise<import("mongoose").Document<unknown, {}, import("./volunteer-task.schema").VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    acceptTask(req: TenantRequest & {
        user: any;
    }, id: string): Promise<{
        success: boolean;
        message: string;
        task: import("mongoose").Document<unknown, {}, import("./volunteer-task.schema").VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    submitTask(req: TenantRequest & {
        user: any;
    }, id: string, dto: SubmitVolunteerTaskDto): Promise<{
        success: boolean;
        message: string;
        task: import("mongoose").Document<unknown, {}, import("./volunteer-task.schema").VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    reviewTask(req: TenantRequest & {
        user: any;
    }, id: string, dto: ReviewVolunteerTaskDto): Promise<{
        success: boolean;
        message: string;
        task: import("mongoose").Document<unknown, {}, import("./volunteer-task.schema").VolunteerTaskDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer-task.schema").VolunteerTask & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(req: TenantRequest, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

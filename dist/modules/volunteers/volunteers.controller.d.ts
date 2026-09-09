import { VolunteersService } from './volunteers.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { VolunteerStatus } from '../../shared/types';
export declare class VolunteersController {
    private volunteersService;
    constructor(volunteersService: VolunteersService);
    add(req: TenantRequest & {
        user: any;
    }, body: any): Promise<import("mongoose").Document<unknown, {}, import("./volunteer.schema").VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, areaId?: string, status?: VolunteerStatus, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./volunteer.schema").VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getMyProfile(req: TenantRequest & {
        user: any;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./volunteer.schema").VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./volunteer.schema").VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./volunteer.schema").VolunteerDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

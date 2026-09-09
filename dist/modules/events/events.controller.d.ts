import { EventsService } from './events.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { EventRsvpStatus } from '../../shared/types';
export declare class EventsController {
    private eventsService;
    constructor(eventsService: EventsService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, upcoming?: string, areaId?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    rsvp(req: TenantRequest & {
        user: any;
    }, id: string, status: EventRsvpStatus): Promise<{
        message: string;
        status: EventRsvpStatus;
    }>;
    getMyRsvp(req: any, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./event-rsvp.schema").EventRsvpDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event-rsvp.schema").EventRsvp & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

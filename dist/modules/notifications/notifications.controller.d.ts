import { NotificationsService } from './notifications.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    send(req: TenantRequest, id: string): Promise<{
        message: string;
        recipientCount: number;
    }>;
    findAll(req: TenantRequest, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getMyNotifications(req: TenantRequest & {
        user: any;
    }, page?: number, limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationReadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./notification.schema").NotificationRead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getUnreadCount(req: any): Promise<number>;
    markRead(req: any, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationReadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./notification.schema").NotificationRead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./notification.schema").NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

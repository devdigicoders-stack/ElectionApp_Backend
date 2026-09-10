import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationRead, NotificationReadDocument } from './notification.schema';
import { UserDocument } from '../users/user.schema';
import { MembershipDocument } from '../membership/membership.schema';
import { VolunteerDocument } from '../volunteers/volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class NotificationsService {
    private notificationModel;
    private readModel;
    private userModel;
    private membershipModel;
    private volunteerModel;
    constructor(notificationModel: Model<NotificationDocument>, readModel: Model<NotificationReadDocument>, userModel: Model<UserDocument>, membershipModel: Model<MembershipDocument>, volunteerModel: Model<VolunteerDocument>);
    create(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & Notification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    send(tenant: TenantDocument, id: string): Promise<{
        message: string;
        recipientCount: number;
    }>;
    findAll(tenant: TenantDocument, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & Notification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getForUser(tenant: TenantDocument, userId: string, page?: number, limit?: number): Promise<(import("mongoose").Document<unknown, {}, NotificationReadDocument, {}, import("mongoose").DefaultSchemaOptions> & NotificationRead & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markRead(userId: string, notificationId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationReadDocument, {}, import("mongoose").DefaultSchemaOptions> & NotificationRead & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getUnreadCount(userId: string): Promise<number>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & Notification & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

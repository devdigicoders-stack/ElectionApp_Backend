import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationRead, NotificationReadDocument } from './notification.schema';
import { UserDocument } from '../users/user.schema';
import { MembershipDocument } from '../membership/membership.schema';
import { VolunteerDocument } from '../volunteers/volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { AdminUserDocument } from '../admin-users/admin-user.schema';
import { PlatformBroadcast, PlatformBroadcastDocument } from './platform-broadcast.schema';
import { SystemAlert, SystemAlertDocument, AlertType, AlertCategory } from './system-alert.schema';
import { FirebaseService } from './firebase.service';
export declare class NotificationsService {
    private notificationModel;
    private readModel;
    private userModel;
    private membershipModel;
    private volunteerModel;
    private broadcastModel;
    private alertModel;
    private adminUserModel;
    private tenantModel;
    private readonly firebaseService;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>, readModel: Model<NotificationReadDocument>, userModel: Model<UserDocument>, membershipModel: Model<MembershipDocument>, volunteerModel: Model<VolunteerDocument>, broadcastModel: Model<PlatformBroadcastDocument>, alertModel: Model<SystemAlertDocument>, adminUserModel: Model<AdminUserDocument>, tenantModel: Model<TenantDocument>, firebaseService: FirebaseService);
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
        pushTokensDispatched: number;
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
    remove(tenant: TenantDocument, id: string): Promise<{
        success: boolean;
        message: string;
        deletedId: string;
    }>;
    getSystemInbox(query: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        category?: string;
    }): Promise<{
        data: (SystemAlert & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            unreadCount: number;
        };
    }>;
    markAlertRead(alertId: string): Promise<import("mongoose").Document<unknown, {}, SystemAlertDocument, {}, import("mongoose").DefaultSchemaOptions> & SystemAlert & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    markAllAlertsRead(): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteAlert(alertId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    recordSystemAlert(dto: {
        title: string;
        message: string;
        type?: AlertType;
        category?: AlertCategory;
        actionUrl?: string;
        metadata?: Record<string, any>;
    }): Promise<import("mongoose").Document<unknown, {}, SystemAlertDocument, {}, import("mongoose").DefaultSchemaOptions> & SystemAlert & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    private seedDefaultAlertsIfEmpty;
    getBroadcasts(page?: number, limit?: number): Promise<{
        data: (PlatformBroadcast & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    sendPlatformBroadcast(dto: any, adminUser: any): Promise<{
        success: boolean;
        message: string;
        broadcast: import("mongoose").Document<unknown, {}, PlatformBroadcastDocument, {}, import("mongoose").DefaultSchemaOptions> & PlatformBroadcast & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        recipientCount: number;
        pushStats: {
            tokensTargeted: number;
            success: number;
            failure: number;
        };
    }>;
    getTenantPlatformBroadcasts(tenant: TenantDocument, page?: number, limit?: number): Promise<{
        data: (PlatformBroadcast & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    registerFcmToken(userId: string, token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    testFcm(targetToken?: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    } | {
        success: boolean;
        message: string;
    }>;
}

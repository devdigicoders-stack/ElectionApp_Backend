import { Document, Types } from 'mongoose';
import { NotificationTarget } from '../../shared/types';
export type NotificationDocument = Notification & Document;
export type NotificationReadDocument = NotificationRead & Document;
export declare class Notification {
    tenantId: Types.ObjectId;
    title: string;
    body: string;
    imageUrl?: string;
    linkUrl?: string;
    target: NotificationTarget;
    targetAreaId?: Types.ObjectId;
    targetUserIds: Types.ObjectId[];
    isSent: boolean;
    sentAt?: Date;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, any, any, Notification>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, Notification, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    body?: import("mongoose").SchemaDefinitionProperty<string, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    linkUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    target?: import("mongoose").SchemaDefinitionProperty<NotificationTarget, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetAreaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetUserIds?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isSent?: import("mongoose").SchemaDefinitionProperty<boolean, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sentAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Notification>;
export declare class NotificationRead {
    notificationId: Types.ObjectId;
    userId: Types.ObjectId;
    isRead: boolean;
}
export declare const NotificationReadSchema: import("mongoose").Schema<NotificationRead, import("mongoose").Model<NotificationRead, any, any, any, any, any, NotificationRead>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationRead, Document<unknown, {}, NotificationRead, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<NotificationRead & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    notificationId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, NotificationRead, Document<unknown, {}, NotificationRead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<NotificationRead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, NotificationRead, Document<unknown, {}, NotificationRead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<NotificationRead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isRead?: import("mongoose").SchemaDefinitionProperty<boolean, NotificationRead, Document<unknown, {}, NotificationRead, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<NotificationRead & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, NotificationRead>;

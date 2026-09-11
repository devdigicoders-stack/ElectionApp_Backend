import { Document, Types } from 'mongoose';
export type AdminUserDocument = AdminUser & Document;
export declare class AdminUser {
    tenantId?: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    phone?: string;
    permissions: string[];
    assignedAreaId?: Types.ObjectId;
    isActive: boolean;
    isSuperAdmin: boolean;
    fcmTokens: string[];
}
export declare const AdminUserSchema: import("mongoose").Schema<AdminUser, import("mongoose").Model<AdminUser, any, any, any, any, any, AdminUser>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AdminUser, Document<unknown, {}, AdminUser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    passwordHash?: import("mongoose").SchemaDefinitionProperty<string, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<string, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string | undefined, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    permissions?: import("mongoose").SchemaDefinitionProperty<string[], AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedAreaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isSuperAdmin?: import("mongoose").SchemaDefinitionProperty<boolean, AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fcmTokens?: import("mongoose").SchemaDefinitionProperty<string[], AdminUser, Document<unknown, {}, AdminUser, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminUser & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AdminUser>;

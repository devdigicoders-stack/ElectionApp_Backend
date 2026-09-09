import { Document, Types } from 'mongoose';
export type OtpDocument = Otp & Document;
export declare class Otp {
    mobile: string;
    tenantId: Types.ObjectId;
    code: string;
    expiresAt: Date;
    isUsed: boolean;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, any, any, Otp>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, Otp, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Otp & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    mobile?: import("mongoose").SchemaDefinitionProperty<string, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isUsed?: import("mongoose").SchemaDefinitionProperty<boolean, Otp, Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Otp>;

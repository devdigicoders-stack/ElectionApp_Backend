import { Document, Types } from 'mongoose';
import { MembershipStatus } from '../../shared/types';
export type MembershipDocument = Membership & Document;
export declare class Membership {
    tenantId: Types.ObjectId;
    userId: Types.ObjectId;
    status: MembershipStatus;
    membershipNumber?: string;
    designation?: string;
    photoUrl?: string;
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    expiresAt?: Date;
    cardIssuedAt?: Date;
    cardVersion?: number;
    verificationUrl?: string;
    rejectionReason?: string;
    paymentInfo?: {
        amount?: number;
        transactionId?: string;
        paidAt?: Date;
    };
    cardUrl?: string;
    customData?: Record<string, any>;
}
export declare const MembershipSchema: import("mongoose").Schema<Membership, import("mongoose").Model<Membership, any, any, any, any, any, Membership>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Membership, Document<unknown, {}, Membership, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<MembershipStatus, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    membershipNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    designation?: import("mongoose").SchemaDefinitionProperty<string | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    photoUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    approvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    approvedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cardIssuedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cardVersion?: import("mongoose").SchemaDefinitionProperty<number | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    verificationUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rejectionReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentInfo?: import("mongoose").SchemaDefinitionProperty<{
        amount?: number;
        transactionId?: string;
        paidAt?: Date;
    } | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cardUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customData?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, Membership, Document<unknown, {}, Membership, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Membership & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Membership>;

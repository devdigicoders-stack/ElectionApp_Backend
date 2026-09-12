import { Document, Types } from 'mongoose';
import { PaymentStatus, PaymentPurpose } from '../../shared/types';
export type PaymentDocument = Payment & Document;
export declare class Payment {
    tenantId: Types.ObjectId;
    userId: Types.ObjectId;
    receipt: string;
    purpose: PaymentPurpose;
    amount: number;
    amountInPaise: number;
    currency: string;
    status: PaymentStatus;
    gateway: string;
    orderId: string;
    paymentId?: string;
    signature?: string;
    membershipId?: Types.ObjectId;
    membershipPlanId?: Types.ObjectId;
    eventId?: Types.ObjectId;
    paidAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    refundDetails?: {
        refundId?: string;
        amount?: number;
        refundedAt?: Date;
        reason?: string;
    };
    notes?: Record<string, any>;
    rawResponse?: Record<string, any>;
}
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, any, any, Payment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, Payment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    receipt?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    purpose?: import("mongoose").SchemaDefinitionProperty<PaymentPurpose, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amountInPaise?: import("mongoose").SchemaDefinitionProperty<number, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<PaymentStatus, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gateway?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orderId?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    signature?: import("mongoose").SchemaDefinitionProperty<string | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    membershipId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    membershipPlanId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    eventId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paidAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    failedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    failureReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundDetails?: import("mongoose").SchemaDefinitionProperty<{
        refundId?: string;
        amount?: number;
        refundedAt?: Date;
        reason?: string;
    } | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rawResponse?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Payment>;

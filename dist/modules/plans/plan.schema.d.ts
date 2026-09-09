import { Document } from 'mongoose';
export type PlanDocument = Plan & Document;
export declare enum BillingCycle {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly",
    ONE_TIME = "one_time"
}
export declare class PlanLimits {
    maxCitizens: number;
    maxStaffUsers: number;
    maxPostersPerMonth: number;
    maxNotificationsPerMonth: number;
    maxStorageMB: number;
}
export declare class Plan {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    billingCycle: BillingCycle;
    trialDays: number;
    features: string[];
    limits: PlanLimits;
    isPopular: boolean;
    isActive: boolean;
    sortOrder: number;
}
export declare const PlanSchema: import("mongoose").Schema<Plan, import("mongoose").Model<Plan, any, any, any, any, any, Plan>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Plan, Document<unknown, {}, Plan, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    billingCycle?: import("mongoose").SchemaDefinitionProperty<BillingCycle, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    trialDays?: import("mongoose").SchemaDefinitionProperty<number, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    features?: import("mongoose").SchemaDefinitionProperty<string[], Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    limits?: import("mongoose").SchemaDefinitionProperty<PlanLimits, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPopular?: import("mongoose").SchemaDefinitionProperty<boolean, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Plan>;

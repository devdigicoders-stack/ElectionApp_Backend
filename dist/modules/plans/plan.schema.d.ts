import { Document } from 'mongoose';
export type PlanDocument = Plan & Document;
export declare enum BillingCycle {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly",
    ONE_TIME = "one_time"
}
export declare enum SupportLevel {
    COMMUNITY = "community",
    EMAIL_24H = "email_24h",
    PRIORITY_WHATSAPP = "priority_whatsapp",
    DEDICATED_MANAGER = "dedicated_manager"
}
export declare enum TargetSegment {
    GRAM_PANCHAYAT = "gram_panchayat",
    MUNICIPAL_WARD = "municipal_ward",
    VIDHAN_SABHA = "vidhan_sabha",
    LOK_SABHA = "lok_sabha",
    POLITICAL_PARTY = "political_party",
    ALL = "all"
}
export declare class PlanLimits {
    maxCitizens: number;
    maxStaffUsers: number;
    maxPostersPerMonth: number;
    maxNotificationsPerMonth: number;
    maxStorageMB: number;
}
export declare class PlanOverageRates {
    citizenPer1kRate: number;
    storagePerGbRate: number;
    smsRate: number;
    whatsappRate: number;
}
export declare class Plan {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    billingCycle: BillingCycle;
    trialDays: number;
    supportLevel: SupportLevel;
    targetSegment: TargetSegment;
    features: string[];
    limits: PlanLimits;
    overageRates: PlanOverageRates;
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
    supportLevel?: import("mongoose").SchemaDefinitionProperty<SupportLevel, Plan, Document<unknown, {}, Plan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plan & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    targetSegment?: import("mongoose").SchemaDefinitionProperty<TargetSegment, Plan, Document<unknown, {}, Plan, {
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
    overageRates?: import("mongoose").SchemaDefinitionProperty<PlanOverageRates, Plan, Document<unknown, {}, Plan, {
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

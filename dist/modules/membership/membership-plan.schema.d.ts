import { Document, Types } from 'mongoose';
export type MembershipPlanDocument = MembershipPlan & Document;
export declare class MembershipPlan {
    tenantId: Types.ObjectId;
    name: string;
    code: string;
    description?: string;
    price: number;
    currency: string;
    validityDays: number;
    badgeText?: string;
    badgeColor?: string;
    benefits: string[];
    requiresApproval: boolean;
    isActive: boolean;
    sortOrder: number;
}
export declare const MembershipPlanSchema: import("mongoose").Schema<MembershipPlan, import("mongoose").Model<MembershipPlan, any, any, any, any, any, MembershipPlan>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MembershipPlan, Document<unknown, {}, MembershipPlan, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    validityDays?: import("mongoose").SchemaDefinitionProperty<number, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    badgeText?: import("mongoose").SchemaDefinitionProperty<string | undefined, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    badgeColor?: import("mongoose").SchemaDefinitionProperty<string | undefined, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    benefits?: import("mongoose").SchemaDefinitionProperty<string[], MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    requiresApproval?: import("mongoose").SchemaDefinitionProperty<boolean, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, MembershipPlan, Document<unknown, {}, MembershipPlan, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MembershipPlan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, MembershipPlan>;

import { Document, Types } from 'mongoose';
import { WorkStatus } from '../../shared/types';
export type WorkDocument = Work & Document;
export declare class Work {
    tenantId: Types.ObjectId;
    title: string;
    description?: string;
    category: string;
    areaId: Types.ObjectId;
    budget?: string;
    location?: string;
    images: string[];
    beforeAfter: {
        before?: string[];
        after?: string[];
    };
    status: WorkStatus;
    isPublished: boolean;
}
export declare const WorkSchema: import("mongoose").Schema<Work, import("mongoose").Model<Work, any, any, any, any, any, Work>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Work, Document<unknown, {}, Work, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    areaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    budget?: import("mongoose").SchemaDefinitionProperty<string | undefined, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string | undefined, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    beforeAfter?: import("mongoose").SchemaDefinitionProperty<{
        before?: string[];
        after?: string[];
    }, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<WorkStatus, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Work, Document<unknown, {}, Work, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Work & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Work>;

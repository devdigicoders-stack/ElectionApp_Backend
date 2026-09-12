import { Document, Types } from 'mongoose';
export type ComplaintCategoryDocument = ComplaintCategory & Document;
export declare class ComplaintCategory {
    tenantId: Types.ObjectId;
    name: string;
    description: string;
    icon?: string;
    isActive: boolean;
    order: number;
}
export declare const ComplaintCategorySchema: import("mongoose").Schema<ComplaintCategory, import("mongoose").Model<ComplaintCategory, any, any, any, any, any, ComplaintCategory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    icon?: import("mongoose").SchemaDefinitionProperty<string | undefined, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    order?: import("mongoose").SchemaDefinitionProperty<number, ComplaintCategory, Document<unknown, {}, ComplaintCategory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ComplaintCategory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ComplaintCategory>;
export declare const DEFAULT_COMPLAINT_CATEGORIES: {
    name: string;
    description: string;
}[];

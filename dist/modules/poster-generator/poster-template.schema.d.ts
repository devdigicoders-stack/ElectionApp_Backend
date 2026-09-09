import { Document, Types } from 'mongoose';
export type PosterTemplateDocument = PosterTemplate & Document;
export interface TemplateField {
    key: string;
    label: string;
    type: 'photo' | 'text';
    editable: boolean;
    required: boolean;
    defaultValue?: string;
    position?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    style?: {
        fontSize?: number;
        fontColor?: string;
        fontWeight?: string;
        textAlign?: string;
    };
}
export declare class PosterTemplate {
    tenantId: Types.ObjectId;
    title: string;
    category: string;
    templateImageUrl: string;
    thumbnailUrl?: string;
    fields: TemplateField[];
    isActive: boolean;
    sortOrder: number;
    usageCount: number;
}
export declare const PosterTemplateSchema: import("mongoose").Schema<PosterTemplate, import("mongoose").Model<PosterTemplate, any, any, any, any, any, PosterTemplate>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PosterTemplate, Document<unknown, {}, PosterTemplate, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    templateImageUrl?: import("mongoose").SchemaDefinitionProperty<string, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thumbnailUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fields?: import("mongoose").SchemaDefinitionProperty<TemplateField[], PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    usageCount?: import("mongoose").SchemaDefinitionProperty<number, PosterTemplate, Document<unknown, {}, PosterTemplate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PosterTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, PosterTemplate>;

import { Document, Types } from 'mongoose';
export type ManifestoDocument = Manifesto & Document;
export declare class Manifesto {
    tenantId: Types.ObjectId;
    title: string;
    pdfUrl?: string;
    fileUrl?: string;
    fileType?: string;
    coverImageUrl?: string;
    category: string;
    description: string;
    points: string[];
    images: string[];
    sortOrder: number;
    isPublished: boolean;
}
export declare const ManifestoSchema: import("mongoose").Schema<Manifesto, import("mongoose").Model<Manifesto, any, any, any, any, any, Manifesto>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Manifesto, Document<unknown, {}, Manifesto, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pdfUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fileUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fileType?: import("mongoose").SchemaDefinitionProperty<string | undefined, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    coverImageUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    points?: import("mongoose").SchemaDefinitionProperty<string[], Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Manifesto, Document<unknown, {}, Manifesto, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Manifesto & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Manifesto>;

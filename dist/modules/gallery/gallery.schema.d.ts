import { Document, Types } from 'mongoose';
import { GalleryType } from '../../shared/types';
export type GalleryItemDocument = GalleryItem & Document;
export declare class GalleryItem {
    tenantId: Types.ObjectId;
    title: string;
    description?: string;
    type: GalleryType;
    url: string;
    thumbnailUrl?: string;
    category?: string;
    tags?: string[];
    areaId?: Types.ObjectId;
    isPublished: boolean;
    allowDownload: boolean;
    sortOrder: number;
}
export declare const GalleryItemSchema: import("mongoose").Schema<GalleryItem, import("mongoose").Model<GalleryItem, any, any, any, any, any, GalleryItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GalleryItem, Document<unknown, {}, GalleryItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<GalleryType, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    thumbnailUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    areaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    allowDownload?: import("mongoose").SchemaDefinitionProperty<boolean, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, GalleryItem, Document<unknown, {}, GalleryItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GalleryItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, GalleryItem>;

import { Document, Types } from 'mongoose';
import { NewsStatus } from '../../shared/types';
export type NewsDocument = News & Document;
export declare class News {
    tenantId: Types.ObjectId;
    title: string;
    slug: string;
    shortDescription: string;
    content: string;
    coverImageUrl?: string;
    galleryImages: string[];
    category: string;
    author: {
        name: string;
        role?: string;
        avatarUrl?: string;
    };
    publishDate: Date;
    status: NewsStatus;
    scheduledPublishDate?: Date;
    areaId?: Types.ObjectId;
    tags: string[];
    viewsCount: number;
    isFeatured: boolean;
    allowSharing: boolean;
    createdBy?: Types.ObjectId;
}
export declare const NewsSchema: import("mongoose").Schema<News, import("mongoose").Model<News, any, any, any, any, any, News>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, News, Document<unknown, {}, News, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<News & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shortDescription?: import("mongoose").SchemaDefinitionProperty<string, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    coverImageUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    galleryImages?: import("mongoose").SchemaDefinitionProperty<string[], News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<{
        name: string;
        role?: string;
        avatarUrl?: string;
    }, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    publishDate?: import("mongoose").SchemaDefinitionProperty<Date, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<NewsStatus, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    scheduledPublishDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    areaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    viewsCount?: import("mongoose").SchemaDefinitionProperty<number, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isFeatured?: import("mongoose").SchemaDefinitionProperty<boolean, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    allowSharing?: import("mongoose").SchemaDefinitionProperty<boolean, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, News, Document<unknown, {}, News, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<News & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, News>;

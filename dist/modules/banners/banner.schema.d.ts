import { Document, Types } from 'mongoose';
export type BannerDocument = Banner & Document;
export declare class Banner {
    tenantId: Types.ObjectId;
    title?: string;
    imageUrl: string;
    mobileImageUrl?: string;
    linkUrl?: string;
    category?: string;
    sortOrder: number;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
}
export declare const BannerSchema: import("mongoose").Schema<Banner, import("mongoose").Model<Banner, any, any, any, any, any, Banner>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Banner, Document<unknown, {}, Banner, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string | undefined, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mobileImageUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    linkUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string | undefined, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sortOrder?: import("mongoose").SchemaDefinitionProperty<number, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Banner, Document<unknown, {}, Banner, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Banner & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Banner>;

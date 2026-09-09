import { Document, Types } from 'mongoose';
export type GeneratedPosterDocument = GeneratedPoster & Document;
export declare class GeneratedPoster {
    tenantId: Types.ObjectId;
    templateId: Types.ObjectId;
    userId?: Types.ObjectId;
    outputUrl: string;
    fieldValues: Record<string, string>;
}
export declare const GeneratedPosterSchema: import("mongoose").Schema<GeneratedPoster, import("mongoose").Model<GeneratedPoster, any, any, any, any, any, GeneratedPoster>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GeneratedPoster, Document<unknown, {}, GeneratedPoster, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GeneratedPoster & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GeneratedPoster, Document<unknown, {}, GeneratedPoster, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeneratedPoster & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    templateId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GeneratedPoster, Document<unknown, {}, GeneratedPoster, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeneratedPoster & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, GeneratedPoster, Document<unknown, {}, GeneratedPoster, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeneratedPoster & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    outputUrl?: import("mongoose").SchemaDefinitionProperty<string, GeneratedPoster, Document<unknown, {}, GeneratedPoster, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeneratedPoster & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fieldValues?: import("mongoose").SchemaDefinitionProperty<Record<string, string>, GeneratedPoster, Document<unknown, {}, GeneratedPoster, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GeneratedPoster & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, GeneratedPoster>;

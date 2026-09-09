import { Document, Types } from 'mongoose';
export type AboutLeaderDocument = AboutLeader & Document;
export declare class AboutLeader {
    tenantId: Types.ObjectId;
    fullName: string;
    designation?: string;
    party?: string;
    constituency?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    bio?: string;
    message?: string;
    achievements: string[];
    contactInfo: {
        phone?: string;
        email?: string;
        address?: string;
        officeAddress?: string;
    };
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        whatsapp?: string;
        website?: string;
    };
    timeline: {
        year: string;
        title: string;
        description?: string;
    }[];
}
export declare const AboutLeaderSchema: import("mongoose").Schema<AboutLeader, import("mongoose").Model<AboutLeader, any, any, any, any, any, AboutLeader>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AboutLeader, Document<unknown, {}, AboutLeader, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fullName?: import("mongoose").SchemaDefinitionProperty<string, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    designation?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    party?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    constituency?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    profileImageUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    coverImageUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    bio?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string | undefined, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    achievements?: import("mongoose").SchemaDefinitionProperty<string[], AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    contactInfo?: import("mongoose").SchemaDefinitionProperty<{
        phone?: string;
        email?: string;
        address?: string;
        officeAddress?: string;
    }, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    socialLinks?: import("mongoose").SchemaDefinitionProperty<{
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
        whatsapp?: string;
        website?: string;
    }, AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    timeline?: import("mongoose").SchemaDefinitionProperty<{
        year: string;
        title: string;
        description?: string;
    }[], AboutLeader, Document<unknown, {}, AboutLeader, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AboutLeader & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AboutLeader>;

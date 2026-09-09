import { Document, Types } from 'mongoose';
export type AreaLevelDocument = AreaLevel & Document;
export type AreaDocument = Area & Document;
export declare class AreaLevel {
    tenantId: Types.ObjectId;
    levelOrder: number;
    name: string;
    isRequired: boolean;
}
export declare const AreaLevelSchema: import("mongoose").Schema<AreaLevel, import("mongoose").Model<AreaLevel, any, any, any, any, any, AreaLevel>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AreaLevel, Document<unknown, {}, AreaLevel, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AreaLevel & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, AreaLevel, Document<unknown, {}, AreaLevel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AreaLevel & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    levelOrder?: import("mongoose").SchemaDefinitionProperty<number, AreaLevel, Document<unknown, {}, AreaLevel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AreaLevel & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, AreaLevel, Document<unknown, {}, AreaLevel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AreaLevel & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isRequired?: import("mongoose").SchemaDefinitionProperty<boolean, AreaLevel, Document<unknown, {}, AreaLevel, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AreaLevel & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AreaLevel>;
export declare class Area {
    tenantId: Types.ObjectId;
    levelId: Types.ObjectId;
    parentId?: Types.ObjectId;
    name: string;
    code?: string;
    isActive: boolean;
}
export declare const AreaSchema: import("mongoose").Schema<Area, import("mongoose").Model<Area, any, any, any, any, any, Area>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Area, Document<unknown, {}, Area, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Area, Document<unknown, {}, Area, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    levelId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Area, Document<unknown, {}, Area, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    parentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Area, Document<unknown, {}, Area, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Area, Document<unknown, {}, Area, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string | undefined, Area, Document<unknown, {}, Area, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Area, Document<unknown, {}, Area, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Area & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Area>;

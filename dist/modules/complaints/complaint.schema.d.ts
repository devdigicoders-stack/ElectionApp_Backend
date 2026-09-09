import { Document, Types } from 'mongoose';
import { ComplaintStatus } from '../../shared/types';
export type ComplaintDocument = Complaint & Document;
export declare class Complaint {
    tenantId: Types.ObjectId;
    complaintNumber: string;
    userId: Types.ObjectId;
    areaId: Types.ObjectId;
    category: string;
    title: string;
    description: string;
    mediaUrls: string[];
    status: ComplaintStatus;
    assignedTo?: Types.ObjectId;
    timeline: {
        status: string;
        note?: string;
        updatedBy?: Types.ObjectId;
        updatedAt: Date;
    }[];
}
export declare const ComplaintSchema: import("mongoose").Schema<Complaint, import("mongoose").Model<Complaint, any, any, any, any, any, Complaint>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Complaint, Document<unknown, {}, Complaint, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    complaintNumber?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    areaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mediaUrls?: import("mongoose").SchemaDefinitionProperty<string[], Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ComplaintStatus, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedTo?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    timeline?: import("mongoose").SchemaDefinitionProperty<{
        status: string;
        note?: string;
        updatedBy?: Types.ObjectId;
        updatedAt: Date;
    }[], Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Complaint>;

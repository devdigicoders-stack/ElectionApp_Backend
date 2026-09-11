import { Document, Types } from 'mongoose';
import { ComplaintStatus, ComplaintPriority } from '../../shared/types';
export type ComplaintDocument = Complaint & Document;
export interface IComplaintRemark {
    remark: string;
    addedBy?: Types.ObjectId;
    addedByName?: string;
    isInternal?: boolean;
    createdAt: Date;
}
export interface IComplaintTimelineEvent {
    status: string;
    note?: string;
    action?: string;
    updatedBy?: Types.ObjectId;
    updatedByName?: string;
    updatedByRole?: string;
    isInternal?: boolean;
    proofUrls?: string[];
    updatedAt: Date;
}
export declare class Complaint {
    tenantId: Types.ObjectId;
    complaintNumber: string;
    userId: Types.ObjectId;
    areaId: Types.ObjectId;
    category: string;
    title: string;
    description: string;
    attachments: string[];
    mediaUrls: string[];
    videoUrl?: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    assignedTo?: Types.ObjectId;
    assignedBy?: Types.ObjectId;
    assignedAt?: Date;
    internalRemarks: IComplaintRemark[];
    publicRemarks: IComplaintRemark[];
    resolutionDetails?: string;
    resolutionProof: string[];
    resolvedAt?: Date;
    resolvedBy?: Types.ObjectId;
    closedAt?: Date;
    closedBy?: Types.ObjectId;
    closingNote?: string;
    rejectionReason?: string;
    rejectedAt?: Date;
    rejectedBy?: Types.ObjectId;
    isPublic: boolean;
    publishedAt?: Date;
    publishedBy?: Types.ObjectId;
    timeline: IComplaintTimelineEvent[];
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
    attachments?: import("mongoose").SchemaDefinitionProperty<string[], Complaint, Document<unknown, {}, Complaint, {
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
    videoUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, Complaint, Document<unknown, {}, Complaint, {
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
    priority?: import("mongoose").SchemaDefinitionProperty<ComplaintPriority, Complaint, Document<unknown, {}, Complaint, {
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
    assignedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    internalRemarks?: import("mongoose").SchemaDefinitionProperty<IComplaintRemark[], Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    publicRemarks?: import("mongoose").SchemaDefinitionProperty<IComplaintRemark[], Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolutionDetails?: import("mongoose").SchemaDefinitionProperty<string | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolutionProof?: import("mongoose").SchemaDefinitionProperty<string[], Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolvedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    closedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    closedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    closingNote?: import("mongoose").SchemaDefinitionProperty<string | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rejectionReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rejectedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    rejectedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublic?: import("mongoose").SchemaDefinitionProperty<boolean, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    publishedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    timeline?: import("mongoose").SchemaDefinitionProperty<IComplaintTimelineEvent[], Complaint, Document<unknown, {}, Complaint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Complaint & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Complaint>;

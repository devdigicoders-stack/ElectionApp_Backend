import { Document, Types } from 'mongoose';
import { TaskPriority, VolunteerTaskStatus } from '../../shared/types';
export type VolunteerTaskDocument = VolunteerTask & Document;
export declare class VolunteerTask {
    tenantId: Types.ObjectId;
    title: string;
    description: string;
    assignedVolunteerId?: Types.ObjectId;
    assignedUserId?: Types.ObjectId;
    areaId?: Types.ObjectId;
    dueDate?: Date;
    priority: TaskPriority;
    status: VolunteerTaskStatus;
    attachments: string[];
    submission?: {
        submittedAt: Date;
        completionRemark: string;
        images: string[];
        reportUrl?: string;
        submittedBy: Types.ObjectId;
    };
    review?: {
        reviewedAt: Date;
        reviewedBy: Types.ObjectId;
        reviewNote?: string;
        isApproved: boolean;
    };
    createdBy: Types.ObjectId;
}
export declare const VolunteerTaskSchema: import("mongoose").Schema<VolunteerTask, import("mongoose").Model<VolunteerTask, any, any, any, any, any, VolunteerTask>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VolunteerTask, Document<unknown, {}, VolunteerTask, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedVolunteerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedUserId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    areaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    priority?: import("mongoose").SchemaDefinitionProperty<TaskPriority, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<VolunteerTaskStatus, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    attachments?: import("mongoose").SchemaDefinitionProperty<string[], VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    submission?: import("mongoose").SchemaDefinitionProperty<{
        submittedAt: Date;
        completionRemark: string;
        images: string[];
        reportUrl?: string;
        submittedBy: Types.ObjectId;
    } | undefined, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    review?: import("mongoose").SchemaDefinitionProperty<{
        reviewedAt: Date;
        reviewedBy: Types.ObjectId;
        reviewNote?: string;
        isApproved: boolean;
    } | undefined, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VolunteerTask, Document<unknown, {}, VolunteerTask, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VolunteerTask & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, VolunteerTask>;

import { Document, Types } from 'mongoose';
import { VolunteerStatus } from '../../shared/types';
export type VolunteerDocument = Volunteer & Document;
export declare class Volunteer {
    tenantId: Types.ObjectId;
    userId: Types.ObjectId;
    role?: string;
    assignedAreaId?: Types.ObjectId;
    status: VolunteerStatus;
    tasks: string[];
    assignedBy?: Types.ObjectId;
    notes?: string;
}
export declare const VolunteerSchema: import("mongoose").Schema<Volunteer, import("mongoose").Model<Volunteer, any, any, any, any, any, Volunteer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Volunteer, Document<unknown, {}, Volunteer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<string | undefined, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedAreaId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<VolunteerStatus, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tasks?: import("mongoose").SchemaDefinitionProperty<string[], Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | undefined, Volunteer, Document<unknown, {}, Volunteer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Volunteer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Volunteer>;

import { Document, Types } from 'mongoose';
import { EventRsvpStatus } from '../../shared/types';
export type EventRsvpDocument = EventRsvp & Document;
export declare class EventRsvp {
    tenantId: Types.ObjectId;
    eventId: Types.ObjectId;
    userId: Types.ObjectId;
    status: EventRsvpStatus;
    ticketNumber?: string;
    qrData?: string;
    isCheckedIn: boolean;
    checkedInAt?: Date;
    checkedInBy?: Types.ObjectId;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const EventRsvpSchema: import("mongoose").Schema<EventRsvp, import("mongoose").Model<EventRsvp, any, any, any, any, any, EventRsvp>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EventRsvp, Document<unknown, {}, EventRsvp, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    eventId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<EventRsvpStatus, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ticketNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    qrData?: import("mongoose").SchemaDefinitionProperty<string | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isCheckedIn?: import("mongoose").SchemaDefinitionProperty<boolean, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checkedInAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checkedInBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, EventRsvp, Document<unknown, {}, EventRsvp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventRsvp & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, EventRsvp>;

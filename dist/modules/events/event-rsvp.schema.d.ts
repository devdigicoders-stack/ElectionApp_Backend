import { Document, Types } from 'mongoose';
import { EventRsvpStatus } from '../../shared/types';
export type EventRsvpDocument = EventRsvp & Document;
export declare class EventRsvp {
    tenantId: Types.ObjectId;
    eventId: Types.ObjectId;
    userId: Types.ObjectId;
    status: EventRsvpStatus;
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
}, EventRsvp>;

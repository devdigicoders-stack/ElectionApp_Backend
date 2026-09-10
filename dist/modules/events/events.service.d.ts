import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { EventRsvpDocument } from './event-rsvp.schema';
import { UserDocument } from '../users/user.schema';
import { AreaDocument } from '../areas/area.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { EventRsvpStatus, EventStatus } from '../../shared/types';
import { CreateEventDto, UpdateEventDto, QueryEventsDto, RsvpEventDto, CheckInEventDto } from './events.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Response } from 'express';
export declare class EventsService {
    private eventModel;
    private rsvpModel;
    private userModel;
    private areaModel;
    private auditLogsService?;
    private readonly logger;
    constructor(eventModel: Model<EventDocument>, rsvpModel: Model<EventRsvpDocument>, userModel: Model<UserDocument>, areaModel: Model<AreaDocument>, auditLogsService?: AuditLogsService | undefined);
    private generateTicketNumber;
    seedDefaultEventsIfEmpty(tenant: TenantDocument): Promise<void>;
    create(tenant: TenantDocument, dto: CreateEventDto): Promise<import("mongoose").Document<unknown, {}, EventDocument, {}, import("mongoose").DefaultSchemaOptions> & Event & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, queryDto: QueryEventsDto, user?: any, isAdmin?: boolean): Promise<{
        items: {
            _id: Types.ObjectId;
            title: string;
            description: string | undefined;
            category: string;
            bannerUrl: string | undefined;
            startDate: Date;
            endDate: Date | undefined;
            startTime: string | undefined;
            endTime: string | undefined;
            location: string | undefined;
            mapLink: string | undefined;
            area: Types.ObjectId | undefined;
            images: string[];
            registrationRequired: boolean;
            maximumParticipants: number | null;
            isFull: boolean;
            registeredCount: number;
            interestedCount: number;
            goingCount: number;
            status: EventStatus;
            organizerName: string | undefined;
            organizerPhone: string | undefined;
            tags: string[];
            isPublished: boolean;
            hasRsvp: boolean;
            myRsvp: {
                status: any;
                ticketNumber: any;
                isCheckedIn: any;
            } | null;
            createdAt: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(tenant: TenantDocument, id: string, user?: any): Promise<{
        _id: Types.ObjectId;
        title: string;
        description: string | undefined;
        category: string;
        bannerUrl: string | undefined;
        startDate: Date;
        endDate: Date | undefined;
        startTime: string | undefined;
        endTime: string | undefined;
        location: string | undefined;
        mapLink: string | undefined;
        area: Types.ObjectId | undefined;
        images: string[];
        registrationRequired: boolean;
        maximumParticipants: number | null;
        isFull: boolean;
        registeredCount: number;
        checkedInCount: number;
        interestedCount: number;
        goingCount: number;
        status: EventStatus;
        organizerName: string | undefined;
        organizerPhone: string | undefined;
        tags: string[];
        isPublished: boolean;
        hasRsvp: boolean;
        myRsvp: {
            status: EventRsvpStatus;
            ticketNumber: string | undefined;
            isCheckedIn: boolean;
            checkedInAt: Date | undefined;
            notes: string | undefined;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    rsvp(tenant: TenantDocument, eventId: string, userId: string, dto: RsvpEventDto): Promise<{
        message: string;
        status: EventRsvpStatus;
        ticketNumber: string | null;
        isCheckedIn: boolean;
    }>;
    getUserRsvp(tenant: TenantDocument, eventId: string, userId: string): Promise<{
        hasRsvp: boolean;
        status: null;
        ticketNumber: null;
        isCheckedIn?: undefined;
        checkedInAt?: undefined;
        createdAt?: undefined;
    } | {
        hasRsvp: boolean;
        status: EventRsvpStatus;
        ticketNumber: string | undefined;
        isCheckedIn: boolean;
        checkedInAt: Date | undefined;
        createdAt: any;
    }>;
    getEventTicket(tenant: TenantDocument, eventId: string, userId: string, isAdmin?: boolean): Promise<{
        ticketNumber: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
        event: {
            _id: Types.ObjectId;
            title: string;
            category: string;
            startDate: Date;
            startTime: string | undefined;
            endTime: string | undefined;
            location: string | undefined;
            mapLink: string | undefined;
            bannerUrl: string | undefined;
        };
        attendee: {
            name: any;
            mobile: any;
            email: any;
        };
        tenant: {
            slug: string;
            name: string;
        };
        qrCodeDataUrl: string;
    }>;
    lookupTicket(tenant: TenantDocument, eventId: string, ticketNumber: string): Promise<{
        isValid: boolean;
        ticketNumber: string | undefined;
        status: EventRsvpStatus;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
        attendee: {
            _id: any;
            name: any;
            mobile: any;
            gender: any;
        };
        event: {
            _id: Types.ObjectId;
            title: string;
            startDate: Date;
        };
    }>;
    checkInAttendee(tenant: TenantDocument, eventId: string, dto: CheckInEventDto, adminUser: any): Promise<{
        success: boolean;
        message: string;
        ticketNumber: string | undefined;
        checkedInAt: Date;
        attendee: {
            name: any;
            mobile: any;
        };
    }>;
    getShareLink(tenant: TenantDocument, id: string): Promise<{
        message: string;
        whatsappUrl: string;
        event: {
            _id: Types.ObjectId;
            title: string;
            startDate: Date;
            location: string | undefined;
        };
    }>;
    getAnalytics(tenant: TenantDocument, eventId: string): Promise<{
        event: {
            _id: Types.ObjectId;
            title: string;
            category: string;
            startDate: Date;
            startTime: string | undefined;
            location: string | undefined;
            area: Types.ObjectId | undefined;
            status: EventStatus;
        };
        summary: {
            totalInterested: number;
            totalGoing: number;
            totalRegistered: number;
            capacity: string | number;
            capacityUtilizationPercentage: number | null;
            checkedInCount: number;
            turnoutPercentage: number;
        };
        checkInBreakdown: {
            registered: number;
            checkedIn: number;
            pendingCheckIn: number;
            turnoutPercentage: number;
        };
        timeline: {
            date: any;
            total: any;
            going: any;
            interested: any;
        }[];
    }>;
    exportAttendeesCsv(tenant: TenantDocument, eventId: string, res: Response, format?: string, adminUser?: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
    update(tenant: TenantDocument, id: string, dto: UpdateEventDto): Promise<import("mongoose").Document<unknown, {}, EventDocument, {}, import("mongoose").DefaultSchemaOptions> & Event & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<{
        message: string;
    }>;
}

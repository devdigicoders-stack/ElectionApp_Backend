import { EventsService } from './events.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { CreateEventDto, UpdateEventDto, RsvpEventDto, CheckInEventDto, QueryEventsDto } from './events.dto';
import { Response } from 'express';
export declare class EventsController {
    private eventsService;
    constructor(eventsService: EventsService);
    private extractOptionalUser;
    findAll(req: TenantRequest, query: QueryEventsDto): Promise<{
        items: {
            _id: import("mongoose").Types.ObjectId;
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
            area: import("mongoose").Types.ObjectId | undefined;
            images: string[];
            registrationRequired: boolean;
            maximumParticipants: number | null;
            isFull: boolean;
            registeredCount: number;
            interestedCount: number;
            goingCount: number;
            status: import("../../shared/types").EventStatus;
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
    getMyGoing(req: TenantRequest & {
        user: any;
    }): Promise<any[]>;
    findOne(req: TenantRequest, id: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
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
        area: import("mongoose").Types.ObjectId | undefined;
        images: string[];
        registrationRequired: boolean;
        maximumParticipants: number | null;
        isFull: boolean;
        registeredCount: number;
        checkedInCount: number;
        interestedCount: number;
        goingCount: number;
        status: import("../../shared/types").EventStatus;
        organizerName: string | undefined;
        organizerPhone: string | undefined;
        tags: string[];
        isPublished: boolean;
        hasRsvp: boolean;
        myRsvp: {
            status: import("../../shared/types").EventRsvpStatus;
            ticketNumber: string | undefined;
            isCheckedIn: boolean;
            checkedInAt: Date | undefined;
            notes: string | undefined;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    rsvp(req: TenantRequest & {
        user: any;
    }, id: string, dto: RsvpEventDto): Promise<{
        message: string;
        status: import("../../shared/types").EventRsvpStatus;
        ticketNumber: string | null;
        isCheckedIn: boolean;
    }>;
    removeRsvp(req: TenantRequest & {
        user: any;
    }, id: string): Promise<{
        message: string;
    }>;
    getMyRsvp(req: TenantRequest & {
        user: any;
    }, id: string): Promise<{
        hasRsvp: boolean;
        status: null;
        ticketNumber: null;
        isCheckedIn?: undefined;
        checkedInAt?: undefined;
        createdAt?: undefined;
    } | {
        hasRsvp: boolean;
        status: import("../../shared/types").EventRsvpStatus;
        ticketNumber: string | undefined;
        isCheckedIn: boolean;
        checkedInAt: Date | undefined;
        createdAt: any;
    }>;
    getTicket(req: TenantRequest & {
        user: any;
    }, id: string, queryUserId?: string): Promise<{
        ticketNumber: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
        event: {
            _id: import("mongoose").Types.ObjectId;
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
    getShareLink(req: TenantRequest, id: string): Promise<{
        message: string;
        whatsappUrl: string;
        event: {
            _id: import("mongoose").Types.ObjectId;
            title: string;
            startDate: Date;
            location: string | undefined;
        };
    }>;
    create(req: TenantRequest, dto: CreateEventDto): Promise<import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAnalytics(req: TenantRequest, id: string): Promise<{
        event: {
            _id: import("mongoose").Types.ObjectId;
            title: string;
            category: string;
            startDate: Date;
            startTime: string | undefined;
            location: string | undefined;
            area: import("mongoose").Types.ObjectId | undefined;
            status: import("../../shared/types").EventStatus;
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
    exportCsv(req: TenantRequest & {
        user?: any;
    }, id: string, res: Response, format?: string, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
    lookupTicket(req: TenantRequest, id: string, ticketNumber: string): Promise<{
        isValid: boolean;
        ticketNumber: string | undefined;
        status: import("../../shared/types").EventRsvpStatus;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
        attendee: {
            _id: any;
            name: any;
            mobile: any;
            gender: any;
        };
        event: {
            _id: import("mongoose").Types.ObjectId;
            title: string;
            startDate: Date;
        };
    }>;
    checkIn(req: TenantRequest & {
        user: any;
    }, id: string, dto: CheckInEventDto): Promise<{
        success: boolean;
        message: string;
        ticketNumber: string | undefined;
        checkedInAt: Date;
        attendee: {
            name: any;
            mobile: any;
        };
    }>;
    update(req: TenantRequest, id: string, dto: UpdateEventDto): Promise<import("mongoose").Document<unknown, {}, import("./event.schema").EventDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<{
        message: string;
    }>;
}

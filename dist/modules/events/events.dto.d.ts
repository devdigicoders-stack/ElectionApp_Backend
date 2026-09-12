import { EventStatus, EventRsvpStatus } from '../../shared/types';
export declare class CreateEventDto {
    title: string;
    description?: string;
    category?: string;
    bannerUrl?: string;
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    mapLink?: string;
    areaId?: string;
    images?: string[];
    registrationRequired?: boolean;
    maximumParticipants?: number;
    status?: EventStatus;
    organizerName?: string;
    organizerPhone?: string;
    tags?: string[];
    isPublished?: boolean;
}
export declare class UpdateEventDto {
    title?: string;
    description?: string;
    category?: string;
    bannerUrl?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    mapLink?: string;
    areaId?: string;
    images?: string[];
    registrationRequired?: boolean;
    maximumParticipants?: number;
    status?: EventStatus;
    organizerName?: string;
    organizerPhone?: string;
    tags?: string[];
    isPublished?: boolean;
    isActive?: boolean;
}
export declare class RsvpEventDto {
    status: EventRsvpStatus;
    notes?: string;
}
export declare class CheckInEventDto {
    ticketNumber: string;
    notes?: string;
}
export declare class QueryEventsDto {
    category?: string;
    areaId?: string;
    status?: string;
    upcoming?: string;
    search?: string;
    page?: number;
    limit?: number;
}

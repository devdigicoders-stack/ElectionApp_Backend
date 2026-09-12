import { CitizenDashboardService } from './citizen-dashboard.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { QueryFeedDto } from './citizen-dashboard.dto';
export declare class MyAreaController {
    private readonly dashboardService;
    constructor(dashboardService: CitizenDashboardService);
    getMyAreaFeed(req: TenantRequest & {
        user: any;
    }): Promise<{
        area: {
            hasArea: boolean;
            primaryArea: null;
            breadcrumbs: never[];
            breadcrumbText: string;
            relevantAreaIds: import("mongoose").Types.ObjectId[];
        } | {
            hasArea: boolean;
            primaryArea: {
                _id: import("mongoose").Types.ObjectId;
                name: string;
                code: string | null;
                levelName: any;
            };
            breadcrumbs: {
                _id: any;
                name: any;
                code: any;
                levelOrder: any;
                levelName: any;
            }[];
            breadcrumbText: string;
            relevantAreaIds: import("mongoose").Types.ObjectId[];
        };
        localWorks: {
            total: number;
            items: (import("../works/work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        localEvents: {
            total: number;
            items: (import("../events/event.schema").Event & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        localNews: {
            total: number;
            items: (import("../news/news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        localPolls: {
            total: number;
            items: (import("../polls/poll.schema").Poll & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        coordinators: {
            _id: any;
            role: any;
            area: any;
            name: any;
            mobile: any;
            photo: any;
        }[];
        communityComplaints: {
            total: number;
            items: (import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
    }>;
    getMyAreaHierarchy(req: TenantRequest & {
        user: any;
    }): Promise<{
        hasArea: boolean;
        primaryArea: null;
        breadcrumbs: never[];
        breadcrumbText: string;
        relevantAreaIds: import("mongoose").Types.ObjectId[];
    } | {
        hasArea: boolean;
        primaryArea: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        };
        breadcrumbs: {
            _id: any;
            name: any;
            code: any;
            levelOrder: any;
            levelName: any;
        }[];
        breadcrumbText: string;
        relevantAreaIds: import("mongoose").Types.ObjectId[];
    }>;
    getMyAreaWorks(req: TenantRequest & {
        user: any;
    }, query: QueryFeedDto): Promise<{
        area: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        breadcrumb: string;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        works: (import("../works/work.schema").Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getMyAreaEvents(req: TenantRequest & {
        user: any;
    }, query: QueryFeedDto): Promise<{
        area: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        events: {
            myRsvp: import("../../shared/types").EventRsvpStatus | null;
            tenantId: import("mongoose").Types.ObjectId;
            title: string;
            description?: string;
            category: string;
            bannerUrl?: string;
            startDate: Date;
            endDate?: Date;
            startTime?: string;
            endTime?: string;
            location?: string;
            mapLink?: string;
            areaId?: import("mongoose").Types.ObjectId;
            images: string[];
            registrationRequired: boolean;
            maximumParticipants?: number;
            registeredCount: number;
            checkedInCount: number;
            interestedCount: number;
            goingCount: number;
            status: import("../../shared/types").EventStatus;
            organizerName?: string;
            organizerPhone?: string;
            tags: string[];
            isPublished: boolean;
            isActive: boolean;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
    }>;
    getMyAreaNews(req: TenantRequest & {
        user: any;
    }, query: QueryFeedDto): Promise<{
        area: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        news: (import("../news/news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getMyAreaPolls(req: TenantRequest & {
        user: any;
    }): Promise<{
        area: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        polls: {
            hasVoted: boolean;
            votedOptionId: string | null;
            tenantId: import("mongoose").Types.ObjectId;
            question: string;
            description?: string;
            category?: string;
            options: {
                optionId: string;
                text: string;
                votes: number;
            }[];
            targetAreaId?: import("mongoose").Types.ObjectId;
            targetAudience: import("../../shared/types").PollTargetAudience;
            targetGender?: string;
            targetMinAge?: number;
            targetMaxAge?: number;
            resultVisibility: import("../../shared/types").PollResultVisibility;
            allowRevote: boolean;
            allowMultipleChoices: boolean;
            maxChoices: number;
            isActive: boolean;
            startsAt?: Date;
            endsAt?: Date;
            durationHours?: number;
            resultDeclaredAt?: Date;
            totalVotes: number;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
    }>;
    getMyAreaCoordinator(req: TenantRequest & {
        user: any;
    }): Promise<{
        hasCoordinator: boolean;
        message: string;
        coordinators: never[];
        area?: undefined;
        breadcrumbs?: undefined;
    } | {
        area: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        breadcrumbs: never[] | {
            _id: any;
            name: any;
            code: any;
            levelOrder: any;
            levelName: any;
        }[];
        hasCoordinator: boolean;
        coordinators: {
            _id: any;
            role: any;
            area: any;
            name: any;
            mobile: any;
            email: any;
            photo: any;
            notes: any;
        }[];
        message?: undefined;
    }>;
    getMyAreaComplaints(req: TenantRequest & {
        user: any;
    }, query: QueryFeedDto): Promise<{
        area: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        complaints: (import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}

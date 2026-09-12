import { Model, Types } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { AreaDocument, AreaLevelDocument } from '../areas/area.schema';
import { Work, WorkDocument } from '../works/work.schema';
import { Event, EventDocument } from '../events/event.schema';
import { EventRsvpDocument } from '../events/event-rsvp.schema';
import { Poll, PollDocument, PollVoteDocument } from '../polls/poll.schema';
import { News, NewsDocument } from '../news/news.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { Banner, BannerDocument } from '../banners/banner.schema';
import { NotificationDocument, NotificationReadDocument } from '../notifications/notification.schema';
import { VolunteerStatus } from '../../shared/types';
import { UpdateCitizenProfileDto, QueryFeedDto } from './citizen-dashboard.dto';
export declare class CitizenDashboardService {
    private userModel;
    private areaModel;
    private areaLevelModel;
    private workModel;
    private eventModel;
    private eventRsvpModel;
    private pollModel;
    private pollVoteModel;
    private newsModel;
    private complaintModel;
    private membershipModel;
    private volunteerModel;
    private bannerModel;
    private notificationModel;
    private notificationReadModel;
    constructor(userModel: Model<UserDocument>, areaModel: Model<AreaDocument>, areaLevelModel: Model<AreaLevelDocument>, workModel: Model<WorkDocument>, eventModel: Model<EventDocument>, eventRsvpModel: Model<EventRsvpDocument>, pollModel: Model<PollDocument>, pollVoteModel: Model<PollVoteDocument>, newsModel: Model<NewsDocument>, complaintModel: Model<ComplaintDocument>, membershipModel: Model<MembershipDocument>, volunteerModel: Model<VolunteerDocument>, bannerModel: Model<BannerDocument>, notificationModel: Model<NotificationDocument>, notificationReadModel: Model<NotificationReadDocument>);
    private getCitizenUser;
    resolveUserAreaHierarchy(tenant: TenantDocument, areaId?: Types.ObjectId | null): Promise<{
        hasArea: boolean;
        primaryArea: null;
        breadcrumbs: never[];
        breadcrumbText: string;
        relevantAreaIds: Types.ObjectId[];
    } | {
        hasArea: boolean;
        primaryArea: {
            _id: Types.ObjectId;
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
        relevantAreaIds: Types.ObjectId[];
    }>;
    getMyAreaFeed(tenant: TenantDocument, userId: string): Promise<{
        area: {
            hasArea: boolean;
            primaryArea: null;
            breadcrumbs: never[];
            breadcrumbText: string;
            relevantAreaIds: Types.ObjectId[];
        } | {
            hasArea: boolean;
            primaryArea: {
                _id: Types.ObjectId;
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
            relevantAreaIds: Types.ObjectId[];
        };
        localWorks: {
            total: number;
            items: (Work & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        localEvents: {
            total: number;
            items: (Event & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        localNews: {
            total: number;
            items: (News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        localPolls: {
            total: number;
            items: (Poll & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
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
            items: (Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
    }>;
    getMyAreaHierarchy(tenant: TenantDocument, userId: string): Promise<{
        hasArea: boolean;
        primaryArea: null;
        breadcrumbs: never[];
        breadcrumbText: string;
        relevantAreaIds: Types.ObjectId[];
    } | {
        hasArea: boolean;
        primaryArea: {
            _id: Types.ObjectId;
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
        relevantAreaIds: Types.ObjectId[];
    }>;
    getMyAreaWorks(tenant: TenantDocument, userId: string, query: QueryFeedDto): Promise<{
        area: {
            _id: Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        breadcrumb: string;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        works: (Work & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getMyAreaEvents(tenant: TenantDocument, userId: string, query: QueryFeedDto): Promise<{
        area: {
            _id: Types.ObjectId;
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
            tenantId: Types.ObjectId;
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
            areaId?: Types.ObjectId;
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
            _id: Types.ObjectId;
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
    getMyAreaNews(tenant: TenantDocument, userId: string, query: QueryFeedDto): Promise<{
        area: {
            _id: Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        news: (News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getMyAreaPolls(tenant: TenantDocument, userId: string): Promise<{
        area: {
            _id: Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        polls: {
            hasVoted: boolean;
            votedOptionId: string | null;
            tenantId: Types.ObjectId;
            question: string;
            description?: string;
            category?: string;
            options: {
                optionId: string;
                text: string;
                votes: number;
            }[];
            targetAreaId?: Types.ObjectId;
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
            _id: Types.ObjectId;
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
    getMyAreaCoordinator(tenant: TenantDocument, userId: string): Promise<{
        hasCoordinator: boolean;
        message: string;
        coordinators: never[];
        area?: undefined;
        breadcrumbs?: undefined;
    } | {
        area: {
            _id: Types.ObjectId;
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
    getMyAreaComplaints(tenant: TenantDocument, userId: string, query: QueryFeedDto): Promise<{
        area: {
            _id: Types.ObjectId;
            name: string;
            code: string | null;
            levelName: any;
        } | null;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        complaints: (Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getCitizenDashboard(tenant: TenantDocument, userId: string): Promise<{
        welcome: {
            userId: Types.ObjectId;
            name: string;
            mobile: string;
            profilePhoto: string | null;
            category: string;
            tags: string[];
            isProfileComplete: boolean;
        };
        area: {
            hasArea: boolean;
            primaryArea: null;
            breadcrumbs: never[];
            breadcrumbText: string;
            relevantAreaIds: Types.ObjectId[];
        } | {
            hasArea: boolean;
            primaryArea: {
                _id: Types.ObjectId;
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
            relevantAreaIds: Types.ObjectId[];
        };
        quickActions: {
            id: string;
            label: string;
            labelEn: string;
            icon: string;
            route: string;
        }[];
        complaintsSummary: {
            total: number;
            pending: number;
            inProgress: number;
            resolved: number;
            recent: (Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        upcomingEvents: {
            myRsvp: import("../../shared/types").EventRsvpStatus | null;
            tenantId: Types.ObjectId;
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
            areaId?: Types.ObjectId;
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
            _id: Types.ObjectId;
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
        activePoll: {
            hasVoted: boolean;
            votedOptionId: string | null | undefined;
            tenantId: Types.ObjectId;
            question: string;
            description?: string;
            category?: string;
            options: {
                optionId: string;
                text: string;
                votes: number;
            }[];
            targetAreaId?: Types.ObjectId;
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
            _id: Types.ObjectId;
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
        } | null;
        membership: {
            status: import("../../shared/types").MembershipStatus;
            designation: string;
            membershipNumber: string | null;
            hasCard: boolean;
            cardUrl: string | null;
            cardDownloadUrl: string;
            message?: undefined;
        } | {
            status: string;
            hasCard: boolean;
            message: string;
            designation?: undefined;
            membershipNumber?: undefined;
            cardUrl?: undefined;
            cardDownloadUrl?: undefined;
        };
        volunteer: {
            isVolunteer: boolean;
            role: string | undefined;
            status: VolunteerStatus;
            assignedArea: any;
        } | {
            isVolunteer: boolean;
            role?: undefined;
            status?: undefined;
            assignedArea?: undefined;
        };
        banners: (Banner & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        latestNews: (News & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        unreadNotificationsCount: number;
    }>;
    getCitizenProfile(tenant: TenantDocument, userId: string): Promise<{
        profile: {
            _id: Types.ObjectId;
            mobile: string;
            name: string | undefined;
            email: string | null;
            dob: Date | null;
            gender: string | null;
            profilePhoto: string | null;
            address: string | null;
            category: string;
            tags: string[];
            customFields: Record<string, any>;
            isProfileComplete: boolean;
            createdAt: any;
        };
        area: {
            hasArea: boolean;
            primaryArea: null;
            breadcrumbs: never[];
            breadcrumbText: string;
            relevantAreaIds: Types.ObjectId[];
        } | {
            hasArea: boolean;
            primaryArea: {
                _id: Types.ObjectId;
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
            relevantAreaIds: Types.ObjectId[];
        };
        membership: (Membership & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        volunteer: (Volunteer & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        activity: {
            complaints: {
                total: number;
                items: (Complaint & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                    _id: Types.ObjectId;
                }> & {
                    __v: number;
                })[];
            };
            eventRegistrations: {
                total: number;
                items: {
                    _id: any;
                    status: any;
                    event: any;
                }[];
            };
            pollParticipation: {
                total: number;
                items: {
                    _id: any;
                    optionId: any;
                    poll: any;
                }[];
            };
        };
    }>;
    updateCitizenProfile(tenant: TenantDocument, userId: string, dto: UpdateCitizenProfileDto): Promise<{
        message: string;
        profile: UserDocument;
        area: {
            hasArea: boolean;
            primaryArea: null;
            breadcrumbs: never[];
            breadcrumbText: string;
            relevantAreaIds: Types.ObjectId[];
        } | {
            hasArea: boolean;
            primaryArea: {
                _id: Types.ObjectId;
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
            relevantAreaIds: Types.ObjectId[];
        };
    }>;
}

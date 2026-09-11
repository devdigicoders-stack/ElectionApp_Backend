import { CitizenDashboardService } from './citizen-dashboard.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { UpdateCitizenProfileDto } from './citizen-dashboard.dto';
export declare class CitizenDashboardController {
    private readonly dashboardService;
    constructor(dashboardService: CitizenDashboardService);
    getCitizenDashboard(req: TenantRequest & {
        user: any;
    }): Promise<{
        welcome: {
            userId: import("mongoose").Types.ObjectId;
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
            recent: (import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        upcomingEvents: {
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
        activePoll: {
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
            isActive: boolean;
            startsAt?: Date;
            endsAt?: Date;
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
            status: import("../../shared/types").VolunteerStatus;
            assignedArea: any;
        } | {
            isVolunteer: boolean;
            role?: undefined;
            status?: undefined;
            assignedArea?: undefined;
        };
        banners: (import("../banners/banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        latestNews: (import("../news/news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        unreadNotificationsCount: number;
    }>;
    getCitizenProfile(req: TenantRequest & {
        user: any;
    }): Promise<{
        profile: {
            _id: import("mongoose").Types.ObjectId;
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
        membership: (import("../membership/membership.schema").Membership & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        volunteer: (import("../volunteers/volunteer.schema").Volunteer & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        activity: {
            complaints: {
                total: number;
                items: (import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                    _id: import("mongoose").Types.ObjectId;
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
    updateCitizenProfile(req: TenantRequest & {
        user: any;
    }, dto: UpdateCitizenProfileDto): Promise<{
        message: string;
        profile: import("../users/user.schema").UserDocument;
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
    }>;
}
export declare class DashboardCitizenAliasController {
    private readonly dashboardService;
    constructor(dashboardService: CitizenDashboardService);
    getDashboard(req: TenantRequest & {
        user: any;
    }): Promise<{
        welcome: {
            userId: import("mongoose").Types.ObjectId;
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
            recent: (import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        };
        upcomingEvents: {
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
        activePoll: {
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
            isActive: boolean;
            startsAt?: Date;
            endsAt?: Date;
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
            status: import("../../shared/types").VolunteerStatus;
            assignedArea: any;
        } | {
            isVolunteer: boolean;
            role?: undefined;
            status?: undefined;
            assignedArea?: undefined;
        };
        banners: (import("../banners/banner.schema").Banner & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        latestNews: (import("../news/news.schema").News & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        unreadNotificationsCount: number;
    }>;
}

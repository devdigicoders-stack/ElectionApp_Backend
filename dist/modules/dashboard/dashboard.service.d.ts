import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { UserDocument } from '../users/user.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import { WorkDocument } from '../works/work.schema';
import { EventDocument } from '../events/event.schema';
import { MembershipDocument } from '../membership/membership.schema';
import { VolunteerDocument } from '../volunteers/volunteer.schema';
import { SubscriptionDocument, SubscriptionStatus } from '../subscriptions/subscription.schema';
import { PlanDocument } from '../plans/plan.schema';
import { TenantStatus } from '../../shared/types';
export declare class DashboardService {
    private userModel;
    private complaintModel;
    private workModel;
    private eventModel;
    private membershipModel;
    private volunteerModel;
    private tenantModel;
    private subscriptionModel;
    private planModel;
    constructor(userModel: Model<UserDocument>, complaintModel: Model<ComplaintDocument>, workModel: Model<WorkDocument>, eventModel: Model<EventDocument>, membershipModel: Model<MembershipDocument>, volunteerModel: Model<VolunteerDocument>, tenantModel: Model<TenantDocument>, subscriptionModel: Model<SubscriptionDocument>, planModel: Model<PlanDocument>);
    getSummary(tenant: TenantDocument): Promise<{
        stats: {
            users: number;
            complaints: {
                total: number;
                pending: number;
                resolved: number;
            };
            works: {
                total: number;
                completed: number;
            };
            events: {
                upcoming: number;
            };
            membership: {
                approved: number;
                pending: number;
            };
            volunteers: number;
        };
        recentComplaints: (import("mongoose").Document<unknown, {}, ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        complaintTrend: any[];
    }>;
    getSuperAdminStats(): Promise<{
        tenants: {
            total: number;
            active: number;
            trial: number;
            suspended: number;
            expired: number;
        };
        subscriptions: {
            total: number;
            active: number;
            trialing: number;
            expired: number;
            canceled: number;
            paused: number;
            totalRevenue: any;
            paidInvoicesCount: any;
        };
        citizens: {
            total: number;
            registered: number;
            active: number;
            inactive: number;
            activeRate: string;
            activeRateNum: number;
            activeLast30Days: number;
            profilesCompleted: number;
            newInLast30Days: number;
        };
        complaints: {
            total: number;
            resolved: number;
            pending: number;
            resolutionRate: string;
        };
        plans: {
            total: number;
            active: number;
        };
        storage: {
            usedMB: number;
            usedBytes: number;
            usedFormatted: string;
            physicalUploadsMB: number;
            physicalUploadsFormatted: string;
            databaseMB: number;
            databaseFormatted: string;
            fileCount: number;
            allocatedMB: number;
            allocatedFormatted: string;
            percentUsed: number;
            status: string;
            estimatedMB: number;
            formatted: string;
        };
        alerts: {
            total: number;
            criticalCount: number;
            warningCount: number;
            infoCount: number;
            items: {
                id: string;
                category: "subscription" | "storage" | "domain" | "tenant" | "system";
                severity: "critical" | "warning" | "info";
                title: string;
                message: string;
                timestamp: string;
                tenantId?: string;
                tenantName?: string;
                tenantSlug?: string;
                actionType: "RENEW" | "EXTEND_TRIAL" | "UPGRADE_PLAN" | "VERIFY_DOMAIN" | "VIEW_CLIENT" | "MANAGE_STORAGE" | "VIEW_COMPLAINTS";
                actionLabel: string;
                actionUrl: string;
                metadata?: Record<string, any>;
            }[];
        };
        recentTenants: (import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        recentInvoices: any[];
    }>;
    getSuperAdminAlerts(options?: {
        severity?: string;
        category?: string;
        platformStoragePercent?: number;
        platformStorageFormatted?: string;
        platformAllocatedFormatted?: string;
    }): Promise<{
        total: number;
        criticalCount: number;
        warningCount: number;
        infoCount: number;
        items: {
            id: string;
            category: "subscription" | "storage" | "domain" | "tenant" | "system";
            severity: "critical" | "warning" | "info";
            title: string;
            message: string;
            timestamp: string;
            tenantId?: string;
            tenantName?: string;
            tenantSlug?: string;
            actionType: "RENEW" | "EXTEND_TRIAL" | "UPGRADE_PLAN" | "VERIFY_DOMAIN" | "VIEW_CLIENT" | "MANAGE_STORAGE" | "VIEW_COMPLAINTS";
            actionLabel: string;
            actionUrl: string;
            metadata?: Record<string, any>;
        }[];
    }>;
    getSuperAdminGrowth(days?: number): Promise<{
        periodDays: number;
        startDate: Date;
        tenantGrowth: {
            date: any;
            count: any;
        }[];
        citizenGrowth: {
            date: any;
            count: any;
        }[];
        complaintGrowth: {
            date: any;
            count: any;
        }[];
        revenueTrend: {
            date: any;
            amount: any;
            invoiceCount: any;
        }[];
    }>;
    getSuperAdminTenantsOverview(params: {
        page: number;
        limit: number;
        status?: string;
        search?: string;
    }): Promise<{
        items: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
            status: TenantStatus;
            customDomain: string | null;
            leaderName: string | null;
            createdAt: any;
            plan: import("mongoose").Types.ObjectId | null;
            subscription: {
                status: SubscriptionStatus;
                startDate: Date;
                endDate: Date;
                trialEndsAt: Date | undefined;
            } | null;
            metrics: {
                totalCitizens: any;
                totalComplaints: any;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}

import { DashboardService } from './dashboard.service';
export declare class SuperAdminDashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getGlobalStats(): Promise<{
        tenants: {
            total: number;
            active: number;
            trial: number;
            suspended: number;
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
        recentTenants: (import("mongoose").Document<unknown, {}, import("../tenants/tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../tenants/tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        recentInvoices: any[];
    }>;
    getGrowthTrends(days?: string): Promise<{
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
    getTenantsOverview(page?: string, limit?: string, status?: string, search?: string): Promise<{
        items: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
            status: import("../../shared/types").TenantStatus;
            customDomain: string | null;
            leaderName: string | null;
            createdAt: any;
            plan: import("mongoose").Types.ObjectId | null;
            subscription: {
                status: import("../subscriptions/subscription.schema").SubscriptionStatus;
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

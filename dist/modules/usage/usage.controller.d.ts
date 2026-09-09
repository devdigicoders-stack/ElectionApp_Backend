import { UsageService } from './usage.service';
import { QueryUsageOverviewDto } from './usage.dto';
export declare class UsageSuperAdminController {
    private readonly usageService;
    constructor(usageService: UsageService);
    getOverview(query: QueryUsageOverviewDto): Promise<{
        summary: {
            totalTenants: number;
            normalCount: number;
            warningCount: number;
            restrictedCount: number;
        };
        items: {
            tenant: {
                id: import("mongoose").Types.ObjectId;
                name: string;
                slug: string;
                status: import("../../shared/types").TenantStatus;
                leaderName: string | null;
            };
            plan: {
                id: import("mongoose").Types.ObjectId;
                name: string;
                slug: string;
                price: number;
                billingCycle: import("../plans/plan.schema").BillingCycle;
            } | null;
            subscription: {
                status: import("../subscriptions/subscription.schema").SubscriptionStatus;
                startDate: Date;
                endDate: Date;
                trialEndsAt: Date | undefined;
            } | null;
            overallStatus: import("./usage.service").QuotaStatus;
            metrics: {
                citizens: import("./usage.service").MetricUsage;
                storageMB: import("./usage.service").MetricUsage;
                staffUsers: import("./usage.service").MetricUsage;
                postersThisMonth: import("./usage.service").MetricUsage;
                notificationsThisMonth: import("./usage.service").MetricUsage;
            };
            alerts: string[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTenantUsage(tenantId: string): Promise<{
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
            status: import("../../shared/types").TenantStatus;
            leaderName: string | null;
        };
        plan: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
            price: number;
            billingCycle: import("../plans/plan.schema").BillingCycle;
        } | null;
        subscription: {
            status: import("../subscriptions/subscription.schema").SubscriptionStatus;
            startDate: Date;
            endDate: Date;
            trialEndsAt: Date | undefined;
        } | null;
        overallStatus: import("./usage.service").QuotaStatus;
        metrics: {
            citizens: import("./usage.service").MetricUsage;
            storageMB: import("./usage.service").MetricUsage;
            staffUsers: import("./usage.service").MetricUsage;
            postersThisMonth: import("./usage.service").MetricUsage;
            notificationsThisMonth: import("./usage.service").MetricUsage;
        };
        alerts: string[];
    }>;
}

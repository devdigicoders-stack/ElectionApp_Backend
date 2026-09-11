import { Model, Types } from 'mongoose';
import { TenantDocument } from '../tenants/tenant.schema';
import { PlanDocument } from '../plans/plan.schema';
import { SubscriptionDocument } from '../subscriptions/subscription.schema';
import { UserDocument } from '../users/user.schema';
import { AdminUserDocument } from '../admin-users/admin-user.schema';
import { GeneratedPosterDocument } from '../poster-generator/generated-poster.schema';
import { NotificationDocument } from '../notifications/notification.schema';
import { QueryUsageOverviewDto } from './usage.dto';
export type QuotaStatus = 'normal' | 'warning' | 'restricted';
export interface MetricUsage {
    used: number;
    limit: number;
    remaining: number | string;
    percentUsed: number;
    status: QuotaStatus;
    formattedUsed?: string;
    formattedLimit?: string;
}
export declare class UsageService {
    private tenantModel;
    private planModel;
    private subscriptionModel;
    private userModel;
    private adminUserModel;
    private posterModel;
    private notificationModel;
    constructor(tenantModel: Model<TenantDocument>, planModel: Model<PlanDocument>, subscriptionModel: Model<SubscriptionDocument>, userModel: Model<UserDocument>, adminUserModel: Model<AdminUserDocument>, posterModel: Model<GeneratedPosterDocument>, notificationModel: Model<NotificationDocument>);
    private getUploadRoot;
    private estimateSizeFromUrl;
    private calculateTenantStorageMB;
    private calculateMetric;
    private formatMB;
    getTenantUsage(tenantId: string): Promise<{
        tenant: {
            id: Types.ObjectId;
            name: string;
            slug: string;
            status: import("../../shared/types").TenantStatus;
            leaderName: string | null;
        };
        plan: {
            id: Types.ObjectId;
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
        overallStatus: QuotaStatus;
        metrics: {
            citizens: MetricUsage;
            storageMB: MetricUsage;
            staffUsers: MetricUsage;
            postersThisMonth: MetricUsage;
            notificationsThisMonth: MetricUsage;
        };
        alerts: string[];
    }>;
    getOverview(query: QueryUsageOverviewDto): Promise<{
        summary: {
            totalTenants: number;
            normalCount: number;
            warningCount: number;
            restrictedCount: number;
        };
        items: {
            tenant: {
                id: Types.ObjectId;
                name: string;
                slug: string;
                status: import("../../shared/types").TenantStatus;
                leaderName: string | null;
            };
            plan: {
                id: Types.ObjectId;
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
            overallStatus: QuotaStatus;
            metrics: {
                citizens: MetricUsage;
                storageMB: MetricUsage;
                staffUsers: MetricUsage;
                postersThisMonth: MetricUsage;
                notificationsThisMonth: MetricUsage;
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
}

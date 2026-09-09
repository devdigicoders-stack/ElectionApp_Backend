import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, RenewSubscriptionDto, UpgradePlanDto, ExtendTrialDto, CancelSubscriptionDto, PauseSubscriptionDto, QuerySubscriptionsDto } from './subscription.dto';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class SubscriptionsSuperAdminController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(dto: CreateSubscriptionDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getStats(): Promise<{
        totalSubscriptions: number;
        active: any;
        trialing: any;
        expired: any;
        canceled: any;
        paused: any;
        pastDue: any;
        expiringIn15Days: number;
        totalRevenueCollected: any;
    }>;
    getExpiringSoon(days?: number): Promise<(import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findByTenant(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(query: QuerySubscriptionsDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    renew(id: string, dto: RenewSubscriptionDto, req: any): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    upgrade(id: string, dto: UpgradePlanDto, req: any): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        featuresProvisioned: string[];
    }>;
    extendTrial(id: string, dto: ExtendTrialDto, req: any): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    cancel(id: string, dto: CancelSubscriptionDto, req: any): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    pause(id: string, dto: PauseSubscriptionDto, req: any): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    resume(id: string, req: any): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, import("./subscription.schema").SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./subscription.schema").Subscription & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
export declare class SubscriptionsTenantController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getCurrent(req: TenantRequest): Promise<{
        hasActiveSubscription: boolean;
        tenantStatus: import("../../shared/types").TenantStatus;
        message: string;
        subscriptionId?: undefined;
        status?: undefined;
        plan?: undefined;
        billingCycle?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        daysRemaining?: undefined;
        isTrial?: undefined;
        autoRenew?: undefined;
        invoiceNumber?: undefined;
    } | {
        hasActiveSubscription: boolean;
        subscriptionId: import("mongoose").Types.ObjectId;
        status: import("./subscription.schema").SubscriptionStatus;
        plan: import("mongoose").Types.ObjectId;
        billingCycle: import("../plans/plan.schema").BillingCycle;
        startDate: Date;
        endDate: Date;
        daysRemaining: number;
        isTrial: boolean;
        autoRenew: boolean;
        invoiceNumber: string;
        tenantStatus?: undefined;
        message?: undefined;
    }>;
}

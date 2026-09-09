import { Model, Types } from 'mongoose';
import { Subscription, SubscriptionDocument, SubscriptionStatus } from './subscription.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { PlanDocument, BillingCycle } from '../plans/plan.schema';
import { TenantFeatureDocument } from '../features/tenant-feature.schema';
import { CreateSubscriptionDto, RenewSubscriptionDto, UpgradePlanDto, ExtendTrialDto, CancelSubscriptionDto, PauseSubscriptionDto, QuerySubscriptionsDto } from './subscription.dto';
import { TenantStatus } from '../../shared/types';
export declare class SubscriptionsService {
    private subscriptionModel;
    private tenantModel;
    private planModel;
    private featureModel;
    constructor(subscriptionModel: Model<SubscriptionDocument>, tenantModel: Model<TenantDocument>, planModel: Model<PlanDocument>, featureModel: Model<TenantFeatureDocument>);
    private generateInvoiceNumber;
    private syncTenantFeatures;
    create(dto: CreateSubscriptionDto, performedBy?: string): Promise<import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(query: QuerySubscriptionsDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    getExpiringSoon(days?: number): Promise<(import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findByTenant(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    renew(id: string, dto: RenewSubscriptionDto, performedBy?: string): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    upgrade(id: string, dto: UpgradePlanDto, performedBy?: string): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        featuresProvisioned: string[];
    }>;
    extendTrial(id: string, dto: ExtendTrialDto, performedBy?: string): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    cancel(id: string, dto: CancelSubscriptionDto, performedBy?: string): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    pause(id: string, dto: PauseSubscriptionDto, performedBy?: string): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    resume(id: string, performedBy?: string): Promise<{
        message: string;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, import("mongoose").DefaultSchemaOptions> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getCurrentForTenant(tenant: TenantDocument): Promise<{
        hasActiveSubscription: boolean;
        tenantStatus: TenantStatus;
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
        subscriptionId: Types.ObjectId;
        status: SubscriptionStatus;
        plan: Types.ObjectId;
        billingCycle: BillingCycle;
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

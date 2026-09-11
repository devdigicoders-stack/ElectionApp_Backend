import { SubscriptionStatus, PaymentMethod } from './subscription.schema';
import { BillingCycle } from '../plans/plan.schema';
export declare class CreateSubscriptionDto {
    tenantId: string;
    planId: string;
    durationMonths?: number;
    isTrial?: boolean;
    trialDays?: number;
    amountPaid?: number;
    billingCycle?: BillingCycle;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    notes?: string;
    taxRate?: number;
    isInterState?: boolean;
    clientGstin?: string;
    clientState?: string;
    clientAddress?: string;
    invoiceType?: string;
}
export declare class RenewSubscriptionDto {
    durationMonths: number;
    amountPaid?: number;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    notes?: string;
    taxRate?: number;
    isInterState?: boolean;
    clientGstin?: string;
    clientState?: string;
    clientAddress?: string;
}
export declare class UpgradePlanDto {
    newPlanId: string;
    durationMonths?: number;
    amountPaid?: number;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    notes?: string;
}
export declare class ExtendTrialDto {
    additionalDays: number;
    notes?: string;
}
export declare class CancelSubscriptionDto {
    reason: string;
    immediate?: boolean;
}
export declare class PauseSubscriptionDto {
    reason?: string;
}
export declare class QuerySubscriptionsDto {
    status?: SubscriptionStatus;
    tenantId?: string;
    planId?: string;
    expiringInDays?: number;
    search?: string;
    page?: number;
    limit?: number;
}

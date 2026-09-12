import { PaymentStatus, PaymentPurpose } from '../../shared/types';
export declare class CreatePaymentOrderDto {
    amount: number;
    purpose?: PaymentPurpose;
    membershipPlanId?: string;
    eventId?: string;
    notes?: Record<string, any>;
}
export declare class VerifyPaymentDto {
    orderId: string;
    paymentId: string;
    signature: string;
}
export declare class QueryPaymentsDto {
    status?: PaymentStatus;
    purpose?: PaymentPurpose;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export declare class RefundPaymentDto {
    amount?: number;
    reason: string;
}

export interface CreateOrderParams {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
}
export interface OrderResult {
    orderId: string;
    amount: number;
    currency: string;
    receipt: string;
    raw?: any;
}
export interface VerifySignatureParams {
    orderId: string;
    paymentId: string;
    signature: string;
}
export interface RefundParams {
    paymentId: string;
    amount?: number;
    notes?: Record<string, any>;
}
export interface IPaymentGateway {
    createOrder(params: CreateOrderParams): Promise<OrderResult>;
    verifySignature(params: VerifySignatureParams): boolean;
    fetchPayment(paymentId: string): Promise<any>;
    refund(params: RefundParams): Promise<any>;
    getPublicConfig(): {
        keyId: string;
        currency: string;
    };
}

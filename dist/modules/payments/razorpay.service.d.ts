import { ConfigService } from '@nestjs/config';
import { IPaymentGateway, CreateOrderParams, OrderResult, VerifySignatureParams, RefundParams } from './payment-gateway.interface';
export declare class RazorpayGatewayService implements IPaymentGateway {
    private readonly configService;
    private readonly logger;
    private razorpay;
    private keyId;
    private keySecret;
    constructor(configService: ConfigService);
    getPublicConfig(): {
        keyId: string;
        currency: string;
    };
    createOrder(params: CreateOrderParams): Promise<OrderResult>;
    generateSignature(orderId: string, paymentId: string): string;
    verifySignature(params: VerifySignatureParams): boolean;
    fetchPayment(paymentId: string): Promise<any>;
    refund(params: RefundParams): Promise<any>;
    verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean;
}

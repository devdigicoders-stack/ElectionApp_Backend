import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  IPaymentGateway,
  CreateOrderParams,
  OrderResult,
  VerifySignatureParams,
  RefundParams,
} from './payment-gateway.interface';

@Injectable()
export class RazorpayGatewayService implements IPaymentGateway {
  private readonly logger = new Logger(RazorpayGatewayService.name);
  private razorpay: Razorpay;
  private keyId: string;
  private keySecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keyId =
      this.configService.get<string>('RAZORPAY_KEY_ID') ||
      process.env.RAZORPAY_KEY_ID ||
      'rzp_test_6kz5nGEzi8uXRw';

    this.keySecret =
      this.configService.get<string>('RAZORPAY_KEY_SECRET') ||
      process.env.RAZORPAY_KEY_SECRET ||
      'SMtig3JkAqFP7nIMpODyyuAL';

    try {
      this.razorpay = new Razorpay({
        key_id: this.keyId,
        key_secret: this.keySecret,
      });
      this.logger.log(`Razorpay Gateway initialized with Key ID: ${this.keyId.slice(0, 8)}...`);
    } catch (err: any) {
      this.logger.error(`Failed to initialize Razorpay: ${err.message}`);
    }
  }

  getPublicConfig(): { keyId: string; currency: string } {
    return {
      keyId: this.keyId,
      currency: 'INR',
    };
  }

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    try {
      const options = {
        amount: Math.round(params.amount), // Amount in paise
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes || {},
      };

      const order: any = await this.razorpay.orders.create(options);

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        raw: order,
      };
    } catch (error: any) {
      this.logger.error(`Razorpay order creation failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to create Razorpay payment order: ${error.message || 'Gateway error'}`,
      );
    }
  }

  /**
   * Generates a valid HMAC-SHA256 signature for test / Postman simulation
   */
  generateSignature(orderId: string, paymentId: string): string {
    const body = `${orderId}|${paymentId}`;
    return crypto
      .createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');
  }

  verifySignature(params: VerifySignatureParams): boolean {
    try {
      const isTestMode =
        this.keyId.startsWith('rzp_test_') || process.env.NODE_ENV !== 'production';

      // 1. Check exact mathematical HMAC-SHA256 signature
      const body = `${params.orderId}|${params.paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(body)
        .digest('hex');

      if (expectedSignature === params.signature) {
        return true;
      }

      // 2. In Test Mode (rzp_test_), allow flexible simulation for Postman / Backend testing
      if (isTestMode) {
        // If paymentId starts with pay_test_ (mock payment ID generated during testing)
        if (params.paymentId && params.paymentId.startsWith('pay_test_')) {
          this.logger.log(
            `Verified payment signature in TEST mode for mock paymentId ("${params.paymentId}")`,
          );
          return true;
        }

        // If signature is any test bypass keyword
        if (
          params.signature === 'test' ||
          params.signature === 'auto' ||
          params.signature === 'test_signature' ||
          params.signature === 'bypass'
        ) {
          this.logger.log(
            `Verified payment signature in TEST mode via bypass token ("${params.signature}")`,
          );
          return true;
        }
      }

      return false;
    } catch (error: any) {
      this.logger.error(`Signature verification failed: ${error.message}`);
      return false;
    }
  }

  async fetchPayment(paymentId: string): Promise<any> {
    try {
      const isTestMode =
        this.keyId.startsWith('rzp_test_') || process.env.NODE_ENV !== 'production';

      if (isTestMode && paymentId && paymentId.startsWith('pay_test_')) {
        return {
          id: paymentId,
          entity: 'payment',
          amount: 50000,
          currency: 'INR',
          status: 'captured',
          method: 'upi',
          captured: true,
        };
      }

      return await this.razorpay.payments.fetch(paymentId);
    } catch (error: any) {
      const errMsg =
        error.error?.description || error.description || error.message || 'Razorpay Gateway Error';
      this.logger.error(`Failed to fetch Razorpay payment ${paymentId}: ${errMsg}`);
      throw new BadRequestException(`Could not retrieve payment details: ${errMsg}`);
    }
  }

  async refund(params: RefundParams): Promise<any> {
    try {
      const isTestMode =
        this.keyId.startsWith('rzp_test_') || process.env.NODE_ENV !== 'production';

      // If mock payment ID from test simulation (e.g. pay_test_123456)
      if (isTestMode && params.paymentId && params.paymentId.startsWith('pay_test_')) {
        this.logger.log(`Simulating successful refund for mock test payment ${params.paymentId}`);
        return {
          id: `rfnd_test_${Date.now()}`,
          entity: 'refund',
          amount: params.amount || 50000,
          currency: 'INR',
          payment_id: params.paymentId,
          status: 'processed',
          speed_processed: 'normal',
          created_at: Math.floor(Date.now() / 1000),
        };
      }

      const refundOptions: any = {};
      if (params.amount) {
        refundOptions.amount = Math.round(params.amount);
      }
      if (params.notes) {
        refundOptions.notes = params.notes;
      }

      return await this.razorpay.payments.refund(params.paymentId, refundOptions);
    } catch (error: any) {
      const errMsg =
        error.error?.description || error.description || error.message || 'Razorpay Gateway Error';
      this.logger.error(`Razorpay refund failed for ${params.paymentId}: ${errMsg}`);
      throw new BadRequestException(`Refund failed: ${errMsg}`);
    }
  }

  verifyWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error: any) {
      this.logger.error(`Webhook signature verification error: ${error.message}`);
      return false;
    }
  }
}

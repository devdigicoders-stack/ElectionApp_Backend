export interface CreateOrderParams {
  amount: number; // in paise (e.g. 10000 = Rs 100)
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
  amount?: number; // optional partial refund in paise
  notes?: Record<string, any>;
}

export interface IPaymentGateway {
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  verifySignature(params: VerifySignatureParams): boolean;
  fetchPayment(paymentId: string): Promise<any>;
  refund(params: RefundParams): Promise<any>;
  getPublicConfig(): { keyId: string; currency: string };
}

import { PaymentsService } from './payments.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { CreatePaymentOrderDto, VerifyPaymentDto, QueryPaymentsDto, RefundPaymentDto } from './payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getPublicConfig(): {
        keyId: string;
        currency: string;
    };
    getTestSignature(orderId: string, paymentId: string): {
        orderId: string;
        paymentId: string;
        signature: string;
        verifiedPayload: {
            orderId: string;
            paymentId: string;
            signature: string;
        };
    };
    createOrder(req: TenantRequest & {
        user: any;
    }, dto: CreatePaymentOrderDto): Promise<{
        orderId: string;
        amount: number;
        amountInPaise: number;
        currency: string;
        receipt: string;
        keyId: string;
        paymentDocId: import("mongoose").Types.ObjectId;
        notes: Record<string, any> | undefined;
        testHelp: {
            mockPaymentId: string;
            mockSignature: string;
            quickTestPayload: {
                orderId: string;
                paymentId: string;
                signature: string;
            };
        };
    }>;
    verifyPayment(req: TenantRequest & {
        user: any;
    }, dto: VerifyPaymentDto): Promise<{
        message: string;
        payment: import("mongoose").Document<unknown, {}, import("./payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    } | {
        message: string;
        payment: (import("./payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
    }>;
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
    findMine(req: TenantRequest & {
        user: any;
    }): Promise<(import("./payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAnalytics(req: TenantRequest): Promise<{
        summary: {
            totalRevenue: any;
            totalSuccessfulTransactions: any;
            averageTransactionAmount: number;
            pendingTransactions: number;
            failedTransactions: number;
            refundedTransactions: number;
        };
        byStatus: Record<string, {
            count: number;
            amount: number;
        }>;
        byPurpose: {
            purpose: any;
            count: any;
            totalAmount: any;
        }[];
        monthlyTrend: {
            month: string;
            revenue: any;
            count: any;
        }[];
    }>;
    findAll(req: TenantRequest, query: QueryPaymentsDto): Promise<{
        items: (import("./payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(req: TenantRequest, id: string): Promise<import("./payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    refund(req: TenantRequest & {
        user: any;
    }, id: string, dto: RefundPaymentDto): Promise<{
        message: string;
        payment: import("mongoose").Document<unknown, {}, import("./payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}

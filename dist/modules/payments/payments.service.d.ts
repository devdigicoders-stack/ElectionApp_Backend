import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';
import { MembershipDocument } from '../membership/membership.schema';
import { MembershipPlanDocument } from '../membership/membership-plan.schema';
import { UserDocument } from '../users/user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { RazorpayGatewayService } from './razorpay.service';
import { CreatePaymentOrderDto, VerifyPaymentDto, QueryPaymentsDto, RefundPaymentDto } from './payments.dto';
export declare class PaymentsService {
    private paymentModel;
    private membershipModel;
    private membershipPlanModel;
    private userModel;
    private readonly razorpayGateway;
    private readonly logger;
    constructor(paymentModel: Model<PaymentDocument>, membershipModel: Model<MembershipDocument>, membershipPlanModel: Model<MembershipPlanDocument>, userModel: Model<UserDocument>, razorpayGateway: RazorpayGatewayService);
    private generateReceiptNumber;
    getPublicConfig(): {
        keyId: string;
        currency: string;
    };
    createOrder(tenant: TenantDocument, userId: string, dto: CreatePaymentOrderDto): Promise<{
        orderId: string;
        amount: number;
        amountInPaise: number;
        currency: string;
        receipt: string;
        keyId: string;
        paymentDocId: Types.ObjectId;
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
    generateTestSignature(orderId: string, paymentId: string): {
        orderId: string;
        paymentId: string;
        signature: string;
        verifiedPayload: {
            orderId: string;
            paymentId: string;
            signature: string;
        };
    };
    verifyPayment(tenant: TenantDocument, userId: string, dto: VerifyPaymentDto): Promise<{
        message: string;
        payment: import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    } | {
        message: string;
        payment: (Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
    }>;
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
    findByUser(tenant: TenantDocument, userId: string): Promise<(Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(tenant: TenantDocument, id: string): Promise<Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(tenant: TenantDocument, queryDto: QueryPaymentsDto): Promise<{
        items: (Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    getAnalytics(tenant: TenantDocument): Promise<{
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
    refund(tenant: TenantDocument, id: string, dto: RefundPaymentDto, adminUser: any): Promise<{
        message: string;
        payment: import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}

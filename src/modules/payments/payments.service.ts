import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { MembershipPlan, MembershipPlanDocument } from '../membership/membership-plan.schema';
import { User, UserDocument } from '../users/user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { RazorpayGatewayService } from './razorpay.service';
import {
  PaymentStatus,
  PaymentPurpose,
  MembershipStatus,
} from '../../shared/types';
import {
  CreatePaymentOrderDto,
  VerifyPaymentDto,
  QueryPaymentsDto,
  RefundPaymentDto,
} from './payments.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(MembershipPlan.name) private membershipPlanModel: Model<MembershipPlanDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly razorpayGateway: RazorpayGatewayService,
  ) {}

  /**
   * Generates formatted Receipt Number: REC-YYYY-000001
   */
  private async generateReceiptNumber(tenantId: any): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.paymentModel.countDocuments({
      tenantId,
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59),
      },
    });
    return `REC-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  /**
   * 1. Get Public Gateway Config for Frontend
   */
  getPublicConfig() {
    return this.razorpayGateway.getPublicConfig();
  }

  /**
   * 2. Citizen / User: Create Payment Order on Razorpay
   */
  async createOrder(tenant: TenantDocument, userId: string, dto: CreatePaymentOrderDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const receipt = await this.generateReceiptNumber(tenant._id);
    const amountInPaise = Math.round(dto.amount * 100);

    const user = await this.userModel.findById(userId).select('name mobile email').lean();

    // Call Gateway Integration Layer
    const orderResult = await this.razorpayGateway.createOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        tenantId: tenant._id.toString(),
        tenantName: tenant.name,
        userId,
        userName: user?.name || 'Citizen',
        userMobile: user?.mobile || '',
        purpose: dto.purpose || PaymentPurpose.MEMBERSHIP_FEE,
        ...(dto.notes || {}),
      },
    });

    // Save initial pending payment record
    const payment = await this.paymentModel.create({
      tenantId: tenant._id,
      userId: new Types.ObjectId(userId),
      receipt,
      purpose: dto.purpose || PaymentPurpose.MEMBERSHIP_FEE,
      amount: dto.amount,
      amountInPaise,
      currency: 'INR',
      status: PaymentStatus.PENDING,
      gateway: 'razorpay',
      orderId: orderResult.orderId,
      membershipPlanId: dto.membershipPlanId ? new Types.ObjectId(dto.membershipPlanId) : undefined,
      eventId: dto.eventId ? new Types.ObjectId(dto.eventId) : undefined,
      notes: dto.notes || {},
      rawResponse: orderResult.raw || {},
    });

    return {
      orderId: orderResult.orderId,
      amount: dto.amount,
      amountInPaise,
      currency: 'INR',
      receipt,
      keyId: this.razorpayGateway.getPublicConfig().keyId,
      paymentDocId: payment._id,
      notes: payment.notes,
      testHelp: {
        mockPaymentId: `pay_test_${orderResult.orderId.replace('order_', '')}`,
        mockSignature: this.razorpayGateway.generateSignature(
          orderResult.orderId,
          `pay_test_${orderResult.orderId.replace('order_', '')}`,
        ),
        quickTestPayload: {
          orderId: orderResult.orderId,
          paymentId: `pay_test_${orderResult.orderId.replace('order_', '')}`,
          signature: 'test',
        },
      },
    };
  }

  /**
   * Helper: Generate HMAC-SHA256 signature for test/simulation
   */
  generateTestSignature(orderId: string, paymentId: string) {
    if (!orderId || !paymentId) {
      throw new BadRequestException('orderId and paymentId query parameters are required');
    }
    const signature = this.razorpayGateway.generateSignature(orderId, paymentId);
    return {
      orderId,
      paymentId,
      signature,
      verifiedPayload: {
        orderId,
        paymentId,
        signature,
      },
    };
  }

  /**
   * 3. Citizen / User: Verify Payment Signature & Auto-Activate Membership/Benefit
   */
  async verifyPayment(tenant: TenantDocument, userId: string, dto: VerifyPaymentDto) {
    const payment = await this.paymentModel.findOne({
      orderId: dto.orderId,
      tenantId: tenant._id,
    });

    if (!payment) {
      throw new NotFoundException(`Payment with order ID ${dto.orderId} not found`);
    }

    if (payment.status === PaymentStatus.SUCCESSFUL) {
      return {
        message: 'Payment has already been successfully verified',
        payment,
      };
    }

    // Verify HMAC-SHA256 signature
    const isValid = this.razorpayGateway.verifySignature({
      orderId: dto.orderId,
      paymentId: dto.paymentId,
      signature: dto.signature,
    });

    if (!isValid) {
      payment.status = PaymentStatus.FAILED;
      payment.failedAt = new Date();
      payment.failureReason = 'Payment signature mismatch / verification failed';
      await payment.save();
      throw new BadRequestException('Payment signature verification failed. Transaction cannot be confirmed.');
    }

    // Mark payment as successful
    payment.status = PaymentStatus.SUCCESSFUL;
    payment.paymentId = dto.paymentId;
    payment.signature = dto.signature;
    payment.paidAt = new Date();

    // ══════════════════════════════════════════════════════════════
    // AUTO-ACTIVATION HOOK (SRS Sec 21 & 22)
    // ══════════════════════════════════════════════════════════════
    if (payment.purpose === PaymentPurpose.MEMBERSHIP_FEE) {
      try {
        let plan: any = null;
        if (payment.membershipPlanId) {
          plan = await this.membershipPlanModel.findById(payment.membershipPlanId).lean();
        }

        const designation = plan?.name || 'Active Member';
        const validityDays = plan?.validityDays !== undefined ? plan.validityDays : 365;
        const expiresAt = validityDays > 0 ? new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000) : null;

        let membership = await this.membershipModel.findOne({
          tenantId: tenant._id,
          userId: payment.userId,
        });

        const year = new Date().getFullYear();
        const rand = Math.floor(100000 + Math.random() * 900000);
        const prefix = (tenant.slug || 'MEM').toUpperCase().slice(0, 4);
        const membershipNumber = `${prefix}-${year}-${rand}`;

        if (!membership) {
          membership = await this.membershipModel.create({
            tenantId: tenant._id,
            userId: payment.userId,
            planId: plan ? (plan._id as Types.ObjectId) : undefined,
            designation,
            status: MembershipStatus.APPROVED,
            membershipNumber,
            approvedAt: new Date(),
            expiresAt: expiresAt || undefined,
            cardIssuedAt: new Date(),
            paymentInfo: {
              amount: payment.amount,
              transactionId: dto.paymentId,
              paidAt: new Date(),
            },
          });
        } else {
          membership.status = MembershipStatus.APPROVED;
          if (plan) membership.planId = plan._id as Types.ObjectId;
          membership.designation = designation;
          if (!membership.membershipNumber) membership.membershipNumber = membershipNumber;
          membership.approvedAt = new Date();
          membership.expiresAt = expiresAt || undefined;
          membership.cardIssuedAt = new Date();
          membership.paymentInfo = {
            amount: payment.amount,
            transactionId: dto.paymentId,
            paidAt: new Date(),
          };
          await membership.save();
        }

        payment.membershipId = membership._id as Types.ObjectId;
      } catch (memErr: any) {
        this.logger.error(`Error auto-activating membership after payment: ${memErr.message}`);
      }
    }

    await payment.save();

    const populatedPayment = await this.paymentModel
      .findById(payment._id)
      .populate('userId', 'name mobile email')
      .lean();

    return {
      message: 'Payment verified and confirmed successfully',
      payment: populatedPayment,
    };
  }

  /**
   * 4. Webhook Handler for Razorpay Async Events
   */
  async handleWebhook(body: any, signature: string) {
    // Webhook event processing
    const event = body.event;
    const payload = body.payload;

    if (event === 'payment.captured' && payload?.payment?.entity) {
      const orderId = payload.payment.entity.order_id;
      const paymentId = payload.payment.entity.id;

      const payment = await this.paymentModel.findOne({ orderId });
      if (payment && payment.status !== PaymentStatus.SUCCESSFUL) {
        payment.status = PaymentStatus.SUCCESSFUL;
        payment.paymentId = paymentId;
        payment.paidAt = new Date();
        await payment.save();
        this.logger.log(`Payment order ${orderId} marked SUCCESSFUL via webhook`);
      }
    } else if (event === 'payment.failed' && payload?.payment?.entity) {
      const orderId = payload.payment.entity.order_id;
      const payment = await this.paymentModel.findOne({ orderId });
      if (payment && payment.status === PaymentStatus.PENDING) {
        payment.status = PaymentStatus.FAILED;
        payment.failedAt = new Date();
        payment.failureReason = payload.payment.entity.error_description || 'Payment failed';
        await payment.save();
        this.logger.warn(`Payment order ${orderId} marked FAILED via webhook`);
      }
    }

    return { status: 'ok' };
  }

  /**
   * 5. Citizen: View own payment history & receipts
   */
  async findByUser(tenant: TenantDocument, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.paymentModel
      .find({ tenantId: tenant._id, userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 6. Admin / Citizen: Get Single Payment Receipt Detail
   */
  async findOne(tenant: TenantDocument, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Payment record not found (invalid ID format)`);
    }

    const payment = await this.paymentModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('userId', 'name mobile email')
      .populate('membershipId', 'membershipNumber status')
      .lean();

    if (!payment) throw new NotFoundException('Payment record not found');
    return payment;
  }

  /**
   * 7. Admin: List and Search All Tenant Payments
   */
  async findAll(tenant: TenantDocument, queryDto: QueryPaymentsDto) {
    const page = Math.max(Number(queryDto.page) || 1, 1);
    const limit = Math.min(Math.max(Number(queryDto.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = { tenantId: tenant._id };

    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    if (queryDto.purpose) {
      filter.purpose = queryDto.purpose;
    }

    if (queryDto.startDate || queryDto.endDate) {
      filter.createdAt = {};
      if (queryDto.startDate) filter.createdAt.$gte = new Date(queryDto.startDate);
      if (queryDto.endDate) filter.createdAt.$lte = new Date(queryDto.endDate);
    }

    if (queryDto.search) {
      const regex = { $regex: queryDto.search.trim(), $options: 'i' };
      filter.$or = [{ receipt: regex }, { orderId: regex }, { paymentId: regex }];
    }

    const [items, total] = await Promise.all([
      this.paymentModel
        .find(filter)
        .populate('userId', 'name mobile email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.paymentModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 8. Admin: Comprehensive Payment & Financial Analytics
   */
  async getAnalytics(tenant: TenantDocument) {
    const tenantObjId = new Types.ObjectId(tenant._id.toString());

    const [statusStats, purposeStats, totalVolumeStats, monthlyStats] = await Promise.all([
      // Status breakdown
      this.paymentModel.aggregate([
        { $match: { tenantId: tenantObjId } },
        { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
      ]),

      // Purpose breakdown
      this.paymentModel.aggregate([
        { $match: { tenantId: tenantObjId, status: PaymentStatus.SUCCESSFUL } },
        { $group: { _id: '$purpose', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
      ]),

      // Total collected volume
      this.paymentModel.aggregate([
        { $match: { tenantId: tenantObjId, status: PaymentStatus.SUCCESSFUL } },
        {
          $group: {
            _id: null,
            totalCollected: { $sum: '$amount' },
            totalTransactions: { $sum: 1 },
            avgTransaction: { $avg: '$amount' },
          },
        },
      ]),

      // Monthly Trend (Past 12 Months)
      this.paymentModel.aggregate([
        {
          $match: {
            tenantId: tenantObjId,
            status: PaymentStatus.SUCCESSFUL,
            createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const byStatus: Record<string, { count: number; amount: number }> = {
      [PaymentStatus.PENDING]: { count: 0, amount: 0 },
      [PaymentStatus.SUCCESSFUL]: { count: 0, amount: 0 },
      [PaymentStatus.FAILED]: { count: 0, amount: 0 },
      [PaymentStatus.REFUNDED]: { count: 0, amount: 0 },
    };

    statusStats.forEach((s) => {
      byStatus[s._id] = { count: s.count, amount: s.totalAmount };
    });

    const summary = totalVolumeStats[0] || {
      totalCollected: 0,
      totalTransactions: 0,
      avgTransaction: 0,
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyTrend = monthlyStats.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      revenue: m.revenue,
      count: m.count,
    }));

    return {
      summary: {
        totalRevenue: summary.totalCollected,
        totalSuccessfulTransactions: summary.totalTransactions,
        averageTransactionAmount: Math.round(summary.avgTransaction * 100) / 100,
        pendingTransactions: byStatus[PaymentStatus.PENDING].count,
        failedTransactions: byStatus[PaymentStatus.FAILED].count,
        refundedTransactions: byStatus[PaymentStatus.REFUNDED].count,
      },
      byStatus,
      byPurpose: purposeStats.map((p) => ({
        purpose: p._id,
        count: p.count,
        totalAmount: p.totalAmount,
      })),
      monthlyTrend: formattedMonthlyTrend,
    };
  }

  /**
   * 9. Admin: Process Refund
   */
  async refund(tenant: TenantDocument, id: string, dto: RefundPaymentDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Payment record not found');
    }

    const payment = await this.paymentModel.findOne({ _id: id, tenantId: tenant._id });
    if (!payment) throw new NotFoundException('Payment record not found');

    if (payment.status !== PaymentStatus.SUCCESSFUL) {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    if (!payment.paymentId) {
      throw new BadRequestException('Missing payment ID for gateway refund');
    }

    const refundAmountInPaise = dto.amount ? Math.round(dto.amount * 100) : undefined;

    // Call Gateway refund
    const refundResult = await this.razorpayGateway.refund({
      paymentId: payment.paymentId,
      amount: refundAmountInPaise,
      notes: {
        reason: dto.reason,
        refundedBy: adminUser?.sub || adminUser?.id,
      },
    });

    payment.status = PaymentStatus.REFUNDED;
    payment.refundDetails = {
      refundId: refundResult.id,
      amount: dto.amount || payment.amount,
      refundedAt: new Date(),
      reason: dto.reason,
    };

    await payment.save();
    return {
      message: 'Payment refunded successfully',
      payment,
    };
  }
}

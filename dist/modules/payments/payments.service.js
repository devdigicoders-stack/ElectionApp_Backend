"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./payment.schema");
const membership_schema_1 = require("../membership/membership.schema");
const membership_plan_schema_1 = require("../membership/membership-plan.schema");
const user_schema_1 = require("../users/user.schema");
const razorpay_service_1 = require("./razorpay.service");
const types_1 = require("../../shared/types");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(paymentModel, membershipModel, membershipPlanModel, userModel, razorpayGateway) {
        this.paymentModel = paymentModel;
        this.membershipModel = membershipModel;
        this.membershipPlanModel = membershipPlanModel;
        this.userModel = userModel;
        this.razorpayGateway = razorpayGateway;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async generateReceiptNumber(tenantId) {
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
    getPublicConfig() {
        return this.razorpayGateway.getPublicConfig();
    }
    async createOrder(tenant, userId, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const receipt = await this.generateReceiptNumber(tenant._id);
        const amountInPaise = Math.round(dto.amount * 100);
        const user = await this.userModel.findById(userId).select('name mobile email').lean();
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
                purpose: dto.purpose || types_1.PaymentPurpose.MEMBERSHIP_FEE,
                ...(dto.notes || {}),
            },
        });
        const payment = await this.paymentModel.create({
            tenantId: tenant._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            receipt,
            purpose: dto.purpose || types_1.PaymentPurpose.MEMBERSHIP_FEE,
            amount: dto.amount,
            amountInPaise,
            currency: 'INR',
            status: types_1.PaymentStatus.PENDING,
            gateway: 'razorpay',
            orderId: orderResult.orderId,
            membershipPlanId: dto.membershipPlanId ? new mongoose_2.Types.ObjectId(dto.membershipPlanId) : undefined,
            eventId: dto.eventId ? new mongoose_2.Types.ObjectId(dto.eventId) : undefined,
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
                mockSignature: this.razorpayGateway.generateSignature(orderResult.orderId, `pay_test_${orderResult.orderId.replace('order_', '')}`),
                quickTestPayload: {
                    orderId: orderResult.orderId,
                    paymentId: `pay_test_${orderResult.orderId.replace('order_', '')}`,
                    signature: 'test',
                },
            },
        };
    }
    generateTestSignature(orderId, paymentId) {
        if (!orderId || !paymentId) {
            throw new common_1.BadRequestException('orderId and paymentId query parameters are required');
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
    async verifyPayment(tenant, userId, dto) {
        const payment = await this.paymentModel.findOne({
            orderId: dto.orderId,
            tenantId: tenant._id,
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with order ID ${dto.orderId} not found`);
        }
        if (payment.status === types_1.PaymentStatus.SUCCESSFUL) {
            return {
                message: 'Payment has already been successfully verified',
                payment,
            };
        }
        const isValid = this.razorpayGateway.verifySignature({
            orderId: dto.orderId,
            paymentId: dto.paymentId,
            signature: dto.signature,
        });
        if (!isValid) {
            payment.status = types_1.PaymentStatus.FAILED;
            payment.failedAt = new Date();
            payment.failureReason = 'Payment signature mismatch / verification failed';
            await payment.save();
            throw new common_1.BadRequestException('Payment signature verification failed. Transaction cannot be confirmed.');
        }
        payment.status = types_1.PaymentStatus.SUCCESSFUL;
        payment.paymentId = dto.paymentId;
        payment.signature = dto.signature;
        payment.paidAt = new Date();
        if (payment.purpose === types_1.PaymentPurpose.MEMBERSHIP_FEE) {
            try {
                let plan = null;
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
                        planId: plan ? plan._id : undefined,
                        designation,
                        status: types_1.MembershipStatus.APPROVED,
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
                }
                else {
                    membership.status = types_1.MembershipStatus.APPROVED;
                    if (plan)
                        membership.planId = plan._id;
                    membership.designation = designation;
                    if (!membership.membershipNumber)
                        membership.membershipNumber = membershipNumber;
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
                payment.membershipId = membership._id;
            }
            catch (memErr) {
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
    async handleWebhook(body, signature) {
        const event = body.event;
        const payload = body.payload;
        if (event === 'payment.captured' && payload?.payment?.entity) {
            const orderId = payload.payment.entity.order_id;
            const paymentId = payload.payment.entity.id;
            const payment = await this.paymentModel.findOne({ orderId });
            if (payment && payment.status !== types_1.PaymentStatus.SUCCESSFUL) {
                payment.status = types_1.PaymentStatus.SUCCESSFUL;
                payment.paymentId = paymentId;
                payment.paidAt = new Date();
                await payment.save();
                this.logger.log(`Payment order ${orderId} marked SUCCESSFUL via webhook`);
            }
        }
        else if (event === 'payment.failed' && payload?.payment?.entity) {
            const orderId = payload.payment.entity.order_id;
            const payment = await this.paymentModel.findOne({ orderId });
            if (payment && payment.status === types_1.PaymentStatus.PENDING) {
                payment.status = types_1.PaymentStatus.FAILED;
                payment.failedAt = new Date();
                payment.failureReason = payload.payment.entity.error_description || 'Payment failed';
                await payment.save();
                this.logger.warn(`Payment order ${orderId} marked FAILED via webhook`);
            }
        }
        return { status: 'ok' };
    }
    async findByUser(tenant, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        return this.paymentModel
            .find({ tenantId: tenant._id, userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .lean();
    }
    async findOne(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Payment record not found (invalid ID format)`);
        }
        const payment = await this.paymentModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate('userId', 'name mobile email')
            .populate('membershipId', 'membershipNumber status')
            .lean();
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        return payment;
    }
    async findAll(tenant, queryDto) {
        const page = Math.max(Number(queryDto.page) || 1, 1);
        const limit = Math.min(Math.max(Number(queryDto.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const filter = { tenantId: tenant._id };
        if (queryDto.status) {
            filter.status = queryDto.status;
        }
        if (queryDto.purpose) {
            filter.purpose = queryDto.purpose;
        }
        if (queryDto.startDate || queryDto.endDate) {
            filter.createdAt = {};
            if (queryDto.startDate)
                filter.createdAt.$gte = new Date(queryDto.startDate);
            if (queryDto.endDate)
                filter.createdAt.$lte = new Date(queryDto.endDate);
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
    async getAnalytics(tenant) {
        const tenantObjId = new mongoose_2.Types.ObjectId(tenant._id.toString());
        const [statusStats, purposeStats, totalVolumeStats, monthlyStats] = await Promise.all([
            this.paymentModel.aggregate([
                { $match: { tenantId: tenantObjId } },
                { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
            ]),
            this.paymentModel.aggregate([
                { $match: { tenantId: tenantObjId, status: types_1.PaymentStatus.SUCCESSFUL } },
                { $group: { _id: '$purpose', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
            ]),
            this.paymentModel.aggregate([
                { $match: { tenantId: tenantObjId, status: types_1.PaymentStatus.SUCCESSFUL } },
                {
                    $group: {
                        _id: null,
                        totalCollected: { $sum: '$amount' },
                        totalTransactions: { $sum: 1 },
                        avgTransaction: { $avg: '$amount' },
                    },
                },
            ]),
            this.paymentModel.aggregate([
                {
                    $match: {
                        tenantId: tenantObjId,
                        status: types_1.PaymentStatus.SUCCESSFUL,
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
        const byStatus = {
            [types_1.PaymentStatus.PENDING]: { count: 0, amount: 0 },
            [types_1.PaymentStatus.SUCCESSFUL]: { count: 0, amount: 0 },
            [types_1.PaymentStatus.FAILED]: { count: 0, amount: 0 },
            [types_1.PaymentStatus.REFUNDED]: { count: 0, amount: 0 },
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
                pendingTransactions: byStatus[types_1.PaymentStatus.PENDING].count,
                failedTransactions: byStatus[types_1.PaymentStatus.FAILED].count,
                refundedTransactions: byStatus[types_1.PaymentStatus.REFUNDED].count,
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
    async refund(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Payment record not found');
        }
        const payment = await this.paymentModel.findOne({ _id: id, tenantId: tenant._id });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        if (payment.status !== types_1.PaymentStatus.SUCCESSFUL) {
            throw new common_1.BadRequestException('Only successful payments can be refunded');
        }
        if (!payment.paymentId) {
            throw new common_1.BadRequestException('Missing payment ID for gateway refund');
        }
        const refundAmountInPaise = dto.amount ? Math.round(dto.amount * 100) : undefined;
        const refundResult = await this.razorpayGateway.refund({
            paymentId: payment.paymentId,
            amount: refundAmountInPaise,
            notes: {
                reason: dto.reason,
                refundedBy: adminUser?.sub || adminUser?.id,
            },
        });
        payment.status = types_1.PaymentStatus.REFUNDED;
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(2, (0, mongoose_1.InjectModel)(membership_plan_schema_1.MembershipPlan.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        razorpay_service_1.RazorpayGatewayService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
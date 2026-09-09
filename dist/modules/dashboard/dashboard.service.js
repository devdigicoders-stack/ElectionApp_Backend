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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_schema_1 = require("../tenants/tenant.schema");
const user_schema_1 = require("../users/user.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const work_schema_1 = require("../works/work.schema");
const event_schema_1 = require("../events/event.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const subscription_schema_1 = require("../subscriptions/subscription.schema");
const plan_schema_1 = require("../plans/plan.schema");
const types_1 = require("../../shared/types");
let DashboardService = class DashboardService {
    constructor(userModel, complaintModel, workModel, eventModel, membershipModel, volunteerModel, tenantModel, subscriptionModel, planModel) {
        this.userModel = userModel;
        this.complaintModel = complaintModel;
        this.workModel = workModel;
        this.eventModel = eventModel;
        this.membershipModel = membershipModel;
        this.volunteerModel = volunteerModel;
        this.tenantModel = tenantModel;
        this.subscriptionModel = subscriptionModel;
        this.planModel = planModel;
    }
    async getSummary(tenant) {
        const tenantId = tenant._id;
        const [totalUsers, totalComplaints, pendingComplaints, resolvedComplaints, totalWorks, completedWorks, upcomingEvents, totalMembers, pendingMemberships, totalVolunteers,] = await Promise.all([
            this.userModel.countDocuments({ tenantId }),
            this.complaintModel.countDocuments({ tenantId }),
            this.complaintModel.countDocuments({ tenantId, status: { $in: ['submitted', 'under_review', 'assigned'] } }),
            this.complaintModel.countDocuments({ tenantId, status: 'resolved' }),
            this.workModel.countDocuments({ tenantId }),
            this.workModel.countDocuments({ tenantId, status: 'completed' }),
            this.eventModel.countDocuments({ tenantId, startDate: { $gte: new Date() }, isPublished: true }),
            this.membershipModel.countDocuments({ tenantId, status: 'approved' }),
            this.membershipModel.countDocuments({ tenantId, status: 'pending' }),
            this.volunteerModel.countDocuments({ tenantId, status: 'active' }),
        ]);
        const recentComplaints = await this.complaintModel
            .find({ tenantId })
            .populate('userId', 'name mobile')
            .populate('areaId', 'name')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('complaintNumber title status category createdAt');
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const complaintTrend = await this.complaintModel.aggregate([
            { $match: { tenantId, createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);
        return {
            stats: {
                users: totalUsers,
                complaints: { total: totalComplaints, pending: pendingComplaints, resolved: resolvedComplaints },
                works: { total: totalWorks, completed: completedWorks },
                events: { upcoming: upcomingEvents },
                membership: { approved: totalMembers, pending: pendingMemberships },
                volunteers: totalVolunteers,
            },
            recentComplaints,
            complaintTrend,
        };
    }
    async getSuperAdminStats() {
        const [totalTenants, activeTenants, trialTenants, suspendedTenants,] = await Promise.all([
            this.tenantModel.countDocuments(),
            this.tenantModel.countDocuments({ status: types_1.TenantStatus.ACTIVE }),
            this.tenantModel.countDocuments({ status: types_1.TenantStatus.TRIAL }),
            this.tenantModel.countDocuments({ status: types_1.TenantStatus.SUSPENDED }),
        ]);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [totalCitizens, activeCitizens, completedProfiles, newCitizensLast30Days,] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ isActive: true }),
            this.userModel.countDocuments({ isProfileComplete: true }),
            this.userModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        ]);
        const [totalComplaints, resolvedComplaints, pendingComplaints,] = await Promise.all([
            this.complaintModel.countDocuments(),
            this.complaintModel.countDocuments({ status: 'resolved' }),
            this.complaintModel.countDocuments({ status: { $in: ['submitted', 'under_review', 'in_progress', 'assigned'] } }),
        ]);
        const resolutionRate = totalComplaints > 0
            ? `${((resolvedComplaints / totalComplaints) * 100).toFixed(1)}%`
            : '0.0%';
        const [totalSubscriptions, activeSubscriptions, trialingSubscriptions, expiredSubscriptions, canceledSubscriptions, pausedSubscriptions,] = await Promise.all([
            this.subscriptionModel.countDocuments(),
            this.subscriptionModel.countDocuments({ status: subscription_schema_1.SubscriptionStatus.ACTIVE }),
            this.subscriptionModel.countDocuments({ status: subscription_schema_1.SubscriptionStatus.TRIALING }),
            this.subscriptionModel.countDocuments({ status: subscription_schema_1.SubscriptionStatus.EXPIRED }),
            this.subscriptionModel.countDocuments({ status: subscription_schema_1.SubscriptionStatus.CANCELED }),
            this.subscriptionModel.countDocuments({ status: subscription_schema_1.SubscriptionStatus.PAUSED }),
        ]);
        const revenueAgg = await this.subscriptionModel.aggregate([
            { $unwind: '$invoices' },
            { $match: { 'invoices.status': 'paid' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$invoices.amount' },
                    paidInvoicesCount: { $sum: 1 },
                },
            },
        ]);
        const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
        const paidInvoicesCount = revenueAgg[0]?.paidInvoicesCount || 0;
        const [totalPlans, activePlans] = await Promise.all([
            this.planModel.countDocuments({ isDeleted: { $ne: true } }),
            this.planModel.countDocuments({ isActive: true, isDeleted: { $ne: true } }),
        ]);
        const recentTenants = await this.tenantModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('planId', 'name code billingCycle price')
            .select('name slug status branding.leaderName customDomain createdAt planId');
        const recentInvoicesAgg = await this.subscriptionModel.aggregate([
            { $unwind: '$invoices' },
            { $sort: { 'invoices.issueDate': -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'tenants',
                    localField: 'tenantId',
                    foreignField: '_id',
                    as: 'tenant',
                },
            },
            { $unwind: { path: '$tenant', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: '$invoices._id',
                    invoiceNumber: '$invoices.invoiceNumber',
                    tenantId: 1,
                    tenantName: '$tenant.name',
                    tenantSlug: '$tenant.slug',
                    amount: '$invoices.amount',
                    currency: '$invoices.currency',
                    status: '$invoices.status',
                    paidAt: '$invoices.paidAt',
                    issueDate: '$invoices.issueDate',
                    paymentMethod: '$invoices.paymentMethod',
                },
            },
        ]);
        const estimatedStorageBytes = (totalCitizens * 25000) + (totalComplaints * 1500000);
        const estimatedTotalMB = Math.round(estimatedStorageBytes / (1024 * 1024));
        const estimatedTotalFormatted = estimatedTotalMB > 1024
            ? `${(estimatedTotalMB / 1024).toFixed(2)} GB`
            : `${estimatedTotalMB} MB`;
        return {
            tenants: {
                total: totalTenants,
                active: activeTenants,
                trial: trialTenants,
                suspended: suspendedTenants,
            },
            subscriptions: {
                total: totalSubscriptions,
                active: activeSubscriptions,
                trialing: trialingSubscriptions,
                expired: expiredSubscriptions,
                canceled: canceledSubscriptions,
                paused: pausedSubscriptions,
                totalRevenue,
                paidInvoicesCount,
            },
            citizens: {
                total: totalCitizens,
                active: activeCitizens,
                profilesCompleted: completedProfiles,
                newInLast30Days: newCitizensLast30Days,
            },
            complaints: {
                total: totalComplaints,
                resolved: resolvedComplaints,
                pending: pendingComplaints,
                resolutionRate,
            },
            plans: {
                total: totalPlans,
                active: activePlans,
            },
            storage: {
                estimatedMB: estimatedTotalMB,
                formatted: estimatedTotalFormatted,
            },
            recentTenants,
            recentInvoices: recentInvoicesAgg,
        };
    }
    async getSuperAdminGrowth(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);
        const tenantGrowth = await this.tenantModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const citizenGrowth = await this.userModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const complaintGrowth = await this.complaintModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const revenueTrend = await this.subscriptionModel.aggregate([
            { $unwind: '$invoices' },
            {
                $match: {
                    'invoices.status': 'paid',
                    'invoices.paidAt': { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$invoices.paidAt' } },
                    amount: { $sum: '$invoices.amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return {
            periodDays: days,
            startDate,
            tenantGrowth: tenantGrowth.map(t => ({ date: t._id, count: t.count })),
            citizenGrowth: citizenGrowth.map(c => ({ date: c._id, count: c.count })),
            complaintGrowth: complaintGrowth.map(cm => ({ date: cm._id, count: cm.count })),
            revenueTrend: revenueTrend.map(r => ({ date: r._id, amount: r.amount, invoiceCount: r.count })),
        };
    }
    async getSuperAdminTenantsOverview(params) {
        const { page, limit, status, search } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
                { 'branding.leaderName': { $regex: search, $options: 'i' } },
            ];
        }
        const [total, tenants] = await Promise.all([
            this.tenantModel.countDocuments(query),
            this.tenantModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('planId', 'name code billingCycle price')
                .lean(),
        ]);
        const tenantIds = tenants.map(t => t._id);
        const [userCounts, complaintCounts, subscriptions] = await Promise.all([
            this.userModel.aggregate([
                { $match: { tenantId: { $in: tenantIds } } },
                { $group: { _id: '$tenantId', count: { $sum: 1 } } },
            ]),
            this.complaintModel.aggregate([
                { $match: { tenantId: { $in: tenantIds } } },
                { $group: { _id: '$tenantId', count: { $sum: 1 } } },
            ]),
            this.subscriptionModel.find({ tenantId: { $in: tenantIds } }).lean(),
        ]);
        const userCountMap = new Map(userCounts.map(u => [u._id.toString(), u.count]));
        const complaintCountMap = new Map(complaintCounts.map(c => [c._id.toString(), c.count]));
        const subscriptionMap = new Map(subscriptions.map(s => [s.tenantId.toString(), s]));
        const items = tenants.map(t => {
            const sub = subscriptionMap.get(t._id.toString());
            const citizenCount = userCountMap.get(t._id.toString()) || 0;
            const complaintCount = complaintCountMap.get(t._id.toString()) || 0;
            return {
                _id: t._id,
                name: t.name,
                slug: t.slug,
                status: t.status,
                customDomain: t.customDomain || null,
                leaderName: t.branding?.leaderName || null,
                createdAt: t.createdAt,
                plan: t.planId || null,
                subscription: sub
                    ? {
                        status: sub.status,
                        startDate: sub.startDate,
                        endDate: sub.endDate,
                        trialEndsAt: sub.trialEndsAt,
                    }
                    : null,
                metrics: {
                    totalCitizens: citizenCount,
                    totalComplaints: complaintCount,
                },
            };
        });
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(complaint_schema_1.Complaint.name)),
    __param(2, (0, mongoose_1.InjectModel)(work_schema_1.Work.name)),
    __param(3, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(4, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(5, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(6, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(7, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(8, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
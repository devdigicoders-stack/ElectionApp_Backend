"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
        const [totalCitizens, activeCitizens, completedProfiles, newCitizensLast30Days, activeLast30Days,] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ isActive: true, status: { $ne: 'blocked' } }),
            this.userModel.countDocuments({ isProfileComplete: true }),
            this.userModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            this.userModel.countDocuments({
                $or: [
                    { lastActiveAt: { $gte: thirtyDaysAgo } },
                    { updatedAt: { $gte: thirtyDaysAgo } },
                    { createdAt: { $gte: thirtyDaysAgo } },
                ],
            }),
        ]);
        const activeRateNum = totalCitizens > 0
            ? Math.round((activeCitizens / totalCitizens) * 100)
            : 100;
        const activeRate = `${activeRateNum}%`;
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
        let physicalUploadsBytes = 0;
        let uploadedFilesCount = 0;
        const uploadRoot = path.join(process.cwd(), 'uploads');
        if (fs.existsSync(uploadRoot)) {
            const scanDir = (dir) => {
                try {
                    const entries = fs.readdirSync(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        const fullPath = path.join(dir, entry.name);
                        if (entry.isDirectory()) {
                            scanDir(fullPath);
                        }
                        else if (entry.isFile()) {
                            physicalUploadsBytes += fs.statSync(fullPath).size;
                            uploadedFilesCount++;
                        }
                    }
                }
                catch {
                }
            };
            scanDir(uploadRoot);
        }
        const physicalUploadsMB = Math.round((physicalUploadsBytes / (1024 * 1024)) * 100) / 100;
        const estimatedDbBytes = (totalCitizens * 8000) + (totalComplaints * 25000);
        const estimatedDbMB = Math.round((estimatedDbBytes / (1024 * 1024)) * 100) / 100;
        const totalUsedMB = Math.round((physicalUploadsMB + estimatedDbMB) * 100) / 100;
        const totalUsedBytes = physicalUploadsBytes + estimatedDbBytes;
        const formatSize = (mb) => {
            if (mb >= 1024)
                return `${(mb / 1024).toFixed(2)} GB`;
            return `${mb.toFixed(2)} MB`;
        };
        const activeSubs = await this.subscriptionModel
            .find({ status: { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING] } })
            .populate('planId');
        let totalAllocatedMB = 0;
        let hasUnlimitedStorage = false;
        for (const sub of activeSubs) {
            const plan = sub.planId;
            const limit = plan?.limits?.maxStorageMB;
            if (limit === -1) {
                hasUnlimitedStorage = true;
            }
            else if (typeof limit === 'number' && limit > 0) {
                totalAllocatedMB += limit;
            }
        }
        const baselineCapacityMB = totalAllocatedMB > 0 ? totalAllocatedMB : 51200;
        const percentUsed = Math.min(Math.round((totalUsedMB / baselineCapacityMB) * 1000) / 10, 100);
        const storageStatus = percentUsed >= 90 ? 'critical' : percentUsed >= 75 ? 'warning' : 'normal';
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
                registered: totalCitizens,
                active: activeCitizens,
                inactive: Math.max(totalCitizens - activeCitizens, 0),
                activeRate,
                activeRateNum,
                activeLast30Days,
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
                usedMB: totalUsedMB,
                usedBytes: totalUsedBytes,
                usedFormatted: formatSize(totalUsedMB),
                physicalUploadsMB,
                physicalUploadsFormatted: formatSize(physicalUploadsMB),
                databaseMB: estimatedDbMB,
                databaseFormatted: formatSize(estimatedDbMB),
                fileCount: uploadedFilesCount,
                allocatedMB: totalAllocatedMB > 0 ? totalAllocatedMB : (hasUnlimitedStorage ? -1 : 51200),
                allocatedFormatted: totalAllocatedMB > 0 ? formatSize(totalAllocatedMB) : (hasUnlimitedStorage ? 'Unlimited' : '50.00 GB'),
                percentUsed,
                status: storageStatus,
                estimatedMB: totalUsedMB,
                formatted: formatSize(totalUsedMB),
            },
            alerts: await this.getSuperAdminAlerts({
                platformStoragePercent: percentUsed,
                platformStorageFormatted: formatSize(totalUsedMB),
                platformAllocatedFormatted: totalAllocatedMB > 0 ? formatSize(totalAllocatedMB) : (hasUnlimitedStorage ? 'Unlimited' : '50.00 GB'),
            }),
            recentTenants,
            recentInvoices: recentInvoicesAgg,
        };
    }
    async getSuperAdminAlerts(options) {
        const alerts = [];
        const now = new Date();
        const subscriptions = await this.subscriptionModel
            .find({
            status: { $in: [subscription_schema_1.SubscriptionStatus.ACTIVE, subscription_schema_1.SubscriptionStatus.TRIALING, subscription_schema_1.SubscriptionStatus.EXPIRED] },
        })
            .populate('tenantId')
            .populate('planId')
            .lean();
        for (const sub of subscriptions) {
            const tenant = sub.tenantId;
            if (!tenant)
                continue;
            const tenantName = tenant.name || 'Unnamed Client';
            const tenantSlug = tenant.slug || '';
            const tenantId = tenant._id ? tenant._id.toString() : '';
            if (sub.endDate) {
                const endDate = new Date(sub.endDate);
                const diffMs = endDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                const isTrial = sub.status === subscription_schema_1.SubscriptionStatus.TRIALING;
                const formattedDate = endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                if (diffDays < 0 && Math.abs(diffDays) <= 30) {
                    alerts.push({
                        id: `sub-exp-${sub._id}`,
                        category: 'subscription',
                        severity: 'critical',
                        title: `${isTrial ? 'Trial' : 'Plan'} Expired (${Math.abs(diffDays)}d ago)`,
                        message: `${isTrial ? 'Free trial' : 'Subscription'} for "${tenantName}" expired on ${formattedDate}. Tenant services require renewal.`,
                        timestamp: now.toISOString(),
                        tenantId,
                        tenantName,
                        tenantSlug,
                        actionType: 'RENEW',
                        actionLabel: isTrial ? 'Convert to Paid' : 'Renew Subscription',
                        actionUrl: `/clients`,
                        metadata: { diffDays, isTrial, endDate: sub.endDate },
                    });
                }
                else if (diffDays >= 0 && diffDays <= 7) {
                    alerts.push({
                        id: `sub-exp-crit-${sub._id}`,
                        category: 'subscription',
                        severity: 'critical',
                        title: `${isTrial ? 'Trial' : 'Plan'} Expiring in ${diffDays} Day${diffDays === 1 ? '' : 's'}`,
                        message: `${isTrial ? 'Trial' : 'Subscription'} for "${tenantName}" will expire on ${formattedDate}. Renew before lockout.`,
                        timestamp: now.toISOString(),
                        tenantId,
                        tenantName,
                        tenantSlug,
                        actionType: isTrial ? 'EXTEND_TRIAL' : 'RENEW',
                        actionLabel: isTrial ? 'Extend / Upgrade' : 'Renew Plan',
                        actionUrl: `/clients`,
                        metadata: { diffDays, isTrial, endDate: sub.endDate },
                    });
                }
                else if (diffDays > 7 && diffDays <= 15) {
                    alerts.push({
                        id: `sub-exp-warn-${sub._id}`,
                        category: 'subscription',
                        severity: 'warning',
                        title: `Renewal Approaching (${diffDays} Days Left)`,
                        message: `Tenant "${tenantName}" (${tenantSlug}) subscription ends on ${formattedDate}.`,
                        timestamp: now.toISOString(),
                        tenantId,
                        tenantName,
                        tenantSlug,
                        actionType: 'RENEW',
                        actionLabel: 'Send Renewal Notice',
                        actionUrl: `/clients`,
                        metadata: { diffDays, isTrial, endDate: sub.endDate },
                    });
                }
            }
            const plan = sub.planId;
            const maxCitizens = plan?.limits?.maxCitizens;
            if (typeof maxCitizens === 'number' && maxCitizens > 0 && tenant._id) {
                const citizenCount = await this.userModel.countDocuments({ tenantId: tenant._id });
                const usagePct = Math.round((citizenCount / maxCitizens) * 100);
                if (citizenCount >= maxCitizens) {
                    alerts.push({
                        id: `quota-full-${tenant._id}`,
                        category: 'storage',
                        severity: 'critical',
                        title: `Citizen Quota 100% Full (${citizenCount}/${maxCitizens})`,
                        message: `Tenant "${tenantName}" has consumed all citizen registration slots. New citizen registrations will be blocked.`,
                        timestamp: now.toISOString(),
                        tenantId,
                        tenantName,
                        tenantSlug,
                        actionType: 'UPGRADE_PLAN',
                        actionLabel: 'Upgrade Plan Limit',
                        actionUrl: `/plans`,
                        metadata: { citizenCount, maxCitizens, usagePct },
                    });
                }
                else if (usagePct >= 85) {
                    alerts.push({
                        id: `quota-high-${tenant._id}`,
                        category: 'storage',
                        severity: 'warning',
                        title: `High Citizen Capacity (${usagePct}%)`,
                        message: `Tenant "${tenantName}" has reached ${citizenCount} of ${maxCitizens} allowed citizens (${usagePct}%).`,
                        timestamp: now.toISOString(),
                        tenantId,
                        tenantName,
                        tenantSlug,
                        actionType: 'UPGRADE_PLAN',
                        actionLabel: 'Increase Quota',
                        actionUrl: `/plans`,
                        metadata: { citizenCount, maxCitizens, usagePct },
                    });
                }
            }
        }
        if (typeof options?.platformStoragePercent === 'number') {
            if (options.platformStoragePercent >= 90) {
                alerts.push({
                    id: 'platform-storage-critical',
                    category: 'storage',
                    severity: 'critical',
                    title: `Critical Platform Storage (${options.platformStoragePercent}%)`,
                    message: `Total platform disk storage is at ${options.platformStoragePercent}% (${options.platformStorageFormatted} of ${options.platformAllocatedFormatted}). Consider increasing disk volume.`,
                    timestamp: now.toISOString(),
                    actionType: 'MANAGE_STORAGE',
                    actionLabel: 'Review Storage Pool',
                    actionUrl: `/usage`,
                });
            }
            else if (options.platformStoragePercent >= 75) {
                alerts.push({
                    id: 'platform-storage-warning',
                    category: 'storage',
                    severity: 'warning',
                    title: `Platform Storage Usage High (${options.platformStoragePercent}%)`,
                    message: `Platform storage reached ${options.platformStoragePercent}% capacity (${options.platformStorageFormatted} of ${options.platformAllocatedFormatted}).`,
                    timestamp: now.toISOString(),
                    actionType: 'MANAGE_STORAGE',
                    actionLabel: 'View Storage Breakdown',
                    actionUrl: `/usage`,
                });
            }
        }
        const unverifiedDomainTenants = await this.tenantModel
            .find({
            customDomain: { $exists: true, $ne: '' },
            isCustomDomainVerified: { $ne: true },
        })
            .select('_id name slug customDomain isCustomDomainVerified createdAt')
            .lean();
        for (const t of unverifiedDomainTenants) {
            alerts.push({
                id: `domain-unverified-${t._id}`,
                category: 'domain',
                severity: 'warning',
                title: `Custom Domain Pending DNS Verification`,
                message: `Domain "${t.customDomain}" configured for "${t.name}" is pending DNS CNAME/A verification.`,
                timestamp: now.toISOString(),
                tenantId: t._id.toString(),
                tenantName: t.name,
                tenantSlug: t.slug,
                actionType: 'VERIFY_DOMAIN',
                actionLabel: 'Check DNS',
                actionUrl: `/domains`,
                metadata: { domain: t.customDomain },
            });
        }
        const suspendedTenants = await this.tenantModel
            .find({ status: types_1.TenantStatus.SUSPENDED })
            .select('_id name slug status updatedAt')
            .lean();
        for (const st of suspendedTenants) {
            alerts.push({
                id: `tenant-suspended-${st._id}`,
                category: 'tenant',
                severity: 'warning',
                title: `Tenant Access Suspended`,
                message: `Tenant "${st.name}" (${st.slug}) is currently suspended. Portal login and citizen actions are locked.`,
                timestamp: now.toISOString(),
                tenantId: st._id.toString(),
                tenantName: st.name,
                tenantSlug: st.slug,
                actionType: 'VIEW_CLIENT',
                actionLabel: 'Review Tenant',
                actionUrl: `/clients`,
            });
        }
        const pendingComplaintsCount = await this.complaintModel.countDocuments({
            status: { $in: ['submitted', 'under_review', 'assigned'] },
        });
        if (pendingComplaintsCount > 20) {
            alerts.push({
                id: 'complaints-backlog-high',
                category: 'system',
                severity: 'info',
                title: `Citizen Complaints Backlog (${pendingComplaintsCount} Pending)`,
                message: `There are ${pendingComplaintsCount} unresolved complaints across all tenants awaiting manager action.`,
                timestamp: now.toISOString(),
                actionType: 'VIEW_COMPLAINTS',
                actionLabel: 'Review Complaints',
                actionUrl: `/usage`,
            });
        }
        const severityWeight = { critical: 3, warning: 2, info: 1 };
        alerts.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));
        let filtered = alerts;
        if (options?.severity) {
            filtered = filtered.filter(a => a.severity === options.severity);
        }
        if (options?.category) {
            filtered = filtered.filter(a => a.category === options.category);
        }
        return {
            total: filtered.length,
            criticalCount: alerts.filter(a => a.severity === 'critical').length,
            warningCount: alerts.filter(a => a.severity === 'warning').length,
            infoCount: alerts.filter(a => a.severity === 'info').length,
            items: filtered,
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
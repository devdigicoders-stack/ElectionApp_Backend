import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { User, UserDocument } from '../users/user.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import { Work, WorkDocument } from '../works/work.schema';
import { Event, EventDocument } from '../events/event.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { Subscription, SubscriptionDocument, SubscriptionStatus } from '../subscriptions/subscription.schema';
import { Plan, PlanDocument } from '../plans/plan.schema';
import { TenantStatus } from '../../shared/types';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(Work.name) private workModel: Model<WorkDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async getSummary(tenant: TenantDocument) {
    const tenantId = tenant._id;

    const [
      totalUsers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalWorks,
      completedWorks,
      upcomingEvents,
      totalMembers,
      pendingMemberships,
      totalVolunteers,
    ] = await Promise.all([
      this.userModel.countDocuments({ tenantId }),
      this.complaintModel.countDocuments({ tenantId }),
      this.complaintModel.countDocuments({ tenantId, status: { $in: ['submitted', 'under_review', 'assigned'] } } as any),
      this.complaintModel.countDocuments({ tenantId, status: 'resolved' } as any),
      this.workModel.countDocuments({ tenantId }),
      this.workModel.countDocuments({ tenantId, status: 'completed' } as any),
      this.eventModel.countDocuments({ tenantId, startDate: { $gte: new Date() }, isPublished: true } as any),
      this.membershipModel.countDocuments({ tenantId, status: 'approved' } as any),
      this.membershipModel.countDocuments({ tenantId, status: 'pending' } as any),
      this.volunteerModel.countDocuments({ tenantId, status: 'active' } as any),
    ]);

    // Recent complaints (last 5)
    const recentComplaints = await this.complaintModel
      .find({ tenantId })
      .populate('userId', 'name mobile')
      .populate('areaId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('complaintNumber title status category createdAt');

    // Complaint trend last 7 days
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

  /**
   * Super Admin Global Platform Stats (SRS Sec 45.1)
   */
  async getSuperAdminStats() {
    // 1. Tenant counts
    const [
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
    ] = await Promise.all([
      this.tenantModel.countDocuments(),
      this.tenantModel.countDocuments({ status: TenantStatus.ACTIVE }),
      this.tenantModel.countDocuments({ status: TenantStatus.TRIAL }),
      this.tenantModel.countDocuments({ status: TenantStatus.SUSPENDED }),
    ]);

    // 2. Citizens across all tenants (SRS Sec 45.1: Registered Users vs Active Users)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalCitizens,
      activeCitizens,
      completedProfiles,
      newCitizensLast30Days,
      activeLast30Days,
    ] = await Promise.all([
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

    // 3. Complaints across all tenants
    const [
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
    ] = await Promise.all([
      this.complaintModel.countDocuments(),
      this.complaintModel.countDocuments({ status: 'resolved' } as any),
      this.complaintModel.countDocuments({ status: { $in: ['submitted', 'under_review', 'in_progress', 'assigned'] } } as any),
    ]);
    const resolutionRate = totalComplaints > 0
      ? `${((resolvedComplaints / totalComplaints) * 100).toFixed(1)}%`
      : '0.0%';

    // 4. Subscriptions & Revenue
    const [
      totalSubscriptions,
      activeSubscriptions,
      trialingSubscriptions,
      expiredSubscriptions,
      canceledSubscriptions,
      pausedSubscriptions,
    ] = await Promise.all([
      this.subscriptionModel.countDocuments(),
      this.subscriptionModel.countDocuments({ status: SubscriptionStatus.ACTIVE }),
      this.subscriptionModel.countDocuments({ status: SubscriptionStatus.TRIALING }),
      this.subscriptionModel.countDocuments({ status: SubscriptionStatus.EXPIRED }),
      this.subscriptionModel.countDocuments({ status: SubscriptionStatus.CANCELED }),
      this.subscriptionModel.countDocuments({ status: SubscriptionStatus.PAUSED }),
    ]);

    // Revenue aggregated from all paid invoices across subscriptions
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

    // 5. Plans summary
    const [totalPlans, activePlans] = await Promise.all([
      this.planModel.countDocuments({ isDeleted: { $ne: true } }),
      this.planModel.countDocuments({ isActive: true, isDeleted: { $ne: true } }),
    ]);

    // 6. Recent 5 Onboarded Tenants
    const recentTenants = await this.tenantModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('planId', 'name code billingCycle price')
      .select('name slug status branding.leaderName customDomain createdAt planId');

    // 7. Recent 5 Invoices across all subscriptions
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

    // 8. Real Dynamic Storage Calculation (Physical uploads + Database footprint + Plan Quotas)
    let physicalUploadsBytes = 0;
    let uploadedFilesCount = 0;
    const uploadRoot = path.join(process.cwd(), 'uploads');

    if (fs.existsSync(uploadRoot)) {
      const scanDir = (dir: string) => {
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              scanDir(fullPath);
            } else if (entry.isFile()) {
              physicalUploadsBytes += fs.statSync(fullPath).size;
              uploadedFilesCount++;
            }
          }
        } catch {
          // ignore unreadable/transient files
        }
      };
      scanDir(uploadRoot);
    }

    const physicalUploadsMB = Math.round((physicalUploadsBytes / (1024 * 1024)) * 100) / 100;
    // Dynamic database footprint estimation based on active documents
    const estimatedDbBytes = (totalCitizens * 8000) + (totalComplaints * 25000);
    const estimatedDbMB = Math.round((estimatedDbBytes / (1024 * 1024)) * 100) / 100;
    const totalUsedMB = Math.round((physicalUploadsMB + estimatedDbMB) * 100) / 100;
    const totalUsedBytes = physicalUploadsBytes + estimatedDbBytes;

    const formatSize = (mb: number): string => {
      if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
      return `${mb.toFixed(2)} MB`;
    };

    // Calculate total allocated storage across all active tenant subscriptions
    const activeSubs = await this.subscriptionModel
      .find({ status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] } })
      .populate('planId');

    let totalAllocatedMB = 0;
    let hasUnlimitedStorage = false;

    for (const sub of activeSubs) {
      const plan = sub.planId as any;
      const limit = plan?.limits?.maxStorageMB;
      if (limit === -1) {
        hasUnlimitedStorage = true;
      } else if (typeof limit === 'number' && limit > 0) {
        totalAllocatedMB += limit;
      }
    }

    // Baseline platform pool (50 GB if no custom quotas set)
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
        // High-precision dynamic storage metrics (SRS Sec 45.1 & 48)
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
        // Backward compatibility
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

  /**
   * Dynamic System Alert & Quick Warning Engine (SRS Section 45.1)
   * Scans expiring subscriptions, quota thresholds, unverified custom domains, and platform health.
   */
  async getSuperAdminAlerts(options?: {
    severity?: string;
    category?: string;
    platformStoragePercent?: number;
    platformStorageFormatted?: string;
    platformAllocatedFormatted?: string;
  }) {
    const alerts: Array<{
      id: string;
      category: 'subscription' | 'storage' | 'domain' | 'tenant' | 'system';
      severity: 'critical' | 'warning' | 'info';
      title: string;
      message: string;
      timestamp: string;
      tenantId?: string;
      tenantName?: string;
      tenantSlug?: string;
      actionType: 'RENEW' | 'EXTEND_TRIAL' | 'UPGRADE_PLAN' | 'VERIFY_DOMAIN' | 'VIEW_CLIENT' | 'MANAGE_STORAGE' | 'VIEW_COMPLAINTS';
      actionLabel: string;
      actionUrl: string;
      metadata?: Record<string, any>;
    }> = [];

    const now = new Date();

    // 1. Subscription & Trial Expiry Alerts (Critical <= 7d, Warning <= 15d, Expired < 0d)
    const subscriptions = await this.subscriptionModel
      .find({
        status: { $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING, SubscriptionStatus.EXPIRED] },
      })
      .populate('tenantId')
      .populate('planId')
      .lean();

    for (const sub of subscriptions) {
      const tenant = sub.tenantId as any;
      if (!tenant) continue;

      const tenantName = tenant.name || 'Unnamed Client';
      const tenantSlug = tenant.slug || '';
      const tenantId = tenant._id ? tenant._id.toString() : '';

      if (sub.endDate) {
        const endDate = new Date(sub.endDate);
        const diffMs = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const isTrial = sub.status === SubscriptionStatus.TRIALING;
        const formattedDate = endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        if (diffDays < 0 && Math.abs(diffDays) <= 30) {
          // Expired within the last 30 days
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
        } else if (diffDays >= 0 && diffDays <= 7) {
          // Critical: expires within 7 days
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
        } else if (diffDays > 7 && diffDays <= 15) {
          // Warning: expires in 8-15 days
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

      // 2. Citizen Quota Check per Tenant
      const plan = sub.planId as any;
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
        } else if (usagePct >= 85) {
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

    // 3. Platform Storage Capacity Warning (if >= 75% or >= 90%)
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
      } else if (options.platformStoragePercent >= 75) {
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

    // 4. Custom Domain & DNS Verification Alerts
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

    // 5. Suspended Tenants Alert
    const suspendedTenants = await this.tenantModel
      .find({ status: TenantStatus.SUSPENDED })
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

    // 6. High Unresolved Complaints Backlog Alert (> 20 pending complaints)
    const pendingComplaintsCount = await this.complaintModel.countDocuments({
      status: { $in: ['submitted', 'under_review', 'assigned'] },
    } as any);

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

    // Sort by severity (critical first, then warning, then info)
    const severityWeight: Record<string, number> = { critical: 3, warning: 2, info: 1 };
    alerts.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));

    // Filter if requested
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

  /**
   * Platform growth & time-series analytics (SRS Sec 45.1)
   */
  async getSuperAdminGrowth(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 1. Tenant Growth Trend
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

    // 2. Citizen Signups Trend
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

    // 3. Complaint Submissions Trend
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

    // 4. Revenue Trend (paid invoices)
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

  /**
   * Tenants Overview with live metrics (SRS Sec 45.1)
   */
  async getSuperAdminTenantsOverview(params: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }) {
    const { page, limit, status, search } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
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
        createdAt: (t as any).createdAt,
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
}

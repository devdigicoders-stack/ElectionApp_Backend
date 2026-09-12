import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { Plan, PlanDocument } from '../plans/plan.schema';
import { Subscription, SubscriptionDocument } from '../subscriptions/subscription.schema';
import { User, UserDocument } from '../users/user.schema';
import { AdminUser, AdminUserDocument } from '../admin-users/admin-user.schema';
import { GeneratedPoster, GeneratedPosterDocument } from '../poster-generator/generated-poster.schema';
import { Notification, NotificationDocument } from '../notifications/notification.schema';
import { QueryUsageOverviewDto } from './usage.dto';

export type QuotaStatus = 'normal' | 'warning' | 'restricted';

export interface MetricUsage {
  used: number;
  limit: number; // -1 means unlimited
  remaining: number | string; // number or 'unlimited'
  percentUsed: number;
  status: QuotaStatus;
  formattedUsed?: string;
  formattedLimit?: string;
}

@Injectable()
export class UsageService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    @InjectModel(GeneratedPoster.name) private posterModel: Model<GeneratedPosterDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  /**
   * Resolve physical uploads directory dynamically across environments
   */
  private getUploadRoot(): string | null {
    const candidates: string[] = [];
    if (process.env.UPLOAD_DIR) {
      candidates.push(
        path.isAbsolute(process.env.UPLOAD_DIR)
          ? process.env.UPLOAD_DIR
          : path.join(process.cwd(), process.env.UPLOAD_DIR),
      );
    }
    candidates.push(
      path.join(process.cwd(), 'uploads'),
      path.join(process.cwd(), 'apps', 'api', 'uploads'),
      path.resolve(__dirname, '..', '..', '..', 'uploads'),
      path.resolve(__dirname, '..', '..', 'uploads'),
      path.resolve(__dirname, 'uploads'),
    );

    for (const dir of candidates) {
      try {
        if (fs.existsSync(dir)) return dir;
      } catch {
        // ignore unreadable dir
      }
    }
    return null;
  }

  /**
   * Estimate asset size when hosted on CDN/remote URL or stored off-node
   */
  private estimateSizeFromUrl(url: string): number {
    if (!url || typeof url !== 'string') return 0;
    const clean = url.split('?')[0].toLowerCase();
    if (clean.endsWith('.mp4') || clean.endsWith('.mov') || clean.endsWith('.webm') || clean.endsWith('.mkv')) {
      return 10 * 1024 * 1024; // ~10MB for video splash / onboarding clips
    }
    if (clean.endsWith('.png') || clean.endsWith('.jpg') || clean.endsWith('.jpeg') || clean.endsWith('.gif')) {
      return 1.5 * 1024 * 1024; // ~1.5MB for images
    }
    if (clean.endsWith('.webp')) return 400 * 1024;
    if (clean.endsWith('.svg') || clean.endsWith('.ico')) return 100 * 1024;
    if (clean.endsWith('.pdf')) return 2 * 1024 * 1024;
    return 500 * 1024;
  }

  /**
   * Recursively calculate physical & dynamic storage used by a tenant (SRS Sec 48).
   * Aggregates:
   * 1. Physical directory uploads/{slug}
   * 2. Tenant branding assets (logo, leader photo, splash media, favicon, login bg)
   * 3. Tenant banners, galleries, generated posters, and complaint attachments
   * 4. Real database documents footprint (citizens, complaints, staff + base tenant schema)
   */
  private async calculateTenantStorageMB(tenant: any): Promise<number> {
    if (!tenant) return 0;
    const uploadRoot = this.getUploadRoot();
    const countedFiles = new Set<string>();
    let totalBytes = 0;

    // 1. Scan physical uploads/{slug} directory if present on disk
    if (uploadRoot && tenant.slug) {
      const slugDir = path.join(uploadRoot, tenant.slug);
      if (fs.existsSync(slugDir)) {
        const scanDir = (dir: string) => {
          try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name);
              if (entry.isDirectory()) {
                scanDir(fullPath);
              } else if (entry.isFile()) {
                const norm = path.normalize(fullPath).toLowerCase();
                if (!countedFiles.has(norm)) {
                  countedFiles.add(norm);
                  totalBytes += fs.statSync(fullPath).size;
                }
              }
            }
          } catch {
            // ignore unreadable/transient files
          }
        };
        scanDir(slugDir);
      }
    }

    // 2. Branding URLs (logo, leaderPhoto, splashScreens, etc.)
    const urls: string[] = [];
    if (tenant.branding) {
      if (tenant.branding.logoUrl) urls.push(tenant.branding.logoUrl);
      if (tenant.branding.logo && tenant.branding.logo !== tenant.branding.logoUrl) urls.push(tenant.branding.logo);
      if (tenant.branding.leaderPhotoUrl) urls.push(tenant.branding.leaderPhotoUrl);
      if (tenant.branding.faviconUrl) urls.push(tenant.branding.faviconUrl);
      if (tenant.branding.pwaIconUrl) urls.push(tenant.branding.pwaIconUrl);
      if (tenant.branding.loginBgUrl) urls.push(tenant.branding.loginBgUrl);
      if (Array.isArray(tenant.branding.splashScreens)) {
        for (const s of tenant.branding.splashScreens) {
          if (s?.mediaUrl) urls.push(s.mediaUrl);
        }
      }
    }

    // 3. Database collections: Banners, Galleries, Posters, Complaints
    try {
      const db = this.tenantModel.db;
      if (db) {
        // Banners
        const banners = await db.collection('banners').find({ tenantId: tenant._id }).toArray();
        for (const b of banners) {
          if (b.imageUrl) urls.push(b.imageUrl);
          if (b.mobileImageUrl) urls.push(b.mobileImageUrl);
        }

        // Galleries
        const galleries = await db.collection('galleries').find({ tenantId: tenant._id }).toArray();
        for (const g of galleries) {
          if (g.url) urls.push(g.url);
          if (g.thumbnailUrl) urls.push(g.thumbnailUrl);
        }

        // Generated posters
        const posters = await db.collection('generatedposters').find({ tenantId: tenant._id }).toArray();
        for (const p of posters) {
          if (p.outputUrl) urls.push(p.outputUrl);
          if (p.thumbnailUrl) urls.push(p.thumbnailUrl);
        }

        // Complaint attachments
        const complaints = await db.collection('complaints').find({
          tenantId: tenant._id,
          attachments: { $exists: true, $ne: [] },
        }).toArray();
        for (const c of complaints) {
          if (Array.isArray(c.attachments)) {
            for (const att of c.attachments) {
              if (typeof att === 'string') urls.push(att);
              else if (att?.url) urls.push(att.url);
            }
          }
        }
      }
    } catch {
      // ignore collection query errors
    }

    // Process all identified media URLs
    for (const u of urls) {
      if (!u || typeof u !== 'string') continue;
      let matchedDisk = false;
      if (uploadRoot && (u.startsWith('/uploads/') || u.includes('/uploads/'))) {
        const rel = u.replace(/.*\/uploads\//, '');
        const diskPath = path.join(uploadRoot, rel);
        const norm = path.normalize(diskPath).toLowerCase();
        if (fs.existsSync(diskPath)) {
          matchedDisk = true;
          if (!countedFiles.has(norm)) {
            countedFiles.add(norm);
            try {
              totalBytes += fs.statSync(diskPath).size;
            } catch {
              totalBytes += this.estimateSizeFromUrl(u);
            }
          }
        }
      }

      if (!matchedDisk) {
        const normUrl = u.trim().toLowerCase();
        if (!countedFiles.has(normUrl)) {
          countedFiles.add(normUrl);
          totalBytes += this.estimateSizeFromUrl(u);
        }
      }
    }

    // 4. Dynamic database footprint (citizens, complaints, staff + base tenant schema)
    try {
      const citizenCount = await this.userModel.countDocuments({ tenantId: tenant._id });
      const staffCount = await this.adminUserModel.countDocuments({ tenantId: tenant._id });
      let complaintCount = 0;
      if (this.tenantModel.db) {
        complaintCount = await this.tenantModel.db.collection('complaints').countDocuments({ tenantId: tenant._id });
      }
      const baseFootprintBytes = 512 * 1024; // 512 KB base config/areas/branding schema
      const docBytes = (citizenCount * 8192) + (complaintCount * 25600) + (staffCount * 16384);
      totalBytes += (baseFootprintBytes + docBytes);
    } catch {
      totalBytes += 512 * 1024;
    }

    return Math.round((totalBytes / (1024 * 1024)) * 100) / 100; // In MB with 2 decimals
  }

  /**
   * Helper to compute usage metrics and warning/restricted status (SRS Sec 48)
   */
  private calculateMetric(used: number, limit = -1): MetricUsage {
    if (limit === -1 || limit === undefined || limit === null) {
      return {
        used,
        limit: -1,
        remaining: 'unlimited',
        percentUsed: 0,
        status: 'normal',
      };
    }

    const percentUsed = limit > 0 ? Math.round((used / limit) * 100) : 100;
    const remaining = Math.max(limit - used, 0);

    let status: QuotaStatus = 'normal';
    if (percentUsed >= 100) {
      status = 'restricted';
    } else if (percentUsed >= 80) {
      status = 'warning';
    }

    return {
      used,
      limit,
      remaining,
      percentUsed,
      status,
    };
  }

  /**
   * Format bytes/MB to human-readable string
   */
  private formatMB(mb: number): string {
    if (mb === -1) return 'Unlimited';
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    if (mb <= 0) return '0 MB';
    return `${mb.toFixed(2)} MB`;
  }

  /**
   * Get complete usage report for a single tenant (SRS Sec 48)
   */
  async getTenantUsage(tenantId: string) {
    const queryId = Types.ObjectId.isValid(tenantId) ? new Types.ObjectId(tenantId) : tenantId;
    const tenant = await this.tenantModel.findById(queryId).populate('planId');
    if (!tenant) throw new NotFoundException('Tenant not found');

    const subscription = await this.subscriptionModel
      .findOne({ tenantId: tenant._id })
      .populate('planId')
      .lean();

    const plan = (subscription?.planId || tenant.planId) as unknown as PlanDocument | null;
    const planLimits = plan?.limits || ({} as any);

    // 1. Citizens count
    const totalCitizens = await this.userModel.countDocuments({ tenantId: tenant._id });

    // 2. Staff users count
    const totalStaff = await this.adminUserModel.countDocuments({
      tenantId: tenant._id,
      isSuperAdmin: { $ne: true },
    });

    // 3. Storage MB used (physical disk uploads + branding media + database footprint)
    const storageUsedMB = await this.calculateTenantStorageMB(tenant);

    // 4. Posters generated this calendar month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const postersThisMonth = await this.posterModel.countDocuments({
      tenantId: tenant._id,
      createdAt: { $gte: startOfMonth },
    });

    // 5. Notifications sent this month
    const notificationsThisMonth = await this.notificationModel.countDocuments({
      tenantId: tenant._id,
      isSent: true,
      createdAt: { $gte: startOfMonth },
    });

    // Metrics calculation
    const citizensMetric = this.calculateMetric(totalCitizens, planLimits.maxCitizens);
    const staffMetric = this.calculateMetric(totalStaff, planLimits.maxStaffUsers);
    const postersMetric = this.calculateMetric(postersThisMonth, planLimits.maxPostersPerMonth);
    const notificationsMetric = this.calculateMetric(notificationsThisMonth, planLimits.maxNotificationsPerMonth);

    const storageLimitMB = planLimits.maxStorageMB !== undefined ? planLimits.maxStorageMB : -1;
    const storageMetricRaw = this.calculateMetric(storageUsedMB, storageLimitMB);
    const storageMetric: MetricUsage = {
      ...storageMetricRaw,
      formattedUsed: this.formatMB(storageUsedMB),
      formattedLimit: this.formatMB(storageLimitMB),
    };

    // Overall status across all metrics
    const metricsList = [citizensMetric, staffMetric, postersMetric, notificationsMetric, storageMetric];
    let overallStatus: QuotaStatus = 'normal';
    if (metricsList.some((m) => m.status === 'restricted')) {
      overallStatus = 'restricted';
    } else if (metricsList.some((m) => m.status === 'warning')) {
      overallStatus = 'warning';
    }

    // Generate proactive alerts
    const alerts: string[] = [];
    if (citizensMetric.status === 'restricted') {
      alerts.push(`Citizens limit reached (${totalCitizens}/${planLimits.maxCitizens}). New voter registrations are blocked or require plan upgrade.`);
    } else if (citizensMetric.status === 'warning') {
      alerts.push(`Citizens quota at ${citizensMetric.percentUsed}% (${totalCitizens}/${planLimits.maxCitizens}). Approaching plan limit.`);
    }

    if (storageMetric.status === 'restricted') {
      alerts.push(`Storage limit exceeded (${storageMetric.formattedUsed}/${storageMetric.formattedLimit}). File uploads restricted.`);
    } else if (storageMetric.status === 'warning') {
      alerts.push(`Storage quota at ${storageMetric.percentUsed}% (${storageMetric.formattedUsed}/${storageMetric.formattedLimit}).`);
    }

    if (postersMetric.status === 'restricted') {
      alerts.push(`Monthly poster generation quota reached (${postersThisMonth}/${planLimits.maxPostersPerMonth}).`);
    }

    return {
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
        leaderName: tenant.branding?.leaderName || null,
      },
      plan: plan
        ? {
            id: plan._id,
            name: plan.name,
            slug: plan.slug,
            price: plan.price,
            billingCycle: plan.billingCycle,
          }
        : null,
      subscription: subscription
        ? {
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            trialEndsAt: subscription.trialEndsAt,
          }
        : null,
      overallStatus,
      metrics: {
        citizens: citizensMetric,
        storageMB: storageMetric,
        staffUsers: staffMetric,
        postersThisMonth: postersMetric,
        notificationsThisMonth: notificationsMetric,
      },
      alerts,
    };
  }

  /**
   * Super Admin Overview of all tenants' quota consumption (SRS Sec 48)
   */
  async getOverview(query: QueryUsageOverviewDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);

    const filter: any = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { slug: { $regex: query.search, $options: 'i' } },
        { 'branding.leaderName': { $regex: query.search, $options: 'i' } },
      ];
    }

    const allTenants = await this.tenantModel.find(filter).sort({ createdAt: -1 }).lean();

    // Fetch usage for each tenant
    const reports = await Promise.all(
      allTenants.map((t) => this.getTenantUsage(t._id.toString())),
    );

    // Apply overall status filter if requested
    let filteredReports = reports;
    if (query.status) {
      filteredReports = reports.filter((r) => r.overallStatus === query.status);
    }

    const total = filteredReports.length;
    const paginatedItems = filteredReports.slice((page - 1) * limit, page * limit);

    // Summary counters
    const summary = {
      totalTenants: reports.length,
      normalCount: reports.filter((r) => r.overallStatus === 'normal').length,
      warningCount: reports.filter((r) => r.overallStatus === 'warning').length,
      restrictedCount: reports.filter((r) => r.overallStatus === 'restricted').length,
    };

    return {
      summary,
      items: paginatedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

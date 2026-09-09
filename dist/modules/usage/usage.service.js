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
exports.UsageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const tenant_schema_1 = require("../tenants/tenant.schema");
const plan_schema_1 = require("../plans/plan.schema");
const subscription_schema_1 = require("../subscriptions/subscription.schema");
const user_schema_1 = require("../users/user.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const generated_poster_schema_1 = require("../poster-generator/generated-poster.schema");
const notification_schema_1 = require("../notifications/notification.schema");
let UsageService = class UsageService {
    constructor(tenantModel, planModel, subscriptionModel, userModel, adminUserModel, posterModel, notificationModel) {
        this.tenantModel = tenantModel;
        this.planModel = planModel;
        this.subscriptionModel = subscriptionModel;
        this.userModel = userModel;
        this.adminUserModel = adminUserModel;
        this.posterModel = posterModel;
        this.notificationModel = notificationModel;
    }
    getStorageUsageMB(slug) {
        const uploadDir = path.join(process.cwd(), 'uploads', slug);
        if (!fs.existsSync(uploadDir))
            return 0;
        let totalBytes = 0;
        const calculateBytes = (dir) => {
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        calculateBytes(fullPath);
                    }
                    else if (entry.isFile()) {
                        totalBytes += fs.statSync(fullPath).size;
                    }
                }
            }
            catch {
            }
        };
        calculateBytes(uploadDir);
        return Math.round((totalBytes / (1024 * 1024)) * 100) / 100;
    }
    calculateMetric(used, limit = -1) {
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
        let status = 'normal';
        if (percentUsed >= 100) {
            status = 'restricted';
        }
        else if (percentUsed >= 80) {
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
    formatMB(mb) {
        if (mb === -1)
            return 'Unlimited';
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(2)} GB`;
        }
        return `${mb} MB`;
    }
    async getTenantUsage(tenantId) {
        const tenant = await this.tenantModel.findById(tenantId).populate('planId');
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const subscription = await this.subscriptionModel
            .findOne({ tenantId: tenant._id })
            .populate('planId')
            .lean();
        const plan = (subscription?.planId || tenant.planId);
        const planLimits = plan?.limits || {};
        const totalCitizens = await this.userModel.countDocuments({ tenantId: tenant._id });
        const totalStaff = await this.adminUserModel.countDocuments({
            tenantId: tenant._id,
            isSuperAdmin: { $ne: true },
        });
        const storageUsedMB = this.getStorageUsageMB(tenant.slug);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const postersThisMonth = await this.posterModel.countDocuments({
            tenantId: tenant._id,
            createdAt: { $gte: startOfMonth },
        });
        const notificationsThisMonth = await this.notificationModel.countDocuments({
            tenantId: tenant._id,
            isSent: true,
            createdAt: { $gte: startOfMonth },
        });
        const citizensMetric = this.calculateMetric(totalCitizens, planLimits.maxCitizens);
        const staffMetric = this.calculateMetric(totalStaff, planLimits.maxStaffUsers);
        const postersMetric = this.calculateMetric(postersThisMonth, planLimits.maxPostersPerMonth);
        const notificationsMetric = this.calculateMetric(notificationsThisMonth, planLimits.maxNotificationsPerMonth);
        const storageLimitMB = planLimits.maxStorageMB !== undefined ? planLimits.maxStorageMB : -1;
        const storageMetricRaw = this.calculateMetric(storageUsedMB, storageLimitMB);
        const storageMetric = {
            ...storageMetricRaw,
            formattedUsed: this.formatMB(storageUsedMB),
            formattedLimit: this.formatMB(storageLimitMB),
        };
        const metricsList = [citizensMetric, staffMetric, postersMetric, notificationsMetric, storageMetric];
        let overallStatus = 'normal';
        if (metricsList.some((m) => m.status === 'restricted')) {
            overallStatus = 'restricted';
        }
        else if (metricsList.some((m) => m.status === 'warning')) {
            overallStatus = 'warning';
        }
        const alerts = [];
        if (citizensMetric.status === 'restricted') {
            alerts.push(`Citizens limit reached (${totalCitizens}/${planLimits.maxCitizens}). New voter registrations are blocked or require plan upgrade.`);
        }
        else if (citizensMetric.status === 'warning') {
            alerts.push(`Citizens quota at ${citizensMetric.percentUsed}% (${totalCitizens}/${planLimits.maxCitizens}). Approaching plan limit.`);
        }
        if (storageMetric.status === 'restricted') {
            alerts.push(`Storage limit exceeded (${storageMetric.formattedUsed}/${storageMetric.formattedLimit}). File uploads restricted.`);
        }
        else if (storageMetric.status === 'warning') {
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
    async getOverview(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const filter = {};
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { slug: { $regex: query.search, $options: 'i' } },
                { 'branding.leaderName': { $regex: query.search, $options: 'i' } },
            ];
        }
        const allTenants = await this.tenantModel.find(filter).sort({ createdAt: -1 }).lean();
        const reports = await Promise.all(allTenants.map((t) => this.getTenantUsage(t._id.toString())));
        let filteredReports = reports;
        if (query.status) {
            filteredReports = reports.filter((r) => r.overallStatus === query.status);
        }
        const total = filteredReports.length;
        const paginatedItems = filteredReports.slice((page - 1) * limit, page * limit);
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
};
exports.UsageService = UsageService;
exports.UsageService = UsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __param(2, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __param(5, (0, mongoose_1.InjectModel)(generated_poster_schema_1.GeneratedPoster.name)),
    __param(6, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsageService);
//# sourceMappingURL=usage.service.js.map
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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const path_1 = require("path");
const fs_1 = require("fs");
const tenant_schema_1 = require("./tenant.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const area_schema_1 = require("../areas/area.schema");
const user_schema_1 = require("../users/user.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const event_schema_1 = require("../events/event.schema");
const poll_schema_1 = require("../polls/poll.schema");
const subscription_schema_1 = require("../subscriptions/subscription.schema");
const plan_schema_1 = require("../plans/plan.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const types_1 = require("../../shared/types");
const registration_form_types_1 = require("../registration-form/registration-form.types");
function saveBase64Image(base64Str, tenantSlug, prefix) {
    if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) {
        return base64Str;
    }
    try {
        const matches = base64Str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3)
            return base64Str;
        let ext = matches[1].toLowerCase();
        if (ext === 'jpeg')
            ext = 'jpg';
        else if (ext === 'svg+xml')
            ext = 'svg';
        else if (ext === 'x-icon')
            ext = 'ico';
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${Date.now()}-${prefix}-${Math.floor(Math.random() * 1000000)}.${ext}`;
        const uploadDir = (0, path_1.join)(process.cwd(), 'uploads', tenantSlug, 'branding');
        if (!(0, fs_1.existsSync)(uploadDir)) {
            (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
        }
        const filePath = (0, path_1.join)(uploadDir, filename);
        (0, fs_1.writeFileSync)(filePath, buffer);
        return `/uploads/${tenantSlug}/branding/${filename}`;
    }
    catch (err) {
        console.error('Failed to save base64 image to disk:', err);
        return base64Str;
    }
}
function sanitizeBrandingImages(branding, slug) {
    const result = { ...branding };
    if (result.logoUrl && typeof result.logoUrl === 'string' && result.logoUrl.startsWith('data:image/')) {
        result.logoUrl = saveBase64Image(result.logoUrl, slug, 'logoUrl');
    }
    if (result.logo && typeof result.logo === 'string' && result.logo.startsWith('data:image/')) {
        result.logo = saveBase64Image(result.logo, slug, 'logo');
    }
    if (result.faviconUrl && typeof result.faviconUrl === 'string' && result.faviconUrl.startsWith('data:image/')) {
        result.faviconUrl = saveBase64Image(result.faviconUrl, slug, 'faviconUrl');
    }
    if (result.pwaIconUrl && typeof result.pwaIconUrl === 'string' && result.pwaIconUrl.startsWith('data:image/')) {
        result.pwaIconUrl = saveBase64Image(result.pwaIconUrl, slug, 'pwaIconUrl');
    }
    if (result.loginBgUrl && typeof result.loginBgUrl === 'string' && result.loginBgUrl.startsWith('data:image/')) {
        result.loginBgUrl = saveBase64Image(result.loginBgUrl, slug, 'loginBgUrl');
    }
    if (result.splashScreenUrl && typeof result.splashScreenUrl === 'string' && result.splashScreenUrl.startsWith('data:image/')) {
        result.splashScreenUrl = saveBase64Image(result.splashScreenUrl, slug, 'splashScreenUrl');
    }
    if (Array.isArray(result.splashScreens)) {
        result.splashScreens = result.splashScreens.map((screen, idx) => {
            if (screen && screen.mediaUrl && typeof screen.mediaUrl === 'string' && screen.mediaUrl.startsWith('data:image/')) {
                return {
                    ...screen,
                    mediaUrl: saveBase64Image(screen.mediaUrl, slug, `splash-${idx + 1}`),
                };
            }
            return screen;
        });
    }
    return result;
}
let TenantsService = class TenantsService {
    constructor(tenantModel, featureModel, adminUserModel, areaLevelModel, areaModel, userModel, complaintModel, volunteerModel, eventModel, pollModel, subscriptionModel, planModel, configService, auditLogsService) {
        this.tenantModel = tenantModel;
        this.featureModel = featureModel;
        this.adminUserModel = adminUserModel;
        this.areaLevelModel = areaLevelModel;
        this.areaModel = areaModel;
        this.userModel = userModel;
        this.complaintModel = complaintModel;
        this.volunteerModel = volunteerModel;
        this.eventModel = eventModel;
        this.pollModel = pollModel;
        this.subscriptionModel = subscriptionModel;
        this.planModel = planModel;
        this.configService = configService;
        this.auditLogsService = auditLogsService;
    }
    async onModuleInit() {
        try {
            const tenantsWithBase64 = await this.tenantModel.find({
                $or: [
                    { 'branding.logoUrl': { $regex: '^data:image' } },
                    { 'branding.faviconUrl': { $regex: '^data:image' } },
                    { 'branding.pwaIconUrl': { $regex: '^data:image' } },
                    { 'branding.logo': { $regex: '^data:image' } },
                ],
            });
            for (const t of tenantsWithBase64) {
                const sanitized = sanitizeBrandingImages(t.branding || {}, t.slug);
                await this.tenantModel.updateOne({ _id: t._id }, { $set: { branding: sanitized } });
            }
        }
        catch {
        }
    }
    async create(dto) {
        const exists = await this.tenantModel.findOne({ slug: dto.slug.toLowerCase().trim() });
        if (exists)
            throw new common_1.ConflictException(`Slug "${dto.slug}" is already taken.`);
        const finalName = (dto.name || dto.title || '').trim();
        if (!finalName) {
            throw new common_1.BadRequestException('Either "name" or "title" is required for tenant creation.');
        }
        const finalTitle = (dto.title || dto.name || '').trim();
        const finalLogo = dto.logoUrl || dto.logo || dto.branding?.logoUrl || dto.branding?.logo || null;
        const branding = { ...(dto.branding || {}) };
        if (dto.leaderName && !branding.leaderName) {
            branding.leaderName = dto.leaderName;
        }
        const resolvedTitle = branding.title || branding.platformName || finalTitle;
        branding.title = resolvedTitle;
        branding.platformName = resolvedTitle;
        if (finalLogo) {
            branding.logo = branding.logo || finalLogo;
            branding.logoUrl = branding.logoUrl || finalLogo;
        }
        branding.primaryColor = branding.primaryColor || '#1a56db';
        branding.secondaryColor = branding.secondaryColor || '#f59e0b';
        const sanitizedBranding = sanitizeBrandingImages(branding, dto.slug.toLowerCase().trim());
        const newTenant = new this.tenantModel({
            slug: dto.slug.toLowerCase().trim(),
            name: finalName,
            title: finalTitle,
            contactPerson: dto.contactPerson || null,
            mobileNumber: dto.mobileNumber || null,
            email: dto.email || null,
            electionType: dto.electionType || 'other',
            customDomain: dto.customDomain || undefined,
            branding: sanitizedBranding,
            settings: dto.settings || {
                registrationFields: [
                    { key: 'name', label: 'Full Name', type: 'text', required: true },
                    { key: 'mobile', label: 'Mobile Number', type: 'phone', required: true },
                    { key: 'dob', label: 'Date of Birth', type: 'date', required: false },
                    { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
                    { key: 'area', label: 'Your Area', type: 'area_selector', required: true },
                ],
                areaLevels: ['District', 'Block', 'Gram Panchayat', 'Ward'],
            },
            status: types_1.TenantStatus.TRIAL,
            isPublished: false,
        });
        const tenant = await newTenant.save();
        const features = Object.values(types_1.FeatureKey).map((key) => ({
            tenantId: tenant._id,
            featureKey: key,
            isEnabled: false,
        }));
        await this.featureModel.insertMany(features);
        if (dto.planId) {
            const plan = await this.planModel.findById(dto.planId);
            if (plan) {
                tenant.planId = plan._id;
                const startDate = dto.subscriptionStartDate ? new Date(dto.subscriptionStartDate) : new Date();
                const endDate = dto.subscriptionEndDate
                    ? new Date(dto.subscriptionEndDate)
                    : new Date(startDate.getTime() + (plan.billingCycle === plan_schema_1.BillingCycle.MONTHLY ? 30 : 365) * 24 * 60 * 60 * 1000);
                tenant.subscriptionStartsAt = startDate;
                tenant.subscriptionEndsAt = endDate;
                await tenant.save();
                const count = await this.subscriptionModel.countDocuments();
                const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
                await this.subscriptionModel.create({
                    tenantId: tenant._id,
                    planId: plan._id,
                    status: subscription_schema_1.SubscriptionStatus.ACTIVE,
                    billingCycle: plan.billingCycle || plan_schema_1.BillingCycle.YEARLY,
                    amountPaid: plan.price || 0,
                    currency: plan.currency || 'INR',
                    startDate,
                    endDate,
                    invoiceNumber,
                    paymentMethod: subscription_schema_1.PaymentMethod.BANK_TRANSFER,
                    timeline: [
                        {
                            action: 'created',
                            toPlanId: plan._id,
                            toStatus: subscription_schema_1.SubscriptionStatus.ACTIVE,
                            performedBy: 'super_admin',
                            timestamp: new Date(),
                            note: 'Initial subscription during tenant onboarding',
                        },
                    ],
                });
                const planFeatures = new Set(plan.features || []);
                for (const fKey of Object.values(types_1.FeatureKey)) {
                    await this.featureModel.updateOne({ tenantId: tenant._id, featureKey: fKey }, { $set: { isEnabled: planFeatures.has(fKey) } });
                }
            }
        }
        return tenant;
    }
    async onboardFull(dto, user, ip, userAgent) {
        const tenant = await this.create(dto);
        let adminUserResult = null;
        if (dto.adminUser) {
            adminUserResult = await this.createAdminUser(tenant._id.toString(), {
                name: dto.adminUser.name,
                email: dto.adminUser.email,
                password: dto.adminUser.password,
                role: dto.adminUser.role || types_1.UserRole.LEADER,
            });
        }
        if (dto.areaLevels && dto.areaLevels.length > 0) {
            const levels = dto.areaLevels.map((lvl) => ({
                tenantId: tenant._id,
                levelOrder: lvl.levelOrder,
                name: lvl.name,
                isRequired: lvl.isRequired !== false,
            }));
            await this.areaLevelModel.insertMany(levels);
        }
        await this.auditLogsService.log({
            action: 'TENANT_ONBOARDED_FULL',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy: {
                id: user?.sub || user?.id || 'super_admin',
                email: user?.email || 'superadmin@madiyayu.com',
                name: user?.name || 'Super Admin',
                role: 'super_admin',
            },
            details: {
                slug: tenant.slug,
                electionType: tenant.electionType,
                planId: dto.planId || null,
                hasAdmin: Boolean(adminUserResult),
            },
            ipAddress: ip,
            userAgent: userAgent,
        });
        const onboardingStatus = await this.getOnboardingStatus(tenant._id.toString());
        return {
            message: `Tenant "${tenant.name}" (${tenant.slug}) fully onboarded successfully.`,
            tenant,
            adminUser: adminUserResult
                ? { id: adminUserResult.id, name: adminUserResult.name, email: adminUserResult.email, role: adminUserResult.role }
                : null,
            onboardingStatus,
        };
    }
    async getOnboardingStatus(id) {
        const tenant = await this.tenantModel.findById(id).populate('planId', 'name slug price billingCycle features');
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const [features, admins, areaLevels, subscription] = await Promise.all([
            this.featureModel.find({ tenantId: tenant._id }),
            this.adminUserModel
                .find({
                $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
                isActive: true,
            })
                .select('name email role'),
            this.areaLevelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 }).select('name levelOrder isRequired'),
            this.subscriptionModel
                .findOne({ tenantId: tenant._id, status: subscription_schema_1.SubscriptionStatus.ACTIVE })
                .populate('planId', 'name price features'),
        ]);
        const enabledFeatures = features.filter((f) => f.isEnabled).map((f) => f.featureKey);
        const hasProfile = Boolean((tenant.name || tenant.title) && tenant.slug && (tenant.contactPerson || tenant.mobileNumber || tenant.email));
        const b = tenant.branding || {};
        const logo = b.logoUrl || b.logo || null;
        const resolvedTitle = b.title || b.platformName || tenant.title || tenant.name || null;
        const hasBranding = Boolean((b.leaderName || tenant.name) && (logo || b.primaryColor));
        const hasDomain = Boolean(tenant.customDomain || tenant.slug);
        const hasPlan = Boolean(tenant.planId || subscription);
        const enabledModules = enabledFeatures;
        const hasEnabledModules = enabledFeatures.length > 0;
        const hasAreaLevels = areaLevels.length > 0;
        const regFields = tenant.settings?.registrationFields || [];
        const hasRegFields = regFields.length > 0;
        const hasAdmin = admins.length > 0;
        const completedStepsCount = [
            hasProfile,
            hasBranding,
            hasDomain,
            hasPlan && hasEnabledModules,
            hasAreaLevels,
            hasRegFields,
            hasAdmin,
        ].filter(Boolean).length;
        const completionPercentage = Math.round((completedStepsCount / 7) * 100);
        const isReadyToPublish = hasProfile && hasBranding && hasAdmin;
        return {
            tenantId: tenant._id,
            slug: tenant.slug,
            name: tenant.name,
            title: tenant.title || tenant.name,
            status: tenant.status,
            isPublished: tenant.isPublished ?? (tenant.status === types_1.TenantStatus.ACTIVE),
            completionPercentage,
            isReadyToPublish,
            steps: {
                step1_tenantProfile: {
                    step: 1,
                    name: 'Create Tenant / Profile Info',
                    completed: hasProfile,
                    data: {
                        name: tenant.name,
                        title: tenant.title || tenant.name,
                        slug: tenant.slug,
                        leaderName: b.leaderName || null,
                        electionType: tenant.electionType || 'other',
                        contactPerson: tenant.contactPerson || null,
                        mobileNumber: tenant.mobileNumber || null,
                        email: tenant.email || null,
                    },
                },
                step2_branding: {
                    step: 2,
                    name: 'Branding Setup',
                    completed: hasBranding,
                    data: {
                        title: resolvedTitle,
                        platformName: resolvedTitle,
                        logo: logo,
                        logoUrl: logo,
                        leaderName: b.leaderName || null,
                        leaderPhotoUrl: b.leaderPhotoUrl || null,
                        faviconUrl: b.faviconUrl || null,
                        pwaIconUrl: b.pwaIconUrl || null,
                        loginBgUrl: b.loginBgUrl || null,
                        splashScreenUrl: b.splashScreenUrl || null,
                        splashScreens: b.splashScreens || [],
                        primaryColor: b.primaryColor || null,
                        secondaryColor: b.secondaryColor || null,
                        accentColor: b.accentColor || null,
                        tagline: b.tagline || null,
                        footerText: b.footerText || null,
                        privacyPolicyUrl: b.privacyPolicyUrl || null,
                        termsUrl: b.termsUrl || null,
                        privacyPolicyContent: b.privacyPolicyContent || null,
                        termsContent: b.termsContent || null,
                    },
                },
                step3_domain: {
                    step: 3,
                    name: 'Configure Domain',
                    completed: hasDomain,
                    data: {
                        subdomain: `${tenant.slug}.madiyayu.com`,
                        customDomain: tenant.customDomain || null,
                        isCustomDomainVerified: tenant.isCustomDomainVerified || false,
                    },
                },
                step4_modulesAndPlan: {
                    step: 4,
                    name: 'Subscription Plan & Enabled Modules',
                    completed: hasPlan && hasEnabledModules,
                    data: {
                        plan: tenant.planId || subscription?.planId || null,
                        subscriptionStatus: subscription?.status || 'none',
                        enabledModulesCount: enabledFeatures.length,
                        enabledModules: enabledFeatures,
                    },
                },
                step5_areaHierarchy: {
                    step: 5,
                    name: 'Area Hierarchy Levels',
                    completed: hasAreaLevels,
                    data: {
                        configuredLevelCount: areaLevels.length,
                        levels: areaLevels.map((l) => `${l.levelOrder}. ${l.name}`),
                    },
                },
                step6_registrationForm: {
                    step: 6,
                    name: 'Dynamic Registration Form',
                    completed: hasRegFields,
                    data: {
                        fieldCount: regFields.length,
                        fields: regFields.map((f) => f.label || f.key),
                    },
                },
                step7_adminAccount: {
                    step: 7,
                    name: 'Tenant Admin Account',
                    completed: hasAdmin,
                    data: {
                        adminCount: admins.length,
                        admins: admins.map((a) => ({ name: a.name, email: a.email, role: a.role })),
                    },
                },
            },
        };
    }
    async publishTenant(id, user, ip, userAgent) {
        const tenant = await this.tenantModel.findById(id);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        tenant.status = types_1.TenantStatus.ACTIVE;
        tenant.isPublished = true;
        await tenant.save();
        await this.auditLogsService.log({
            action: 'TENANT_PUBLISHED',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy: {
                id: user?.sub || user?.id || 'super_admin',
                email: user?.email || 'superadmin@madiyayu.com',
                name: user?.name || 'Super Admin',
                role: 'super_admin',
            },
            details: {
                slug: tenant.slug,
                status: tenant.status,
                publishedAt: new Date(),
            },
            ipAddress: ip,
            userAgent: userAgent,
        });
        return {
            message: `Tenant "${tenant.name}" (${tenant.slug}) published and launched successfully.`,
            tenant: {
                id: tenant._id,
                slug: tenant.slug,
                name: tenant.name,
                status: tenant.status,
                isPublished: tenant.isPublished,
            },
        };
    }
    async findAll() {
        return this.tenantModel.find().select('-__v').sort({ createdAt: -1 });
    }
    async findOne(id) {
        const tenant = await this.tenantModel.findById(id);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async getFullProfile(id) {
        const tenant = await this.tenantModel.findById(id).lean();
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const tenantObjId = new mongoose_2.Types.ObjectId(id);
        const [admins, features, areaLevels, areas, subscription, plan, totalCitizens, totalVolunteers, totalComplaints, totalEvents, totalPolls,] = await Promise.all([
            this.adminUserModel.find({ tenantId: tenantObjId }).select('-password -__v').sort({ createdAt: -1 }).lean(),
            this.featureModel.find({ tenantId: tenantObjId }).lean(),
            this.areaLevelModel.find({ tenantId: tenantObjId }).sort({ levelOrder: 1 }).lean(),
            this.areaModel.find({ tenantId: tenantObjId, isActive: true }).populate('levelId', 'name levelOrder').sort({ name: 1 }).lean(),
            this.subscriptionModel.findOne({ tenantId: tenantObjId }).lean(),
            tenant.planId ? this.planModel.findById(tenant.planId).lean() : null,
            this.userModel.countDocuments({ tenantId: tenantObjId }),
            this.volunteerModel.countDocuments({ tenantId: tenantObjId }),
            this.complaintModel.countDocuments({ tenantId: tenantObjId }),
            this.eventModel.countDocuments({ tenantId: tenantObjId }),
            this.pollModel.countDocuments({ tenantId: tenantObjId }),
        ]);
        const areaMap = new Map();
        areas.forEach((a) => areaMap.set(a._id.toString(), { ...a, children: [] }));
        const areaTree = [];
        areas.forEach((a) => {
            if (a.parentId) {
                const parent = areaMap.get(a.parentId.toString());
                if (parent)
                    parent.children.push(areaMap.get(a._id.toString()));
            }
            else {
                areaTree.push(areaMap.get(a._id.toString()));
            }
        });
        const regFields = tenant.settings?.registrationFields && tenant.settings.registrationFields.length > 0
            ? tenant.settings.registrationFields
            : registration_form_types_1.DEFAULT_REGISTRATION_FIELDS;
        return {
            ...tenant,
            _admins: admins,
            _features: features,
            _areaLevels: areaLevels,
            _areas: areas,
            _areaTree: areaTree,
            _subscription: subscription,
            _plan: plan,
            _registrationFields: regFields,
            _stats: {
                totalCitizens,
                totalVolunteers,
                totalComplaints,
                totalEvents,
                totalPolls,
                totalAreas: areas.length,
                totalLevels: areaLevels.length,
                totalStaff: admins.length,
            },
        };
    }
    async update(id, dto) {
        const existing = await this.tenantModel.findById(id);
        if (!existing)
            throw new common_1.NotFoundException('Tenant not found');
        const updateSet = { ...dto };
        if (dto.title && !dto.name) {
            updateSet.name = dto.title;
            updateSet.title = dto.title;
        }
        else if (dto.name && !dto.title) {
            updateSet.name = dto.name;
            if (!existing.title)
                updateSet.title = dto.name;
        }
        const logo = dto.logoUrl || dto.logo;
        if (logo) {
            const finalLogo = saveBase64Image(logo, existing.slug, 'logo');
            updateSet['branding.logo'] = finalLogo;
            updateSet['branding.logoUrl'] = finalLogo;
        }
        if (dto.title) {
            updateSet['branding.title'] = dto.title;
            updateSet['branding.platformName'] = dto.title;
        }
        if (dto.branding) {
            const bTitle = dto.branding.title || dto.branding.platformName;
            const bLogo = dto.branding.logoUrl || dto.branding.logo;
            const mergedBranding = {
                ...(existing.branding || {}),
                ...dto.branding,
            };
            if (bTitle) {
                mergedBranding.title = bTitle;
                mergedBranding.platformName = bTitle;
            }
            if (bLogo) {
                mergedBranding.logo = bLogo;
                mergedBranding.logoUrl = bLogo;
            }
            updateSet.branding = sanitizeBrandingImages(mergedBranding, existing.slug);
        }
        const tenant = await this.tenantModel.findByIdAndUpdate(id, { $set: updateSet }, { new: true });
        return tenant;
    }
    async updateBranding(id, branding) {
        const existing = await this.tenantModel.findById(id);
        if (!existing)
            throw new common_1.NotFoundException('Tenant not found');
        const title = branding.title || branding.platformName;
        const logo = branding.logoUrl || branding.logo;
        const normalized = { ...branding };
        if (title) {
            normalized.title = title;
            normalized.platformName = title;
        }
        if (logo) {
            normalized.logo = logo;
            normalized.logoUrl = logo;
        }
        const mergedBranding = {
            ...(existing.branding || {}),
            ...normalized,
        };
        const sanitizedBranding = sanitizeBrandingImages(mergedBranding, existing.slug);
        const updatePayload = { branding: sanitizedBranding };
        if (title && !existing.title) {
            updatePayload.title = title;
        }
        return this.tenantModel.findByIdAndUpdate(id, { $set: updatePayload }, { new: true });
    }
    async toggleFeature(tenantId, featureKey, isEnabled) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        return this.featureModel.findOneAndUpdate({ tenantId: new Types.ObjectId(tenantId), featureKey }, { $set: { isEnabled } }, { new: true, upsert: true });
    }
    async getFeatures(tenantId) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        return this.featureModel.find({ tenantId: new Types.ObjectId(tenantId) });
    }
    async createAdminUser(tenantId, data) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        const tenantObjectId = new Types.ObjectId(tenantId);
        const emailLower = data.email.trim().toLowerCase();
        const tenant = await this.tenantModel.findById(tenantObjectId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const exists = await this.adminUserModel.findOne({
            $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId }],
            email: emailLower,
        });
        if (exists) {
            throw new common_1.ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
        }
        try {
            const passwordHash = await bcrypt.hash(data.password, 10);
            const user = await this.adminUserModel.create({
                tenantId: tenantObjectId,
                name: data.name.trim(),
                email: emailLower,
                passwordHash,
                role: data.role,
                isActive: true,
            });
            const res = user.toObject ? user.toObject() : { ...user };
            delete res.passwordHash;
            return res;
        }
        catch (err) {
            if (err.code === 11000) {
                throw new common_1.ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
            }
            throw err;
        }
    }
    async suspend(id) {
        return this.tenantModel.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
    }
    async activate(id) {
        return this.tenantModel.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    }
    async impersonateTenant(tenantId, dto, superAdminUser, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        let adminUser = await this.adminUserModel.findOne({
            tenantId: tenant._id,
            isActive: true,
            isSuperAdmin: { $ne: true },
        });
        if (!adminUser) {
            const tempPasswordHash = await bcrypt.hash('ImpersonateSupport@123', 10);
            adminUser = await this.adminUserModel.create({
                tenantId: tenant._id,
                name: tenant.branding?.leaderName ? `${tenant.branding.leaderName} (Admin)` : `${tenant.name} Admin`,
                email: `${tenant.slug}-admin@platform.local`,
                passwordHash: tempPasswordHash,
                role: types_1.UserRole.LEADER,
                isActive: true,
                isSuperAdmin: false,
            });
        }
        const durationHours = Math.min(Math.max(Number(dto.durationHours) || 2, 1), 24);
        const expiresInSeconds = durationHours * 3600;
        const secret = this.configService.get('JWT_SECRET') || 'default-secret';
        const impersonationSession = {
            isImpersonated: true,
            impersonatedBy: {
                id: superAdminUser?.sub || superAdminUser?.id || 'super_admin',
                email: superAdminUser?.email || 'superadmin@madiyayu.com',
                name: superAdminUser?.name || 'Super Admin',
            },
            reason: dto.reason || 'Technical support and troubleshooting access',
            startedAt: new Date(),
            expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
        };
        const token = jwt.sign({
            sub: adminUser._id.toString(),
            email: adminUser.email,
            name: adminUser.name,
            tenantId: tenant._id.toString(),
            tenantSlug: tenant.slug,
            role: adminUser.role,
            isSuperAdmin: false,
            isImpersonated: true,
            impersonatedBy: impersonationSession.impersonatedBy,
        }, secret, { expiresIn: `${durationHours}h` });
        await this.auditLogsService.log({
            action: 'TENANT_IMPERSONATION_STARTED',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy: {
                id: impersonationSession.impersonatedBy.id,
                email: impersonationSession.impersonatedBy.email,
                name: impersonationSession.impersonatedBy.name,
                role: 'super_admin',
            },
            targetUser: {
                id: adminUser._id.toString(),
                name: adminUser.name,
                email: adminUser.email,
            },
            details: {
                reason: impersonationSession.reason,
                durationHours,
                expiresAt: impersonationSession.expiresAt,
            },
            ipAddress,
            userAgent,
        });
        return {
            token,
            expiresIn: expiresInSeconds,
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
                customDomain: tenant.customDomain || null,
                status: tenant.status,
            },
            adminUser: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
            },
            impersonation: impersonationSession,
            message: `Support session initiated for tenant "${tenant.name}". Temporary token valid for ${durationHours} hours.`,
        };
    }
    async exitImpersonation(tenantId, dto, user, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const performedBy = {
            id: user?.impersonatedBy?.id || user?.sub || 'super_admin',
            email: user?.impersonatedBy?.email || user?.email || 'superadmin@madiyayu.com',
            name: user?.impersonatedBy?.name || user?.name || 'Super Admin',
            role: 'super_admin',
        };
        await this.auditLogsService.log({
            action: 'TENANT_IMPERSONATION_ENDED',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy,
            details: {
                notes: dto.notes || 'Support session concluded by Super Admin',
                endedAt: new Date(),
            },
            ipAddress,
            userAgent,
        });
        return {
            message: `Impersonation session for tenant "${tenant.name}" ended successfully. Action logged in audit trail.`,
            tenantId: tenant._id,
            endedAt: new Date(),
        };
    }
    async getImpersonationHistory(tenantId) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return this.auditLogsService.findAll({
            tenantId,
            action: 'TENANT_IMPERSONATION_STARTED',
            limit: 50,
        });
    }
    async getAdminUsers(tenantId) {
        const tenant = await this.tenantModel.findById(tenantId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const admins = await this.adminUserModel
            .find({ tenantId: new mongoose_2.Types.ObjectId(tenantId) })
            .select('name email role isActive createdAt')
            .lean();
        return admins;
    }
    async resetAdminPassword(tenantId, adminUserId, newPassword) {
        if (!newPassword || newPassword.trim().length < 6) {
            throw new common_1.BadRequestException('New password must be at least 6 characters long.');
        }
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        let tenantObjectId;
        let userObjectId;
        try {
            tenantObjectId = new Types.ObjectId(tenantId);
            userObjectId = new Types.ObjectId(adminUserId);
        }
        catch {
            throw new common_1.BadRequestException('Invalid tenant or admin user ID format.');
        }
        const tenant = await this.tenantModel.findById(tenantObjectId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const admin = await this.adminUserModel.findOne({
            _id: userObjectId,
            $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId }],
        });
        if (!admin)
            throw new common_1.NotFoundException('Admin user not found for this tenant');
        admin.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
        await admin.save();
        return {
            message: `Password for ${admin.name} (${admin.email}) has been reset successfully.`,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        };
    }
    async deleteAdminUser(tenantId, adminUserId) {
        const { Types } = await Promise.resolve().then(() => __importStar(require('mongoose')));
        let tenantObjectId;
        let userObjectId;
        try {
            tenantObjectId = new Types.ObjectId(tenantId);
            userObjectId = new Types.ObjectId(adminUserId);
        }
        catch {
            throw new common_1.BadRequestException('Invalid tenant or admin user ID format.');
        }
        const tenant = await this.tenantModel.findById(tenantObjectId);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const admin = await this.adminUserModel.findOneAndDelete({
            _id: userObjectId,
            $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId }],
        });
        if (!admin)
            throw new common_1.NotFoundException('Admin user not found for this tenant');
        return {
            message: `Admin user ${admin.email} deleted successfully.`,
        };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(tenant_feature_schema_1.TenantFeature.name)),
    __param(2, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __param(3, (0, mongoose_1.InjectModel)(area_schema_1.AreaLevel.name)),
    __param(4, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __param(5, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(6, (0, mongoose_1.InjectModel)(complaint_schema_1.Complaint.name)),
    __param(7, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(8, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(9, (0, mongoose_1.InjectModel)(poll_schema_1.Poll.name)),
    __param(10, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(11, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService,
        audit_logs_service_1.AuditLogsService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map
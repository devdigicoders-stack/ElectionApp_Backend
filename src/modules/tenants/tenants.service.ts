import { Injectable, ConflictException, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Tenant, TenantDocument } from './tenant.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserDocument } from '../admin-users/admin-user.schema';
import { Area, AreaDocument, AreaLevel, AreaLevelDocument } from '../areas/area.schema';
import { User, UserDocument } from '../users/user.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { Event, EventDocument } from '../events/event.schema';
import { Poll, PollDocument } from '../polls/poll.schema';
import { Subscription, SubscriptionDocument, SubscriptionStatus, PaymentMethod } from '../subscriptions/subscription.schema';
import { Plan, PlanDocument, BillingCycle } from '../plans/plan.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AlertType, AlertCategory } from '../notifications/system-alert.schema';
import {
  CreateTenantDto,
  UpdateTenantDto,
  ImpersonateTenantDto,
  ExitImpersonationDto,
  UpdateBrandingDto,
  OnboardFullTenantDto,
} from './tenant.dto';
import { FeatureKey, UserRole, TenantStatus } from '../../shared/types';
import { DEFAULT_REGISTRATION_FIELDS } from '../registration-form/registration-form.types';

function saveBase64Image(base64Str: string, tenantSlug: string, prefix: string): string {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  try {
    const matches = base64Str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Str;

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    else if (ext === 'svg+xml') ext = 'svg';
    else if (ext === 'x-icon') ext = 'ico';

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${Date.now()}-${prefix}-${Math.floor(Math.random() * 1000000)}.${ext}`;
    const uploadDir = join(process.cwd(), 'uploads', tenantSlug, 'branding');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = join(uploadDir, filename);
    writeFileSync(filePath, buffer);
    return `/uploads/${tenantSlug}/branding/${filename}`;
  } catch (err) {
    console.error('Failed to save base64 image to disk:', err);
    return base64Str;
  }
}

function sanitizeBrandingImages(branding: Record<string, any>, slug: string): Record<string, any> {
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
    result.splashScreens = result.splashScreens.map((screen: any, idx: number) => {
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

@Injectable()
export class TenantsService implements OnModuleInit {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(TenantFeature.name) private featureModel: Model<TenantFeatureDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    @InjectModel(AreaLevel.name) private areaLevelModel: Model<AreaLevelDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    private configService: ConfigService,
    private auditLogsService: AuditLogsService,
    private notificationsService: NotificationsService,
  ) {}

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
    } catch {
      // ignore on startup if DB not ready
    }
  }

  async create(dto: CreateTenantDto) {
    const exists = await this.tenantModel.findOne({ slug: dto.slug.toLowerCase().trim() });
    if (exists) throw new ConflictException(`Slug "${dto.slug}" is already taken.`);

    const finalName = (dto.name || dto.title || '').trim();
    if (!finalName) {
      throw new BadRequestException('Either "name" or "title" is required for tenant creation.');
    }
    const finalTitle = (dto.title || dto.name || '').trim();

    // Resolve logo from top-level dto or dto.branding
    const finalLogo = dto.logoUrl || dto.logo || dto.branding?.logoUrl || dto.branding?.logo || null;

    // Initialize branding
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
      gstin: dto.gstin ? dto.gstin.trim().toUpperCase() : null,
      billingState: dto.billingState?.trim() || null,
      billingAddress: dto.billingAddress?.trim() || null,
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
      status: TenantStatus.TRIAL,
      isPublished: false,
    });
    const tenant: TenantDocument = await newTenant.save();

    // Seed all features as disabled by default
    const features = Object.values(FeatureKey).map((key) => ({
      tenantId: tenant._id,
      featureKey: key,
      isEnabled: false,
    }));
    await this.featureModel.insertMany(features);

    // If initial Plan ID is provided during onboarding, attach plan and sync features
    if (dto.planId) {
      const plan = await this.planModel.findById(dto.planId);
      if (plan) {
        tenant.planId = plan._id as any;
        const startDate = dto.subscriptionStartDate ? new Date(dto.subscriptionStartDate) : new Date();
        const endDate = dto.subscriptionEndDate
          ? new Date(dto.subscriptionEndDate)
          : new Date(startDate.getTime() + (plan.billingCycle === BillingCycle.MONTHLY ? 30 : 365) * 24 * 60 * 60 * 1000);
        tenant.subscriptionStartsAt = startDate;
        tenant.subscriptionEndsAt = endDate;
        await tenant.save();

        const count = await this.subscriptionModel.countDocuments();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        await this.subscriptionModel.create({
          tenantId: tenant._id,
          planId: plan._id,
          status: SubscriptionStatus.ACTIVE,
          billingCycle: plan.billingCycle || BillingCycle.YEARLY,
          amountPaid: plan.price || 0,
          currency: plan.currency || 'INR',
          startDate,
          endDate,
          invoiceNumber,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          timeline: [
            {
              action: 'created',
              toPlanId: plan._id,
              toStatus: SubscriptionStatus.ACTIVE,
              performedBy: 'super_admin',
              timestamp: new Date(),
              note: 'Initial subscription during tenant onboarding',
            },
          ],
        });

        // Sync enabled features from plan
        const planFeatures = new Set(plan.features || []);
        for (const fKey of Object.values(FeatureKey)) {
          await this.featureModel.updateOne(
            { tenantId: tenant._id, featureKey: fKey },
            { $set: { isEnabled: planFeatures.has(fKey) } },
          );
        }
      }
    }

    try {
      await this.notificationsService.recordSystemAlert({
        title: 'New Client Onboarded',
        message: `Client "${tenant.name}" (${tenant.slug}) has successfully onboarded on ${tenant.electionType} campaign.`,
        type: AlertType.SUCCESS,
        category: AlertCategory.TENANT,
        actionUrl: '/clients',
      });
    } catch (e) {
      console.warn('Could not record system alert for tenant creation:', e);
    }

    return tenant;
  }

  /**
   * One-stop Full Onboarding (SRS Section 8 & 70)
   * Creates Tenant + Plan + Branding + Admin Account + Area Levels in 1 single transaction/flow
   */
  async onboardFull(dto: OnboardFullTenantDto, user?: any, ip?: string, userAgent?: string) {
    const tenant = await this.create(dto);

    let adminUserResult: any = null;
    if (dto.adminUser) {
      adminUserResult = await this.createAdminUser(tenant._id.toString(), {
        name: dto.adminUser.name,
        email: dto.adminUser.email,
        password: dto.adminUser.password,
        role: dto.adminUser.role || UserRole.LEADER,
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

  /**
   * Get 7-Step Onboarding Status Checklist (SRS Section 8 & 70)
   */
  async getOnboardingStatus(id: string) {
    const tenant = await this.tenantModel.findById(id).populate('planId', 'name slug price billingCycle features');
    if (!tenant) throw new NotFoundException('Tenant not found');

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
        .findOne({ tenantId: tenant._id, status: SubscriptionStatus.ACTIVE })
        .populate('planId', 'name price features'),
    ]);

    const enabledFeatures = features.filter((f) => f.isEnabled).map((f) => f.featureKey);

    // 7 Steps Validation
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
      isPublished: tenant.isPublished ?? (tenant.status === TenantStatus.ACTIVE),
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
            gstin: tenant.gstin || null,
            billingState: tenant.billingState || null,
            billingAddress: tenant.billingAddress || null,
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
            fields: regFields.map((f: any) => f.label || f.key),
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

  /**
   * Publish & Launch Tenant Platform (SRS Section 70 Step "Publish Platform")
   */
  async publishTenant(id: string, user?: any, ip?: string, userAgent?: string) {
    const tenant = await this.tenantModel.findById(id);
    if (!tenant) throw new NotFoundException('Tenant not found');

    tenant.status = TenantStatus.ACTIVE;
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

  async findOne(id: string) {
    const tenant = await this.tenantModel.findById(id);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async getFullProfile(id: string) {
    const tenant = await this.tenantModel.findById(id).lean();
    if (!tenant) throw new NotFoundException('Tenant not found');

    const tenantObjId = new Types.ObjectId(id);

    const [
      admins,
      features,
      areaLevels,
      areas,
      subscription,
      plan,
      totalCitizens,
      totalVolunteers,
      totalComplaints,
      totalEvents,
      totalPolls,
    ] = await Promise.all([
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

    const areaMap = new Map<string, any>();
    areas.forEach((a) => areaMap.set(a._id.toString(), { ...a, children: [] }));
    const areaTree: any[] = [];
    areas.forEach((a) => {
      if (a.parentId) {
        const parent = areaMap.get(a.parentId.toString());
        if (parent) parent.children.push(areaMap.get(a._id.toString()));
      } else {
        areaTree.push(areaMap.get(a._id.toString()));
      }
    });

    const regFields =
      tenant.settings?.registrationFields && tenant.settings.registrationFields.length > 0
        ? tenant.settings.registrationFields
        : DEFAULT_REGISTRATION_FIELDS;

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

  async update(id: string, dto: UpdateTenantDto) {
    const existing = await this.tenantModel.findById(id);
    if (!existing) throw new NotFoundException('Tenant not found');

    const updateSet: any = { ...dto };
    if (dto.gstin !== undefined) updateSet.gstin = dto.gstin ? dto.gstin.trim().toUpperCase() : null;
    if (dto.billingState !== undefined) updateSet.billingState = dto.billingState?.trim() || null;
    if (dto.billingAddress !== undefined) updateSet.billingAddress = dto.billingAddress?.trim() || null;

    // Sync name and title if one is updated
    if (dto.title && !dto.name) {
      updateSet.name = dto.title;
      updateSet.title = dto.title;
    } else if (dto.name && !dto.title) {
      updateSet.name = dto.name;
      if (!existing.title) updateSet.title = dto.name;
    }

    // Sync logo/logoUrl if updated at root
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

    // If branding object passed, merge it properly
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

    const tenant = await this.tenantModel.findByIdAndUpdate(
      id,
      { $set: updateSet },
      { new: true },
    );
    return tenant;
  }

  async updateBranding(id: any, branding: Record<string, any>) {
    const queryId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id.toString()) : id;
    const existing = await this.tenantModel.findById(queryId);
    if (!existing) throw new NotFoundException('Tenant not found');

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

    const updatePayload: any = { branding: sanitizedBranding };
    if (title && !existing.title) {
      updatePayload.title = title;
    }

    return this.tenantModel.findByIdAndUpdate(
      queryId,
      { $set: updatePayload },
      { new: true },
    );
  }

  async toggleFeature(tenantId: string, featureKey: FeatureKey, isEnabled: boolean) {
    const { Types } = await import('mongoose');
    return this.featureModel.findOneAndUpdate(
      { tenantId: new Types.ObjectId(tenantId), featureKey } as any,
      { $set: { isEnabled } },
      { new: true, upsert: true },
    );
  }

  async getFeatures(tenantId: string) {
    const { Types } = await import('mongoose');
    return this.featureModel.find({ tenantId: new Types.ObjectId(tenantId) } as any);
  }

  async createAdminUser(
    tenantId: string,
    data: { name: string; email: string; password: string; role: UserRole },
  ): Promise<any> {
    const { Types } = await import('mongoose');
    const tenantObjectId = new Types.ObjectId(tenantId);
    const emailLower = data.email.trim().toLowerCase();

    const tenant = await this.tenantModel.findById(tenantObjectId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const exists = await this.adminUserModel.findOne({
      $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId }],
      email: emailLower,
    });
    if (exists) {
      throw new ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
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

      const res: any = user.toObject ? user.toObject() : { ...user };
      delete res.passwordHash;
      return res;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
      }
      throw err;
    }
  }

  async suspend(id: string) {
    return this.tenantModel.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
  }

  async activate(id: string) {
    return this.tenantModel.findByIdAndUpdate(id, { status: 'active' }, { new: true });
  }

  /**
   * Impersonate a tenant (Login-as-client) with temporary JWT token and mandatory audit log
   * SRS Section 45.2 & Section 59
   */
  async impersonateTenant(
    tenantId: string,
    dto: ImpersonateTenantDto,
    superAdminUser: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    // Find existing active admin user for this tenant
    let adminUser = await this.adminUserModel.findOne({
      tenantId: tenant._id,
      isActive: true,
      isSuperAdmin: { $ne: true },
    });

    // If no adminUser exists for this tenant yet, create a default leader representation
    if (!adminUser) {
      const tempPasswordHash = await bcrypt.hash('ImpersonateSupport@123', 10);
      adminUser = await this.adminUserModel.create({
        tenantId: tenant._id,
        name: tenant.branding?.leaderName ? `${tenant.branding.leaderName} (Admin)` : `${tenant.name} Admin`,
        email: `${tenant.slug}-admin@platform.local`,
        passwordHash: tempPasswordHash,
        role: UserRole.LEADER,
        isActive: true,
        isSuperAdmin: false,
      });
    }

    const durationHours = Math.min(Math.max(Number(dto.durationHours) || 2, 1), 24);
    const expiresInSeconds = durationHours * 3600;
    const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';

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

    // Sign temporary JWT Token with tenant context and impersonation flag
    const token = jwt.sign(
      {
        sub: adminUser._id.toString(),
        email: adminUser.email,
        name: adminUser.name,
        tenantId: tenant._id.toString(),
        tenantSlug: tenant.slug,
        role: adminUser.role,
        isSuperAdmin: false,
        isImpersonated: true,
        impersonatedBy: impersonationSession.impersonatedBy,
      },
      secret,
      { expiresIn: `${durationHours}h` },
    );

    // Record Audit Log (Mandatory for SRS Sec 45.2 & Sec 59)
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

  /**
   * Exit an impersonation session and log the event
   */
  async exitImpersonation(
    tenantId: string,
    dto: ExitImpersonationDto,
    user: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

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

  /**
   * Get past impersonation history for a specific tenant
   */
  async getImpersonationHistory(tenantId: string) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.auditLogsService.findAll({
      tenantId,
      action: 'TENANT_IMPERSONATION_STARTED',
      limit: 50,
    });
  }

  /**
   * Get admin users for a specific tenant (Super Admin use)
   * GET /super-admin/tenants/:id/admin-users
   */
  async getAdminUsers(tenantId: string) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const admins = await this.adminUserModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .select('name email role isActive createdAt')
      .lean();

    return admins;
  }

  /**
   * Reset password for a specific tenant admin user
   * PATCH /super-admin/tenants/:id/admin-users/:adminUserId/reset-password
   */
  async resetAdminPassword(tenantId: string, adminUserId: string, newPassword?: string) {
    if (!newPassword || newPassword.trim().length < 6) {
      throw new BadRequestException('New password must be at least 6 characters long.');
    }

    const { Types } = await import('mongoose');
    let tenantObjectId: Types.ObjectId;
    let userObjectId: Types.ObjectId;

    try {
      tenantObjectId = new Types.ObjectId(tenantId);
      userObjectId = new Types.ObjectId(adminUserId);
    } catch {
      throw new BadRequestException('Invalid tenant or admin user ID format.');
    }

    const tenant = await this.tenantModel.findById(tenantObjectId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const admin = await this.adminUserModel.findOne({
      _id: userObjectId,
      $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId as any }],
    });
    if (!admin) throw new NotFoundException('Admin user not found for this tenant');

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

  /**
   * Delete a tenant admin user
   * DELETE /super-admin/tenants/:id/admin-users/:adminUserId
   */
  async deleteAdminUser(tenantId: string, adminUserId: string) {
    const { Types } = await import('mongoose');
    let tenantObjectId: Types.ObjectId;
    let userObjectId: Types.ObjectId;

    try {
      tenantObjectId = new Types.ObjectId(tenantId);
      userObjectId = new Types.ObjectId(adminUserId);
    } catch {
      throw new BadRequestException('Invalid tenant or admin user ID format.');
    }

    const tenant = await this.tenantModel.findById(tenantObjectId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const admin = await this.adminUserModel.findOneAndDelete({
      _id: userObjectId,
      $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId as any }],
    });
    if (!admin) throw new NotFoundException('Admin user not found for this tenant');

    return {
      message: `Admin user ${admin.email} deleted successfully.`,
    };
  }
}

import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from './tenant.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserDocument } from '../admin-users/admin-user.schema';
import { AreaLevelDocument } from '../areas/area.schema';
import { SubscriptionDocument } from '../subscriptions/subscription.schema';
import { PlanDocument } from '../plans/plan.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateTenantDto, UpdateTenantDto, ImpersonateTenantDto, ExitImpersonationDto, OnboardFullTenantDto } from './tenant.dto';
import { FeatureKey, UserRole, TenantStatus } from '../../shared/types';
export declare class TenantsService {
    private tenantModel;
    private featureModel;
    private adminUserModel;
    private areaLevelModel;
    private subscriptionModel;
    private planModel;
    private configService;
    private auditLogsService;
    constructor(tenantModel: Model<TenantDocument>, featureModel: Model<TenantFeatureDocument>, adminUserModel: Model<AdminUserDocument>, areaLevelModel: Model<AreaLevelDocument>, subscriptionModel: Model<SubscriptionDocument>, planModel: Model<PlanDocument>, configService: ConfigService, auditLogsService: AuditLogsService);
    create(dto: CreateTenantDto): Promise<TenantDocument>;
    onboardFull(dto: OnboardFullTenantDto, user?: any, ip?: string, userAgent?: string): Promise<{
        message: string;
        tenant: TenantDocument;
        adminUser: {
            id: any;
            name: any;
            email: any;
            role: any;
        } | null;
        onboardingStatus: {
            tenantId: Types.ObjectId;
            slug: string;
            name: string;
            title: string;
            status: TenantStatus;
            isPublished: boolean;
            completionPercentage: number;
            isReadyToPublish: boolean;
            steps: {
                step1_tenantProfile: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        name: string;
                        title: string;
                        slug: string;
                        leaderName: string | null;
                        electionType: string;
                        contactPerson: string | null;
                        mobileNumber: string | null;
                        email: string | null;
                    };
                };
                step2_branding: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        title: string | null;
                        platformName: string | null;
                        logo: string | null;
                        logoUrl: string | null;
                        leaderName: string | null;
                        leaderPhotoUrl: string | null;
                        faviconUrl: string | null;
                        pwaIconUrl: string | null;
                        loginBgUrl: string | null;
                        splashScreenUrl: string | null;
                        splashScreens: {
                            title?: string;
                            subtitle?: string;
                            mediaType?: "image" | "video";
                            mediaUrl: string;
                            order?: number;
                        }[];
                        primaryColor: string | null;
                        secondaryColor: string | null;
                        accentColor: string | null;
                        tagline: string | null;
                        footerText: string | null;
                        privacyPolicyUrl: string | null;
                        termsUrl: string | null;
                        privacyPolicyContent: string | null;
                        termsContent: string | null;
                    };
                };
                step3_domain: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        subdomain: string;
                        customDomain: string | null;
                        isCustomDomainVerified: boolean;
                    };
                };
                step4_modulesAndPlan: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        plan: Types.ObjectId | null;
                        subscriptionStatus: string;
                        enabledModulesCount: number;
                        enabledModules: FeatureKey[];
                    };
                };
                step5_areaHierarchy: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        configuredLevelCount: number;
                        levels: string[];
                    };
                };
                step6_registrationForm: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        fieldCount: number;
                        fields: any[];
                    };
                };
                step7_adminAccount: {
                    step: number;
                    name: string;
                    completed: boolean;
                    data: {
                        adminCount: number;
                        admins: {
                            name: string;
                            email: string;
                            role: string;
                        }[];
                    };
                };
            };
        };
    }>;
    getOnboardingStatus(id: string): Promise<{
        tenantId: Types.ObjectId;
        slug: string;
        name: string;
        title: string;
        status: TenantStatus;
        isPublished: boolean;
        completionPercentage: number;
        isReadyToPublish: boolean;
        steps: {
            step1_tenantProfile: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    name: string;
                    title: string;
                    slug: string;
                    leaderName: string | null;
                    electionType: string;
                    contactPerson: string | null;
                    mobileNumber: string | null;
                    email: string | null;
                };
            };
            step2_branding: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    title: string | null;
                    platformName: string | null;
                    logo: string | null;
                    logoUrl: string | null;
                    leaderName: string | null;
                    leaderPhotoUrl: string | null;
                    faviconUrl: string | null;
                    pwaIconUrl: string | null;
                    loginBgUrl: string | null;
                    splashScreenUrl: string | null;
                    splashScreens: {
                        title?: string;
                        subtitle?: string;
                        mediaType?: "image" | "video";
                        mediaUrl: string;
                        order?: number;
                    }[];
                    primaryColor: string | null;
                    secondaryColor: string | null;
                    accentColor: string | null;
                    tagline: string | null;
                    footerText: string | null;
                    privacyPolicyUrl: string | null;
                    termsUrl: string | null;
                    privacyPolicyContent: string | null;
                    termsContent: string | null;
                };
            };
            step3_domain: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    subdomain: string;
                    customDomain: string | null;
                    isCustomDomainVerified: boolean;
                };
            };
            step4_modulesAndPlan: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    plan: Types.ObjectId | null;
                    subscriptionStatus: string;
                    enabledModulesCount: number;
                    enabledModules: FeatureKey[];
                };
            };
            step5_areaHierarchy: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    configuredLevelCount: number;
                    levels: string[];
                };
            };
            step6_registrationForm: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    fieldCount: number;
                    fields: any[];
                };
            };
            step7_adminAccount: {
                step: number;
                name: string;
                completed: boolean;
                data: {
                    adminCount: number;
                    admins: {
                        name: string;
                        email: string;
                        role: string;
                    }[];
                };
            };
        };
    }>;
    publishTenant(id: string, user?: any, ip?: string, userAgent?: string): Promise<{
        message: string;
        tenant: {
            id: Types.ObjectId;
            slug: string;
            name: string;
            status: TenantStatus.ACTIVE;
            isPublished: boolean;
        };
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateTenantDto): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateBranding(id: string, branding: Record<string, any>): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    toggleFeature(tenantId: string, featureKey: FeatureKey, isEnabled: boolean): Promise<import("mongoose").Document<unknown, {}, TenantFeatureDocument, {}, import("mongoose").DefaultSchemaOptions> & TenantFeature & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getFeatures(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, TenantFeatureDocument, {}, import("mongoose").DefaultSchemaOptions> & TenantFeature & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    createAdminUser(tenantId: string, data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }): Promise<any>;
    suspend(id: string): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(id: string): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    impersonateTenant(tenantId: string, dto: ImpersonateTenantDto, superAdminUser: any, ipAddress?: string, userAgent?: string): Promise<{
        token: string;
        expiresIn: number;
        tenant: {
            id: Types.ObjectId;
            name: string;
            slug: string;
            customDomain: string | null;
            status: TenantStatus;
        };
        adminUser: {
            id: Types.ObjectId;
            name: string;
            email: string;
            role: string;
        };
        impersonation: {
            isImpersonated: boolean;
            impersonatedBy: {
                id: any;
                email: any;
                name: any;
            };
            reason: string;
            startedAt: Date;
            expiresAt: Date;
        };
        message: string;
    }>;
    exitImpersonation(tenantId: string, dto: ExitImpersonationDto, user: any, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
        tenantId: Types.ObjectId;
        endedAt: Date;
    }>;
    getImpersonationHistory(tenantId: string): Promise<{
        items: (import("../audit-logs/audit-log.schema").AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getAdminUsers(tenantId: string): Promise<(AdminUser & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    resetAdminPassword(tenantId: string, adminUserId: string, newPassword?: string): Promise<{
        message: string;
        admin: {
            id: Types.ObjectId;
            name: string;
            email: string;
            role: string;
        };
    }>;
    deleteAdminUser(tenantId: string, adminUserId: string): Promise<{
        message: string;
    }>;
}

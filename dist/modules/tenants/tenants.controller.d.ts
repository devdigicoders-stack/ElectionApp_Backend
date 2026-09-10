import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto, ImpersonateTenantDto, ExitImpersonationDto, UpdateBrandingDto, OnboardFullTenantDto } from './tenant.dto';
import { FeatureKey, UserRole } from '../../shared/types';
export declare class TenantsController {
    private tenantsService;
    constructor(tenantsService: TenantsService);
    create(dto: CreateTenantDto): Promise<import("./tenant.schema").TenantDocument>;
    onboardFull(dto: OnboardFullTenantDto, req: any): Promise<{
        message: string;
        tenant: import("./tenant.schema").TenantDocument;
        adminUser: {
            id: any;
            name: any;
            email: any;
            role: any;
        } | null;
        onboardingStatus: {
            tenantId: import("mongoose").Types.ObjectId;
            slug: string;
            name: string;
            status: import("../../shared/types").TenantStatus;
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
                        platformName: string;
                        leaderName: string | null;
                        logoUrl: string | null;
                        leaderPhotoUrl: string | null;
                        faviconUrl: string | null;
                        pwaIconUrl: string | null;
                        loginBgUrl: string | null;
                        splashScreenUrl: string | null;
                        primaryColor: string | null;
                        secondaryColor: string | null;
                        tagline: string | null;
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
                        plan: import("mongoose").Types.ObjectId | null;
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
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getOnboardingStatus(id: string): Promise<{
        tenantId: import("mongoose").Types.ObjectId;
        slug: string;
        name: string;
        status: import("../../shared/types").TenantStatus;
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
                    platformName: string;
                    leaderName: string | null;
                    logoUrl: string | null;
                    leaderPhotoUrl: string | null;
                    faviconUrl: string | null;
                    pwaIconUrl: string | null;
                    loginBgUrl: string | null;
                    splashScreenUrl: string | null;
                    primaryColor: string | null;
                    secondaryColor: string | null;
                    tagline: string | null;
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
                    plan: import("mongoose").Types.ObjectId | null;
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
    publish(id: string, req: any): Promise<{
        message: string;
        tenant: {
            id: import("mongoose").Types.ObjectId;
            slug: string;
            name: string;
            status: import("../../shared/types").TenantStatus.ACTIVE;
            isPublished: boolean;
        };
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateTenantDto): Promise<import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateBranding(id: string, branding: UpdateBrandingDto): Promise<(import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getFeatures(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../features/tenant-feature.schema").TenantFeatureDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../features/tenant-feature.schema").TenantFeature & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    toggleFeature(id: string, featureKey: FeatureKey, isEnabled: boolean): Promise<import("mongoose").Document<unknown, {}, import("../features/tenant-feature.schema").TenantFeatureDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../features/tenant-feature.schema").TenantFeature & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    createAdminUser(tenantId: string, body: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }): Promise<any>;
    suspend(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    impersonate(id: string, dto: ImpersonateTenantDto, req: any): Promise<{
        token: string;
        expiresIn: number;
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
            customDomain: string | null;
            status: import("../../shared/types").TenantStatus;
        };
        adminUser: {
            id: import("mongoose").Types.ObjectId;
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
    exitImpersonation(id: string, dto: ExitImpersonationDto, req: any): Promise<{
        message: string;
        tenantId: import("mongoose").Types.ObjectId;
        endedAt: Date;
    }>;
    getImpersonationHistory(id: string): Promise<{
        items: (import("../audit-logs/audit-log.schema").AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
}

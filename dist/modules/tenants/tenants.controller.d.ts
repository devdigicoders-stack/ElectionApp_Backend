import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto, ImpersonateTenantDto, ExitImpersonationDto } from './tenant.dto';
import { FeatureKey, UserRole } from '../../shared/types';
export declare class TenantsController {
    private tenantsService;
    constructor(tenantsService: TenantsService);
    create(dto: CreateTenantDto): Promise<import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
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
    updateBranding(id: string, branding: Record<string, any>): Promise<(import("mongoose").Document<unknown, {}, import("./tenant.schema").TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./tenant.schema").Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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

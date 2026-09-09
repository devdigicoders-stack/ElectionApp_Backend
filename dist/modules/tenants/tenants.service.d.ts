import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './tenant.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import { AdminUserDocument } from '../admin-users/admin-user.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateTenantDto, UpdateTenantDto, ImpersonateTenantDto, ExitImpersonationDto } from './tenant.dto';
import { FeatureKey, UserRole } from '../../shared/types';
export declare class TenantsService {
    private tenantModel;
    private featureModel;
    private adminUserModel;
    private configService;
    private auditLogsService;
    constructor(tenantModel: Model<TenantDocument>, featureModel: Model<TenantFeatureDocument>, adminUserModel: Model<AdminUserDocument>, configService: ConfigService, auditLogsService: AuditLogsService);
    create(dto: CreateTenantDto): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: UpdateTenantDto): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateBranding(id: string, branding: Record<string, any>): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    toggleFeature(tenantId: string, featureKey: FeatureKey, isEnabled: boolean): Promise<import("mongoose").Document<unknown, {}, TenantFeatureDocument, {}, import("mongoose").DefaultSchemaOptions> & TenantFeature & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getFeatures(tenantId: string): Promise<(import("mongoose").Document<unknown, {}, TenantFeatureDocument, {}, import("mongoose").DefaultSchemaOptions> & TenantFeature & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
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
    suspend(id: string): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    activate(id: string): Promise<(import("mongoose").Document<unknown, {}, TenantDocument, {}, import("mongoose").DefaultSchemaOptions> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    impersonateTenant(tenantId: string, dto: ImpersonateTenantDto, superAdminUser: any, ipAddress?: string, userAgent?: string): Promise<{
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
    exitImpersonation(tenantId: string, dto: ExitImpersonationDto, user: any, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
        tenantId: import("mongoose").Types.ObjectId;
        endedAt: Date;
    }>;
    getImpersonationHistory(tenantId: string): Promise<{
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

import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { TenantDocument } from './tenant.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { DomainQueryDto } from './custom-domain.dto';
export declare class CustomDomainsService {
    private tenantModel;
    private configService;
    private auditLogsService;
    constructor(tenantModel: Model<TenantDocument>, configService: ConfigService, auditLogsService: AuditLogsService);
    private normalizeDomain;
    private validateDomain;
    configureDomain(tenantId: string, rawDomain: string, user?: any, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
        customDomain: string;
        status: string;
        verificationToken: string;
        targetCname: string;
        dnsRecords: ({
            type: "TXT";
            name: string;
            value: string;
            purpose: string;
            ttl: string;
        } | {
            type: "CNAME";
            name: string;
            value: string;
            purpose: string;
            ttl: string;
        } | {
            type: "A";
            name: string;
            value: string;
            purpose: string;
            ttl: string;
        })[];
        instructions: string[];
    }>;
    getDomainStatus(tenantId: string): Promise<{
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
        configuredDomain: string | null;
        isActive: boolean;
        isVerified: boolean;
        verifiedAt: Date | null;
        verificationStatus: "pending" | "unconfigured" | "verified" | "failed";
        verificationToken: string | null;
        targetCname: string;
        dnsRecords: {
            type: "TXT" | "CNAME" | "A";
            name: string;
            value: string;
            purpose: string;
            ttl?: string;
        }[];
        lastCheckedAt: Date | null;
        failureReason: string | null;
    }>;
    verifyDomain(tenantId: string, options?: {
        forceVerify?: boolean;
        method?: 'AUTO' | 'TXT' | 'CNAME';
    }, user?: any, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
        verified: boolean;
        method: string;
        domain: string;
        verifiedAt: Date;
        message: string;
        status?: undefined;
        matchedVia?: undefined;
        diagnostics?: undefined;
        troubleshooting?: undefined;
    } | {
        success: boolean;
        verified: boolean;
        status: string;
        domain: string;
        verifiedAt: Date;
        matchedVia: string;
        message: string;
        method?: undefined;
        diagnostics?: undefined;
        troubleshooting?: undefined;
    } | {
        success: boolean;
        verified: boolean;
        status: string;
        domain: string;
        message: string;
        diagnostics: {
            txtCheck: {
                hostQueried: string;
                expectedToken: string | null | undefined;
                detectedRecords: string[];
                matched: boolean;
            };
            cnameCheck: {
                hostQueried: string;
                expectedTarget: string;
                detectedRecords: string[];
                matched: boolean;
            };
        };
        troubleshooting: string[];
        method?: undefined;
        verifiedAt?: undefined;
        matchedVia?: undefined;
    }>;
    removeDomain(tenantId: string, user?: any, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
    }>;
    listAllDomains(query: DomainQueryDto): Promise<{
        data: {
            tenantId: any;
            tenantName: any;
            tenantSlug: any;
            tenantStatus: any;
            domain: any;
            isVerified: boolean;
            status: any;
            verifiedAt: any;
            targetCname: any;
            lastCheckedAt: any;
            failureReason: any;
            createdAt: any;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            stats: {
                totalConfigured: number;
                verified: number;
                pending: number;
                failed: number;
            };
        };
    }>;
}

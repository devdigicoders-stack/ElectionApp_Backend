import { CustomDomainsService } from './custom-domains.service';
import { ConfigureDomainDto, VerifyDomainDto, DomainQueryDto } from './custom-domain.dto';
export declare class SuperAdminDomainsController {
    private readonly customDomainsService;
    constructor(customDomainsService: CustomDomainsService);
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
    getTenantDomain(tenantId: string): Promise<{
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
        configuredDomain: string | null;
        isActive: boolean;
        isVerified: boolean;
        verifiedAt: Date | null;
        verificationStatus: "unconfigured" | "pending" | "verified" | "failed";
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
    configureTenantDomain(tenantId: string, dto: ConfigureDomainDto, req: any): Promise<{
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
    verifyTenantDomain(tenantId: string, dto: VerifyDomainDto, req: any): Promise<{
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
    removeTenantDomain(tenantId: string, req: any): Promise<{
        success: boolean;
        message: string;
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
    }>;
}

import { CustomDomainsService } from './custom-domains.service';
import { ConfigureDomainDto } from './custom-domain.dto';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class TenantDomainController {
    private readonly customDomainsService;
    constructor(customDomainsService: CustomDomainsService);
    getMyDomainStatus(req: TenantRequest): Promise<{
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
        configuredDomain: string | null;
        isActive: boolean;
        isVerified: boolean;
        verifiedAt: Date | null;
        verificationStatus: "pending" | "failed" | "verified" | "unconfigured";
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
    configureMyDomain(req: TenantRequest, dto: ConfigureDomainDto): Promise<{
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
    verifyMyDomain(req: TenantRequest): Promise<{
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
    removeMyDomain(req: TenantRequest): Promise<{
        success: boolean;
        message: string;
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
        };
    }>;
}

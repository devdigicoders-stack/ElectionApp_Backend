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
exports.CustomDomainsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const dns = __importStar(require("dns"));
const tenant_schema_1 = require("./tenant.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let CustomDomainsService = class CustomDomainsService {
    constructor(tenantModel, configService, auditLogsService) {
        this.tenantModel = tenantModel;
        this.configService = configService;
        this.auditLogsService = auditLogsService;
    }
    toId(id) {
        return mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
    }
    normalizeDomain(rawDomain) {
        if (!rawDomain)
            throw new common_1.BadRequestException('Domain name is required');
        let domain = rawDomain.trim().toLowerCase();
        domain = domain.replace(/^https?:\/\//i, '');
        domain = domain.split('/')[0];
        domain = domain.split(':')[0];
        return domain;
    }
    validateDomain(domain) {
        const reserved = [
            'localhost',
            '127.0.0.1',
            'madiyayu.com',
            'api.madiyayu.com',
            'admin.madiyayu.com',
            'app.madiyayu.com',
            'superadmin.madiyayu.com',
            'demo.madiyayu.com',
        ];
        if (reserved.includes(domain)) {
            throw new common_1.BadRequestException(`Domain "${domain}" is a reserved system domain and cannot be used.`);
        }
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) {
            throw new common_1.BadRequestException(`Invalid domain format: "${domain}". Example valid format: leadername.in or www.leadername.in`);
        }
    }
    async configureDomain(tenantId, rawDomain, user, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(this.toId(tenantId));
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const cleanDomain = this.normalizeDomain(rawDomain);
        this.validateDomain(cleanDomain);
        const existing = await this.tenantModel.findOne({
            _id: { $ne: tenant._id },
            $or: [
                { customDomain: cleanDomain },
                { 'customDomainVerification.domain': cleanDomain },
            ],
        });
        if (existing) {
            throw new common_1.ConflictException(`Domain "${cleanDomain}" is already connected or pending verification for another tenant ("${existing.name}").`);
        }
        const verificationToken = `madiyayu-verify-${crypto.randomBytes(12).toString('hex')}`;
        const targetCname = this.configService.get('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com';
        const serverIp = this.configService.get('PLATFORM_SERVER_IP') || '76.76.21.21';
        const isWwwOrSubdomain = cleanDomain.split('.').length > 2;
        const subdomainPart = isWwwOrSubdomain ? cleanDomain.split('.')[0] : 'www';
        const dnsRecords = [
            {
                type: 'TXT',
                name: `_madiyayu-challenge.${cleanDomain}`,
                value: verificationToken,
                purpose: 'Domain Ownership Verification (Required)',
                ttl: '300 (or Auto)',
            },
            {
                type: 'CNAME',
                name: isWwwOrSubdomain ? subdomainPart : 'www',
                value: targetCname,
                purpose: 'Traffic Routing to SaaS Platform',
                ttl: '300 (or Auto)',
            },
            ...(!isWwwOrSubdomain
                ? [
                    {
                        type: 'A',
                        name: '@',
                        value: serverIp,
                        purpose: 'Root Apex Routing (Optional, or use DNS CNAME Flattening/ALIAS)',
                        ttl: '300 (or Auto)',
                    },
                ]
                : []),
        ];
        tenant.customDomainVerification = {
            domain: cleanDomain,
            status: 'pending',
            verificationToken,
            targetCname,
            dnsRecords,
            lastCheckedAt: null,
            failureReason: null,
        };
        await tenant.save();
        const performedBy = {
            id: user?.sub || user?.id || 'system',
            email: user?.email || 'admin@madiyayu.com',
            name: user?.name || 'Administrator',
            role: user?.role || 'super_admin',
        };
        await this.auditLogsService.log({
            action: 'CUSTOM_DOMAIN_CONFIGURED',
            tenantId: tenant._id,
            tenantName: tenant.name,
            performedBy,
            details: {
                customDomain: cleanDomain,
                verificationToken,
                status: 'pending',
            },
            ipAddress,
            userAgent,
        });
        return {
            message: `Custom domain "${cleanDomain}" configured successfully. Add the following DNS records in your domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) and click Verify.`,
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
            },
            customDomain: cleanDomain,
            status: 'pending',
            verificationToken,
            targetCname,
            dnsRecords,
            instructions: [
                `1. Log in to your DNS provider (e.g. GoDaddy, Namecheap, Cloudflare, Hostinger).`,
                `2. Add a TXT record with Name "_madiyayu-challenge.${cleanDomain}" and Value "${verificationToken}".`,
                `3. Add a CNAME record with Name "${isWwwOrSubdomain ? subdomainPart : 'www'}" pointing to "${targetCname}".`,
                `4. Wait 2-15 minutes for DNS propagation, then run the verification endpoint.`,
            ],
        };
    }
    async getDomainStatus(tenantId) {
        const tenant = await this.tenantModel.findById(this.toId(tenantId)).select('name slug customDomain isCustomDomainVerified customDomainVerifiedAt customDomainVerification');
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const domainMeta = tenant.customDomainVerification || {
            domain: tenant.customDomain || null,
            status: tenant.isCustomDomainVerified ? 'verified' : (tenant.customDomain ? 'pending' : 'unconfigured'),
            verificationToken: null,
            targetCname: this.configService.get('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com',
            dnsRecords: [],
            lastCheckedAt: null,
            failureReason: null,
        };
        return {
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
            },
            configuredDomain: domainMeta.domain || tenant.customDomain || null,
            isActive: !!tenant.customDomain && !!tenant.isCustomDomainVerified,
            isVerified: !!tenant.isCustomDomainVerified,
            verifiedAt: tenant.customDomainVerifiedAt || null,
            verificationStatus: domainMeta.status || 'unconfigured',
            verificationToken: domainMeta.verificationToken || null,
            targetCname: domainMeta.targetCname || 'cname.madiyayu.com',
            dnsRecords: domainMeta.dnsRecords || [],
            lastCheckedAt: domainMeta.lastCheckedAt || null,
            failureReason: domainMeta.failureReason || null,
        };
    }
    async verifyDomain(tenantId, options = {}, user, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(this.toId(tenantId));
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const domainMeta = tenant.customDomainVerification;
        const domain = domainMeta?.domain || tenant.customDomain;
        if (!domain) {
            throw new common_1.BadRequestException('No custom domain has been configured for this tenant. Please configure a domain first.');
        }
        const verificationToken = domainMeta?.verificationToken;
        const targetCname = domainMeta?.targetCname || this.configService.get('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com';
        const performedBy = {
            id: user?.sub || user?.id || 'system',
            email: user?.email || 'admin@madiyayu.com',
            name: user?.name || 'Administrator',
            role: user?.role || 'super_admin',
        };
        if (options.forceVerify) {
            tenant.customDomain = domain;
            tenant.isCustomDomainVerified = true;
            tenant.customDomainVerifiedAt = new Date();
            if (tenant.customDomainVerification) {
                tenant.customDomainVerification.status = 'verified';
                tenant.customDomainVerification.lastCheckedAt = new Date();
                tenant.customDomainVerification.failureReason = null;
            }
            await tenant.save();
            await this.auditLogsService.log({
                action: 'CUSTOM_DOMAIN_FORCE_VERIFIED',
                tenantId: tenant._id,
                tenantName: tenant.name,
                performedBy,
                details: {
                    customDomain: domain,
                    overrideBy: performedBy.email,
                    verifiedAt: new Date(),
                },
                ipAddress,
                userAgent,
            });
            return {
                success: true,
                verified: true,
                method: 'manual_override',
                domain,
                verifiedAt: tenant.customDomainVerifiedAt,
                message: `Custom domain "${domain}" was manually verified by Super Admin. Platform routing is now active.`,
            };
        }
        const resolver = new dns.promises.Resolver();
        resolver.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);
        const challengeHost = `_madiyayu-challenge.${domain}`;
        let txtMatched = false;
        let detectedTxtRecords = [];
        try {
            const records = await resolver.resolveTxt(challengeHost);
            detectedTxtRecords = records.flat();
            if (verificationToken && detectedTxtRecords.some((txt) => txt.includes(verificationToken))) {
                txtMatched = true;
            }
        }
        catch (_) {
            try {
                const rootRecords = await resolver.resolveTxt(domain);
                const flatRoot = rootRecords.flat();
                detectedTxtRecords.push(...flatRoot);
                if (verificationToken && flatRoot.some((txt) => txt.includes(verificationToken))) {
                    txtMatched = true;
                }
            }
            catch (__) { }
        }
        let cnameMatched = false;
        let detectedCnameRecords = [];
        try {
            const cnames = await resolver.resolveCname(domain);
            detectedCnameRecords = cnames;
            const normalizedTarget = targetCname.toLowerCase().replace(/\.$/, '');
            cnameMatched = cnames.some((c) => {
                const normalized = c.toLowerCase().replace(/\.$/, '');
                return normalized === normalizedTarget || normalized.includes(normalizedTarget);
            });
        }
        catch (_) { }
        const isVerified = txtMatched || cnameMatched;
        if (isVerified) {
            tenant.customDomain = domain;
            tenant.isCustomDomainVerified = true;
            tenant.customDomainVerifiedAt = new Date();
            if (tenant.customDomainVerification) {
                tenant.customDomainVerification.status = 'verified';
                tenant.customDomainVerification.lastCheckedAt = new Date();
                tenant.customDomainVerification.failureReason = null;
            }
            await tenant.save();
            await this.auditLogsService.log({
                action: 'CUSTOM_DOMAIN_VERIFIED',
                tenantId: tenant._id,
                tenantName: tenant.name,
                performedBy,
                details: {
                    customDomain: domain,
                    txtMatched,
                    cnameMatched,
                    verifiedAt: new Date(),
                },
                ipAddress,
                userAgent,
            });
            return {
                success: true,
                verified: true,
                status: 'verified',
                domain,
                verifiedAt: tenant.customDomainVerifiedAt,
                matchedVia: txtMatched && cnameMatched ? 'BOTH_TXT_AND_CNAME' : txtMatched ? 'TXT_CHALLENGE' : 'CNAME_RECORD',
                message: `Custom domain "${domain}" verified successfully! Traffic directed to "${domain}" will now resolve directly to ${tenant.name}.`,
            };
        }
        if (tenant.customDomainVerification) {
            tenant.customDomainVerification.status = 'failed';
            tenant.customDomainVerification.lastCheckedAt = new Date();
            tenant.customDomainVerification.failureReason = 'DNS records not yet detected or mismatched.';
        }
        await tenant.save();
        return {
            success: false,
            verified: false,
            status: 'failed',
            domain,
            message: `DNS verification could not be confirmed for "${domain}". DNS records may still be propagating.`,
            diagnostics: {
                txtCheck: {
                    hostQueried: challengeHost,
                    expectedToken: verificationToken,
                    detectedRecords: detectedTxtRecords,
                    matched: txtMatched,
                },
                cnameCheck: {
                    hostQueried: domain,
                    expectedTarget: targetCname,
                    detectedRecords: detectedCnameRecords,
                    matched: cnameMatched,
                },
            },
            troubleshooting: [
                'DNS propagation typically takes 5-30 minutes, but can take up to 24-48 hours depending on TTL.',
                `Ensure the TXT record host is set to "_madiyayu-challenge" or "_madiyayu-challenge.${domain}".`,
                `Ensure the TXT record value matches: "${verificationToken}".`,
                `If using Cloudflare, ensure Proxy status is set to "DNS Only" (Grey Cloud) during verification.`,
                'Super Admin can also use forceVerify: true to bypass DNS checks for testing or priority onboarding.',
            ],
        };
    }
    async removeDomain(tenantId, user, ipAddress, userAgent) {
        const tenant = await this.tenantModel.findById(this.toId(tenantId));
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const previousDomain = tenant.customDomain || tenant.customDomainVerification?.domain;
        tenant.customDomain = undefined;
        tenant.isCustomDomainVerified = false;
        tenant.customDomainVerifiedAt = undefined;
        tenant.customDomainVerification = {
            domain: null,
            status: 'unconfigured',
            verificationToken: null,
            targetCname: this.configService.get('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com',
            dnsRecords: [],
            lastCheckedAt: null,
            failureReason: null,
        };
        await tenant.save();
        const performedBy = {
            id: user?.sub || user?.id || 'system',
            email: user?.email || 'admin@madiyayu.com',
            name: user?.name || 'Administrator',
            role: user?.role || 'super_admin',
        };
        if (previousDomain) {
            await this.auditLogsService.log({
                action: 'CUSTOM_DOMAIN_REMOVED',
                tenantId: tenant._id,
                tenantName: tenant.name,
                performedBy,
                details: {
                    previousDomain,
                    removedAt: new Date(),
                },
                ipAddress,
                userAgent,
            });
        }
        return {
            success: true,
            message: `Custom domain ${previousDomain ? `"${previousDomain}" ` : ''}has been disconnected from ${tenant.name}. Default subdomain "${tenant.slug}.madiyayu.com" remains active.`,
            tenant: {
                id: tenant._id,
                name: tenant.name,
                slug: tenant.slug,
            },
        };
    }
    async listAllDomains(query) {
        const { search, status = 'all', page = 1, limit = 20 } = query;
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.max(1, Number(limit));
        const skip = (pageNum - 1) * limitNum;
        const filter = {};
        if (status === 'verified') {
            filter.isCustomDomainVerified = true;
        }
        else if (status === 'pending') {
            filter['customDomainVerification.status'] = 'pending';
            filter.isCustomDomainVerified = false;
        }
        else if (status === 'failed') {
            filter['customDomainVerification.status'] = 'failed';
        }
        else if (status === 'unconfigured') {
            filter.customDomain = { $in: [null, undefined] };
            filter['customDomainVerification.domain'] = { $in: [null, undefined] };
        }
        if (search) {
            filter.$or = [
                { customDomain: { $regex: search, $options: 'i' } },
                { 'customDomainVerification.domain': { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
            ];
        }
        const [tenants, total, verifiedCount, pendingCount, failedCount] = await Promise.all([
            this.tenantModel
                .find(filter)
                .select('name slug status customDomain isCustomDomainVerified customDomainVerifiedAt customDomainVerification createdAt')
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            this.tenantModel.countDocuments(filter),
            this.tenantModel.countDocuments({ isCustomDomainVerified: true }),
            this.tenantModel.countDocuments({
                'customDomainVerification.status': 'pending',
                isCustomDomainVerified: false,
            }),
            this.tenantModel.countDocuments({ 'customDomainVerification.status': 'failed' }),
        ]);
        const items = tenants.map((t) => {
            const dMeta = t.customDomainVerification || {};
            const domain = t.customDomain || dMeta.domain || null;
            return {
                tenantId: t._id,
                tenantName: t.name,
                tenantSlug: t.slug,
                tenantStatus: t.status,
                domain,
                isVerified: !!t.isCustomDomainVerified,
                status: t.isCustomDomainVerified ? 'verified' : (dMeta.status || (domain ? 'pending' : 'unconfigured')),
                verifiedAt: t.customDomainVerifiedAt || null,
                targetCname: dMeta.targetCname || 'cname.madiyayu.com',
                lastCheckedAt: dMeta.lastCheckedAt || null,
                failureReason: dMeta.failureReason || null,
                createdAt: t.createdAt,
            };
        });
        return {
            data: items,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 1,
                stats: {
                    totalConfigured: verifiedCount + pendingCount + failedCount,
                    verified: verifiedCount,
                    pending: pendingCount,
                    failed: failedCount,
                },
            },
        };
    }
};
exports.CustomDomainsService = CustomDomainsService;
exports.CustomDomainsService = CustomDomainsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        audit_logs_service_1.AuditLogsService])
], CustomDomainsService);
//# sourceMappingURL=custom-domains.service.js.map
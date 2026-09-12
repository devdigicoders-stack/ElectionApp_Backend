import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import * as dns from 'dns';
import { Tenant, TenantDocument } from './tenant.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { DomainQueryDto } from './custom-domain.dto';

@Injectable()
export class CustomDomainsService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    private configService: ConfigService,
    private auditLogsService: AuditLogsService,
  ) {}

  private toId(id: any) {
    return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
  }

  /**
   * Normalize and sanitize domain name
   */
  private normalizeDomain(rawDomain: string): string {
    if (!rawDomain) throw new BadRequestException('Domain name is required');
    let domain = rawDomain.trim().toLowerCase();
    // Strip protocol
    domain = domain.replace(/^https?:\/\//i, '');
    // Strip trailing slashes and paths
    domain = domain.split('/')[0];
    // Strip port numbers
    domain = domain.split(':')[0];
    return domain;
  }

  /**
   * Check if domain is reserved or prohibited
   */
  private validateDomain(domain: string): void {
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
      throw new BadRequestException(`Domain "${domain}" is a reserved system domain and cannot be used.`);
    }

    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      throw new BadRequestException(`Invalid domain format: "${domain}". Example valid format: leadername.in or www.leadername.in`);
    }
  }

  /**
   * Configure / update custom domain for a tenant
   * Generates verification token and detailed DNS instructions
   * SRS Section 8 Step 3 & Section 49
   */
  async configureDomain(
    tenantId: string,
    rawDomain: string,
    user?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(this.toId(tenantId));
    if (!tenant) throw new NotFoundException('Tenant not found');

    const cleanDomain = this.normalizeDomain(rawDomain);
    this.validateDomain(cleanDomain);

    // Check if domain is already registered to another tenant
    const existing = await this.tenantModel.findOne({
      _id: { $ne: tenant._id },
      $or: [
        { customDomain: cleanDomain },
        { 'customDomainVerification.domain': cleanDomain },
      ],
    });

    if (existing) {
      throw new ConflictException(`Domain "${cleanDomain}" is already connected or pending verification for another tenant ("${existing.name}").`);
    }

    // Generate unique verification token
    const verificationToken = `madiyayu-verify-${crypto.randomBytes(12).toString('hex')}`;
    const targetCname = this.configService.get<string>('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com';
    const serverIp = this.configService.get<string>('PLATFORM_SERVER_IP') || '76.76.21.21';

    const isWwwOrSubdomain = cleanDomain.split('.').length > 2;
    const subdomainPart = isWwwOrSubdomain ? cleanDomain.split('.')[0] : 'www';

    const dnsRecords = [
      {
        type: 'TXT' as const,
        name: `_madiyayu-challenge.${cleanDomain}`,
        value: verificationToken,
        purpose: 'Domain Ownership Verification (Required)',
        ttl: '300 (or Auto)',
      },
      {
        type: 'CNAME' as const,
        name: isWwwOrSubdomain ? subdomainPart : 'www',
        value: targetCname,
        purpose: 'Traffic Routing to SaaS Platform',
        ttl: '300 (or Auto)',
      },
      ...(!isWwwOrSubdomain
        ? [
            {
              type: 'A' as const,
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

    // Note: customDomain is not set active until verified
    await tenant.save();

    // Log in audit logs
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

  /**
   * Get domain configuration & DNS instructions for a tenant
   */
  async getDomainStatus(tenantId: string) {
    const tenant = await this.tenantModel.findById(this.toId(tenantId)).select(
      'name slug customDomain isCustomDomainVerified customDomainVerifiedAt customDomainVerification',
    );
    if (!tenant) throw new NotFoundException('Tenant not found');

    const domainMeta = tenant.customDomainVerification || {
      domain: tenant.customDomain || null,
      status: tenant.isCustomDomainVerified ? 'verified' : (tenant.customDomain ? 'pending' : 'unconfigured'),
      verificationToken: null,
      targetCname: this.configService.get<string>('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com',
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

  /**
   * Verify domain DNS records live on the internet
   * Supports TXT challenge verification, CNAME routing verification, or Super Admin force-verify
   * Uses Google (8.8.8.8) and Cloudflare (1.1.1.1) DNS to avoid local cache latency
   */
  async verifyDomain(
    tenantId: string,
    options: { forceVerify?: boolean; method?: 'AUTO' | 'TXT' | 'CNAME' } = {},
    user?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(this.toId(tenantId));
    if (!tenant) throw new NotFoundException('Tenant not found');

    const domainMeta = tenant.customDomainVerification;
    const domain = domainMeta?.domain || tenant.customDomain;

    if (!domain) {
      throw new BadRequestException('No custom domain has been configured for this tenant. Please configure a domain first.');
    }

    const verificationToken = domainMeta?.verificationToken;
    const targetCname = domainMeta?.targetCname || this.configService.get<string>('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com';

    const performedBy = {
      id: user?.sub || user?.id || 'system',
      email: user?.email || 'admin@madiyayu.com',
      name: user?.name || 'Administrator',
      role: user?.role || 'super_admin',
    };

    // 1. Super Admin Force Verification (Manual Override)
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

    // 2. Live DNS Verification using Node.js dns.promises.Resolver
    const resolver = new dns.promises.Resolver();
    // Use Cloudflare and Google public DNS resolvers for real-time propagation lookup
    resolver.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);

    const challengeHost = `_madiyayu-challenge.${domain}`;
    let txtMatched = false;
    let detectedTxtRecords: string[] = [];

    // Check TXT record at _madiyayu-challenge.<domain>
    try {
      const records = await resolver.resolveTxt(challengeHost);
      detectedTxtRecords = records.flat();
      if (verificationToken && detectedTxtRecords.some((txt) => txt.includes(verificationToken))) {
        txtMatched = true;
      }
    } catch (_) {
      // If challenge host not found, try root apex TXT
      try {
        const rootRecords = await resolver.resolveTxt(domain);
        const flatRoot = rootRecords.flat();
        detectedTxtRecords.push(...flatRoot);
        if (verificationToken && flatRoot.some((txt) => txt.includes(verificationToken))) {
          txtMatched = true;
        }
      } catch (__) {}
    }

    // Check CNAME record at <domain>
    let cnameMatched = false;
    let detectedCnameRecords: string[] = [];
    try {
      const cnames = await resolver.resolveCname(domain);
      detectedCnameRecords = cnames;
      const normalizedTarget = targetCname.toLowerCase().replace(/\.$/, '');
      cnameMatched = cnames.some((c) => {
        const normalized = c.toLowerCase().replace(/\.$/, '');
        return normalized === normalizedTarget || normalized.includes(normalizedTarget);
      });
    } catch (_) {}

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

    // Verification Failed
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

  /**
   * Remove / unlink custom domain from tenant
   */
  async removeDomain(
    tenantId: string,
    user?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(this.toId(tenantId));
    if (!tenant) throw new NotFoundException('Tenant not found');

    const previousDomain = tenant.customDomain || tenant.customDomainVerification?.domain;

    tenant.customDomain = undefined;
    tenant.isCustomDomainVerified = false;
    tenant.customDomainVerifiedAt = undefined;
    tenant.customDomainVerification = {
      domain: null as any,
      status: 'unconfigured',
      verificationToken: null as any,
      targetCname: this.configService.get<string>('PLATFORM_CNAME_TARGET') || 'cname.madiyayu.com',
      dnsRecords: [],
      lastCheckedAt: null as any,
      failureReason: null as any,
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

  /**
   * Super Admin platform-wide list of all configured domains
   */
  async listAllDomains(query: DomainQueryDto) {
    const { search, status = 'all', page = 1, limit = 20 } = query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (status === 'verified') {
      filter.isCustomDomainVerified = true;
    } else if (status === 'pending') {
      filter['customDomainVerification.status'] = 'pending';
      filter.isCustomDomainVerified = false;
    } else if (status === 'failed') {
      filter['customDomainVerification.status'] = 'failed';
    } else if (status === 'unconfigured') {
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

    const items = tenants.map((t: any) => {
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
}

import { Injectable, NestMiddleware, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Tenant, TenantDocument } from '../../modules/tenants/tenant.schema';
import { TenantStatus } from '../../shared/types';

export interface TenantRequest extends Request {
  tenant: TenantDocument;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    // 1. Header resolution (Postman, mobile apps, direct API clients)
    const headerSlug = (req.headers['x-tenant-slug'] as string) || (req.headers['x-tenant'] as string);
    const headerTenantId = req.headers['x-tenant-id'] as string;
    const querySlug = req.query?.['tenant'] as string;
    const queryTenantId = req.query?.['tenantId'] as string;

    const host = (req.hostname || '').toLowerCase().trim();
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';
    const isCloudHosting =
      host.endsWith('onrender.com') ||
      host.endsWith('vercel.app') ||
      host.endsWith('railway.app') ||
      host.endsWith('fly.dev') ||
      host.endsWith('herokuapp.com');

    // Base API hostnames that are NOT tenant subdomains
    const isBaseApiDomain =
      host === 'election.digicoders.in' ||
      host === 'api.election.digicoders.in' ||
      host === 'elelection.digicoders.in';

    // Subdomain extraction: only if a prefix exists before the base domain
    let subdomain: string | null = null;
    if (!isLocalhost && !isCloudHosting && !isBaseApiDomain && host.includes('.')) {
      if (host.endsWith('.election.digicoders.in')) {
        subdomain = host.replace('.election.digicoders.in', '').split('.')[0];
      } else if (host.endsWith('.elelection.digicoders.in')) {
        subdomain = host.replace('.elelection.digicoders.in', '').split('.')[0];
      } else {
        const parts = host.split('.');
        if (parts.length > 2) {
          subdomain = parts[0];
        }
      }
    }

    let tenant: TenantDocument | null = null;

    if (headerTenantId) {
      if (isValidObjectId(headerTenantId)) {
        tenant = await this.tenantModel.findById(headerTenantId);
      }
      // Graceful fallback: If developer/user passed a slug in "x-tenant-id" (e.g. "demo")
      if (!tenant) {
        tenant = await this.tenantModel.findOne({ slug: headerTenantId.toLowerCase().trim() });
      }
      if (!tenant) {
        throw new BadRequestException(
          `Tenant not found for "x-tenant-id": "${headerTenantId}". Provide a valid 24-character ObjectId or tenant slug.`,
        );
      }
    } else if (queryTenantId) {
      if (isValidObjectId(queryTenantId)) {
        tenant = await this.tenantModel.findById(queryTenantId);
      }
      if (!tenant) {
        tenant = await this.tenantModel.findOne({ slug: queryTenantId.toLowerCase().trim() });
      }
      if (!tenant) {
        throw new BadRequestException(
          `Tenant not found for "tenantId": "${queryTenantId}". Provide a valid 24-character ObjectId or tenant slug.`,
        );
      }
    } else if (headerSlug) {
      tenant = await this.tenantModel.findOne({ slug: headerSlug.toLowerCase().trim() });
    } else if (querySlug) {
      tenant = await this.tenantModel.findOne({ slug: querySlug.toLowerCase().trim() });
    } else if (subdomain) {
      tenant = await this.tenantModel.findOne({
        $or: [{ customDomain: host }, { slug: subdomain.toLowerCase() }],
      } as any);
    } else {
      tenant = await this.tenantModel.findOne({ customDomain: host });
    }

    // Fallback: If still not found and in local dev, cloud hosting, or base API domain, fallback to 'demo' or first active tenant
    if (!tenant && (isLocalhost || isCloudHosting || isBaseApiDomain)) {
      tenant = (await this.tenantModel.findOne({ slug: 'demo' })) || (await this.tenantModel.findOne({ status: TenantStatus.ACTIVE }));
    }

    if (!tenant) {
      throw new NotFoundException(
        'Tenant not found. Please provide a valid "x-tenant-slug" or "x-tenant-id" header, or access via a valid subdomain/custom domain.',
      );
    }

    if (tenant.status === 'suspended') {
      throw new ForbiddenException('This account has been suspended');
    }

    req.tenant = tenant;
    next();
  }
}

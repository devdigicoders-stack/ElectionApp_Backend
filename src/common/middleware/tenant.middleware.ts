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

    const host = req.hostname || '';
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';
    const subdomain = !isLocalhost && host.includes('.') ? host.split('.')[0] : null;

    let tenant: TenantDocument | null = null;

    if (headerTenantId) {
      if (!isValidObjectId(headerTenantId)) {
        throw new BadRequestException(
          `Invalid "x-tenant-id" value: "${headerTenantId}". It must be a 24-character MongoDB ObjectId (or use "x-tenant-slug" header instead, e.g. "x-tenant-slug: demo").`,
        );
      }
      tenant = await this.tenantModel.findById(headerTenantId);
    } else if (queryTenantId) {
      if (!isValidObjectId(queryTenantId)) {
        throw new BadRequestException(
          `Invalid "tenantId" query param: "${queryTenantId}". It must be a 24-character MongoDB ObjectId.`,
        );
      }
      tenant = await this.tenantModel.findById(queryTenantId);
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
      // If still not found and in local dev (localhost), fallback to 'demo' or first active tenant
      if (!tenant && isLocalhost) {
        tenant = (await this.tenantModel.findOne({ slug: 'demo' })) || (await this.tenantModel.findOne({ status: TenantStatus.ACTIVE }));
      }
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

import { Injectable, NestMiddleware, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../../modules/tenants/tenant.schema';

export interface TenantRequest extends Request {
  tenant: TenantDocument;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    const host = req.hostname;
    const slug = host.split('.')[0];

    const tenant = await this.tenantModel.findOne({
      $or: [{ customDomain: host }, { slug }],
    } as any);

    if (!tenant) throw new NotFoundException('Tenant not found');
    if (tenant.status === 'suspended') throw new ForbiddenException('This account has been suspended');

    req.tenant = tenant;
    next();
  }
}

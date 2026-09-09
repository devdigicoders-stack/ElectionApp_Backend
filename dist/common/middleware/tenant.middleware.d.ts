import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { TenantDocument } from '../../modules/tenants/tenant.schema';
export interface TenantRequest extends Request {
    tenant: TenantDocument;
}
export declare class TenantMiddleware implements NestMiddleware {
    private tenantModel;
    constructor(tenantModel: Model<TenantDocument>);
    use(req: TenantRequest, res: Response, next: NextFunction): Promise<void>;
}

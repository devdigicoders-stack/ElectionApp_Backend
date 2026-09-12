import { Model } from 'mongoose';
import { BannerDocument } from './banner.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class BannersService {
    private bannerModel;
    constructor(bannerModel: Model<BannerDocument>);
    private getBannerFilter;
    private formatBanner;
    create(tenant: TenantDocument, data: any, req?: any): Promise<any>;
    findActive(tenant: TenantDocument, req?: any): Promise<any[]>;
    findAll(tenant: TenantDocument, req?: any): Promise<any[]>;
    findOne(tenant: TenantDocument, id: string, req?: any): Promise<any>;
    update(tenant: TenantDocument, id: string, data: any, req?: any): Promise<any>;
    remove(tenant: TenantDocument, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    reorder(tenant: TenantDocument, orders: {
        id: string;
        sortOrder: number;
    }[]): Promise<{
        message: string;
    }>;
}

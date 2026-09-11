import { BannersService } from './banners.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare const bannerUploadOptions: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (_req: any, file: any, cb: any) => void;
};
export declare function parseBannerBody(body: any, files: {
    image?: Express.Multer.File[];
    file?: Express.Multer.File[];
    banner?: Express.Multer.File[];
    bannerImage?: Express.Multer.File[];
    mobileImage?: Express.Multer.File[];
} | undefined, tenantSlug: string): any;
export declare class BannersController {
    private bannersService;
    constructor(bannersService: BannersService);
    create(req: TenantRequest, body: any, files?: {
        image?: Express.Multer.File[];
        file?: Express.Multer.File[];
        banner?: Express.Multer.File[];
        bannerImage?: Express.Multer.File[];
        mobileImage?: Express.Multer.File[];
    }): Promise<any>;
    findActive(req: TenantRequest): Promise<any[]>;
    findAll(req: TenantRequest): Promise<any[]>;
    findOne(req: TenantRequest, id: string): Promise<any>;
    reorder(req: TenantRequest, body: {
        orders: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<{
        message: string;
    }>;
    update(req: TenantRequest, id: string, body: any, files?: {
        image?: Express.Multer.File[];
        file?: Express.Multer.File[];
        banner?: Express.Multer.File[];
        bannerImage?: Express.Multer.File[];
        mobileImage?: Express.Multer.File[];
    }): Promise<any>;
    remove(req: TenantRequest, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class UploadsController {
    uploadFiles(req: TenantRequest, module: string, files: Express.Multer.File[]): {
        urls: string[];
    };
}

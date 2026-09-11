import { GalleryService } from './gallery.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { GalleryType } from '../../shared/types';
export declare const galleryUploadOptions: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (_req: any, file: any, cb: any) => void;
};
export declare class GalleryController {
    private galleryService;
    constructor(galleryService: GalleryService);
    create(req: TenantRequest, files: {
        file?: Express.Multer.File[];
        image?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
    }, body: any): Promise<import("mongoose").Document<unknown, {}, import("./gallery.schema").GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./gallery.schema").GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, type?: GalleryType, category?: string, tag?: string, search?: string, all?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./gallery.schema").GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./gallery.schema").GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(req: TenantRequest, id: string): Promise<any>;
    update(req: TenantRequest, id: string, files: {
        file?: Express.Multer.File[];
        image?: Express.Multer.File[];
        thumbnail?: Express.Multer.File[];
    }, body: any): Promise<import("mongoose").Document<unknown, {}, import("./gallery.schema").GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./gallery.schema").GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./gallery.schema").GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./gallery.schema").GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

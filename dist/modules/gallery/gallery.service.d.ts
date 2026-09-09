import { Model } from 'mongoose';
import { GalleryItem, GalleryItemDocument } from './gallery.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { GalleryType } from '../../shared/types';
export declare class GalleryService {
    private galleryModel;
    constructor(galleryModel: Model<GalleryItemDocument>);
    create(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, filters: {
        type?: GalleryType;
        category?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, GalleryItemDocument, {}, import("mongoose").DefaultSchemaOptions> & GalleryItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

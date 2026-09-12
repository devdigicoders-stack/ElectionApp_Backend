import { Model, Types } from 'mongoose';
import { Manifesto, ManifestoDocument } from './manifesto.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class ManifestoService {
    private manifestoModel;
    constructor(manifestoModel: Model<ManifestoDocument>);
    private getManifestoFilter;
    create(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & Manifesto & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, category?: string, includeUnpublished?: boolean): Promise<(import("mongoose").Document<unknown, {}, ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & Manifesto & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getCategories(tenant: TenantDocument): Promise<string[]>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & Manifesto & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & Manifesto & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

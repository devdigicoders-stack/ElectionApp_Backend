import { Model } from 'mongoose';
import { Work, WorkDocument } from './work.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { WorkStatus } from '../../shared/types';
export declare class WorksService {
    private workModel;
    constructor(workModel: Model<WorkDocument>);
    create(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, filters: {
        status?: WorkStatus;
        areaId?: string;
        category?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, WorkDocument, {}, import("mongoose").DefaultSchemaOptions> & Work & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getStatsByStatus(tenant: TenantDocument): Promise<any[]>;
}

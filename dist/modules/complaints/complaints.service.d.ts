import { Model } from 'mongoose';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { ComplaintStatus } from '../../shared/types';
export declare class ComplaintsService {
    private complaintModel;
    constructor(complaintModel: Model<ComplaintDocument>);
    private generateNumber;
    create(tenant: TenantDocument, userId: string, data: any): Promise<import("mongoose").Document<unknown, {}, ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenant: TenantDocument, filters: {
        status?: string;
        areaId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: (import("mongoose").Document<unknown, {}, ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findByUser(tenant: TenantDocument, userId: string): Promise<(import("mongoose").Document<unknown, {}, ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateStatus(tenant: TenantDocument, id: string, status: ComplaintStatus, note: string, updatedBy: string): Promise<import("mongoose").Document<unknown, {}, ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getDashboardStats(tenant: TenantDocument): Promise<any>;
}

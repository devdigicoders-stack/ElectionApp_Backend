import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';
import { CreateAuditLogDto, QueryAuditLogsDto } from './audit-logs.dto';
export declare class AuditLogsService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    log(dto: CreateAuditLogDto): Promise<AuditLogDocument>;
    findAll(query: QueryAuditLogsDto): Promise<{
        items: (AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByTenant(tenantId: string, limit?: number): Promise<(AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findExportHistory(tenantId?: any, limit?: number): Promise<(AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';
import { CreateAuditLogDto, QueryAuditLogsDto } from './audit-logs.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  /**
   * Record a new audit log entry
   */
  async log(dto: CreateAuditLogDto): Promise<AuditLogDocument> {
    return this.auditLogModel.create({
      ...dto,
      tenantId: dto.tenantId ? new Types.ObjectId(dto.tenantId.toString()) : undefined,
    });
  }

  /**
   * Find paginated audit logs with filtering (SRS Sec 59)
   */
  async findAll(query: QueryAuditLogsDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.tenantId) {
      filter.tenantId = new Types.ObjectId(query.tenantId);
    }

    if (query.action) {
      filter.action = query.action;
    }

    if (query.search) {
      filter.$or = [
        { action: { $regex: query.search, $options: 'i' } },
        { tenantName: { $regex: query.search, $options: 'i' } },
        { 'performedBy.email': { $regex: query.search, $options: 'i' } },
        { 'performedBy.name': { $regex: query.search, $options: 'i' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.auditLogModel.countDocuments(filter),
      this.auditLogModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit history for a specific tenant
   */
  async findByTenant(tenantId: string, limit = 20) {
    return this.auditLogModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

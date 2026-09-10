import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { Volunteer, VolunteerDocument } from './volunteer.schema';
import { VolunteerTask, VolunteerTaskDocument } from './volunteer-task.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { VolunteerStatus, VolunteerTaskStatus } from '../../shared/types';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(VolunteerTask.name) private taskModel: Model<VolunteerTaskDocument>,
    @Optional() private auditLogsService?: AuditLogsService,
  ) {}

  async add(
    tenant: TenantDocument,
    data: {
      userId?: string;
      role?: string;
      assignedAreaId?: string;
      areaId?: string;
      tasks?: string[];
      notes?: string;
      skills?: string[];
      interests?: string[];
    },
    callerUserId: string,
  ) {
    const targetUserId = data.userId || callerUserId;
    if (!targetUserId) {
      throw new BadRequestException('userId is required to register as volunteer');
    }

    const assignedAreaId = data.assignedAreaId || data.areaId || undefined;

    const existing = await this.volunteerModel.findOne({
      tenantId: tenant._id,
      userId: new Types.ObjectId(targetUserId),
    });
    if (existing) {
      throw new ConflictException('User is already registered as a volunteer');
    }

    const volunteer = await this.volunteerModel.create({
      tenantId: tenant._id,
      userId: new Types.ObjectId(targetUserId),
      role: data.role || 'Volunteer',
      assignedAreaId: assignedAreaId ? new Types.ObjectId(assignedAreaId) : undefined,
      status: VolunteerStatus.ACTIVE,
      tasks: data.tasks || [],
      assignedBy: callerUserId ? new Types.ObjectId(callerUserId) : undefined,
      notes: data.notes || undefined,
    });

    return volunteer;
  }

  async findAll(tenant: TenantDocument, filters: { areaId?: string; status?: VolunteerStatus; page?: number; limit?: number }) {
    const { areaId, status, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id };
    if (areaId) query.assignedAreaId = areaId;
    if (status) query.status = status;

    const [data, total] = await Promise.all([
      this.volunteerModel
        .find(query)
        .populate('userId', 'name mobile')
        .populate('assignedAreaId', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.volunteerModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findByUser(tenant: TenantDocument, userId: string) {
    return this.volunteerModel
      .findOne({ tenantId: tenant._id, userId })
      .populate('assignedAreaId', 'name');
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const volunteer = await this.volunteerModel.findOneAndUpdate(
      { _id: id, tenantId: tenant._id },
      { $set: data },
      { new: true },
    );
    if (!volunteer) throw new NotFoundException('Volunteer not found');
    return volunteer;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.volunteerModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }

  // ══════════════════════════════════════════════════════════════
  // DATA EXPORT SYSTEM (SRS Sec 58 & 59)
  // ══════════════════════════════════════════════════════════════

  /**
   * Export Volunteer Directory & Performance Metrics to CSV or Excel (SRS Sec 58)
   */
  async exportVolunteers(
    tenant: TenantDocument,
    query: { status?: VolunteerStatus; areaId?: string; role?: string; search?: string; format?: string },
    res: Response,
    format: string = 'csv',
    adminUser?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const filter: any = { tenantId: tenant._id };
    if (query.status) filter.status = query.status;
    if (query.areaId && Types.ObjectId.isValid(query.areaId)) {
      filter.assignedAreaId = new Types.ObjectId(query.areaId);
    }
    if (query.role) {
      filter.role = { $regex: query.role.trim(), $options: 'i' };
    }

    const volunteers = await this.volunteerModel
      .find(filter)
      .populate('userId', 'name mobile email gender dob')
      .populate('assignedAreaId', 'name type')
      .sort({ createdAt: -1 })
      .lean();

    // Query task statistics for each volunteer
    const volunteerIds = volunteers.map((v) => v._id);
    const taskStats = await this.taskModel.aggregate([
      { $match: { tenantId: tenant._id, assignedVolunteerId: { $in: volunteerIds } } },
      {
        $group: {
          _id: '$assignedVolunteerId',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', VolunteerTaskStatus.COMPLETED] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', VolunteerTaskStatus.PENDING] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', VolunteerTaskStatus.IN_PROGRESS] }, 1, 0] } },
        },
      },
    ]);

    const taskStatsMap = new Map();
    taskStats.forEach((t) => taskStatsMap.set(t._id.toString(), t));

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const maskMobile = (mobile?: string) => {
      if (!mobile || mobile.length < 5) return 'N/A';
      return mobile.slice(0, 2) + '****' + mobile.slice(-4);
    };

    const headers = [
      'Volunteer ID',
      'Name',
      'Mobile',
      'Email',
      'Gender',
      'Role / Designation',
      'Assigned Area',
      'Status',
      'Total Tasks Assigned',
      'Completed Tasks',
      'Pending Tasks',
      'Completion Rate (%)',
      'Registered Date',
    ];

    const rows = volunteers.map((v: any) => {
      const u = v.userId || {};
      const area = v.assignedAreaId || {};
      const stats = taskStatsMap.get(v._id.toString()) || { total: 0, completed: 0, pending: 0 };
      const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

      return [
        escapeCsv(v._id.toString()),
        escapeCsv(u.name || 'Volunteer'),
        escapeCsv(maskMobile(u.mobile)),
        escapeCsv(u.email || ''),
        escapeCsv(u.gender || ''),
        escapeCsv(v.role || 'Volunteer'),
        escapeCsv(area.name ? `${area.name} (${area.type || 'Area'})` : 'Constituency'),
        escapeCsv(v.status || 'active'),
        escapeCsv(stats.total),
        escapeCsv(stats.completed),
        escapeCsv(stats.pending),
        escapeCsv(`${rate}%`),
        escapeCsv(v.createdAt ? new Date(v.createdAt).toISOString() : ''),
      ].join(',');
    });

    const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
    const bom = '\uFEFF';
    const csvContent = bom + [headers.join(','), ...rows].join('\r\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `volunteers-${tenant.slug || 'export'}-${timestamp}.csv`;

    const contentType = isExcel
      ? 'application/vnd.ms-excel; charset=utf-8'
      : 'text/csv; charset=utf-8';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    if (this.auditLogsService && adminUser) {
      await this.auditLogsService
        .log({
          tenantId: tenant._id,
          tenantName: tenant.name,
          action: 'DATA_EXPORT_VOLUNTEERS',
          performedBy: {
            id: adminUser.sub || adminUser.id || 'admin',
            email: adminUser.email || 'admin@platform.local',
            name: adminUser.name || 'Admin',
            role: adminUser.role || 'admin',
          },
          details: {
            format: isExcel ? 'excel' : 'csv',
            recordCount: volunteers.length,
            filename,
          },
          ipAddress,
          userAgent,
        })
        .catch(() => {});
    }

    return res.status(200).send(csvContent);
  }
}

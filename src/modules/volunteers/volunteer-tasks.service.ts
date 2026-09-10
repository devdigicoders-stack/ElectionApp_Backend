import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VolunteerTask, VolunteerTaskDocument } from './volunteer-task.schema';
import { Volunteer, VolunteerDocument } from './volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { TaskPriority, VolunteerTaskStatus } from '../../shared/types';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import {
  CreateVolunteerTaskDto,
  UpdateVolunteerTaskDto,
  SubmitVolunteerTaskDto,
  ReviewVolunteerTaskDto,
  QueryVolunteerTaskDto,
} from './volunteer-task.dto';

@Injectable()
export class VolunteerTasksService {
  constructor(
    @InjectModel(VolunteerTask.name)
    private taskModel: Model<VolunteerTaskDocument>,
    @InjectModel(Volunteer.name)
    private volunteerModel: Model<VolunteerDocument>,
    @Optional() private auditLogsService?: AuditLogsService,
  ) {}

  /**
   * 1. Create a new task and assign to a volunteer or area (SRS Sec 35)
   */
  async create(tenant: TenantDocument, dto: CreateVolunteerTaskDto, adminUser: any) {
    let assignedVolunteerId: Types.ObjectId | undefined = undefined;
    let assignedUserId: Types.ObjectId | undefined = undefined;

    if (dto.assignedVolunteerId) {
      if (!Types.ObjectId.isValid(dto.assignedVolunteerId)) {
        throw new BadRequestException('Invalid assignedVolunteerId format');
      }
      let volunteer = await this.volunteerModel.findOne({
        _id: new Types.ObjectId(dto.assignedVolunteerId),
        tenantId: tenant._id,
      });
      // Smart Fallback: what if the user passed citizen userId instead of volunteer _id?
      if (!volunteer) {
        volunteer = await this.volunteerModel.findOne({
          userId: new Types.ObjectId(dto.assignedVolunteerId),
          tenantId: tenant._id,
        });
      }
      if (!volunteer) {
        throw new NotFoundException('Assigned volunteer not found. Please ensure the user is registered as a volunteer.');
      }
      assignedVolunteerId = volunteer._id as Types.ObjectId;
      assignedUserId = volunteer.userId;
    } else if (dto.assignedUserId) {
      if (!Types.ObjectId.isValid(dto.assignedUserId)) {
        throw new BadRequestException('Invalid assignedUserId format');
      }
      const volunteer = await this.volunteerModel.findOne({
        userId: new Types.ObjectId(dto.assignedUserId),
        tenantId: tenant._id,
      });
      if (volunteer) {
        assignedVolunteerId = volunteer._id as Types.ObjectId;
      }
      assignedUserId = new Types.ObjectId(dto.assignedUserId);
    }

    const task = await this.taskModel.create({
      tenantId: tenant._id,
      title: dto.title.trim(),
      description: dto.description.trim(),
      assignedVolunteerId,
      assignedUserId,
      areaId: dto.areaId ? new Types.ObjectId(dto.areaId) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      priority: dto.priority || TaskPriority.MEDIUM,
      status: VolunteerTaskStatus.PENDING,
      attachments: dto.attachments || [],
      createdBy: new Types.ObjectId(adminUser?.sub || adminUser?.id),
    });

    // Update volunteer's tasks summary array if assigned
    if (assignedVolunteerId) {
      await this.volunteerModel.updateOne(
        { _id: assignedVolunteerId },
        { $addToSet: { tasks: task.title } },
      );
    }

    return task;
  }

  /**
   * 2. List all tasks with filters (Admin)
   */
  async findAll(tenant: TenantDocument, query: QueryVolunteerTaskDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = { tenantId: tenant._id };

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.areaId) filter.areaId = new Types.ObjectId(query.areaId);
    if (query.volunteerId) filter.assignedVolunteerId = new Types.ObjectId(query.volunteerId);

    if (query.search) {
      const searchRegex = { $regex: query.search.trim(), $options: 'i' };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const sortField = query.sortBy || 'createdAt';
    const sortDir = query.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortField]: sortDir };

    const [items, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .populate({
          path: 'assignedVolunteerId',
          populate: { path: 'userId', select: 'name mobile' },
        })
        .populate('assignedUserId', 'name mobile')
        .populate('areaId', 'name code')
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.taskModel.countDocuments(filter),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * 3. List my assigned tasks (Volunteer)
   */
  async findMyTasks(tenant: TenantDocument, userId: string, query?: { status?: VolunteerTaskStatus }) {
    const volunteer = await this.volunteerModel.findOne({
      tenantId: tenant._id,
      userId: new Types.ObjectId(userId),
    });

    const filter: any = {
      tenantId: tenant._id,
      $or: [
        { assignedUserId: new Types.ObjectId(userId) },
        ...(volunteer ? [{ assignedVolunteerId: volunteer._id }] : []),
      ],
    };

    if (query?.status) {
      filter.status = query.status;
    }

    const tasks = await this.taskModel
      .find(filter)
      .populate('areaId', 'name code')
      .populate('createdBy', 'name')
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    return tasks;
  }

  /**
   * 4. Get task details by ID
   */
  async findOne(tenant: TenantDocument, id: string) {
    const task = await this.taskModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate({
        path: 'assignedVolunteerId',
        populate: { path: 'userId', select: 'name mobile' },
      })
      .populate('assignedUserId', 'name mobile')
      .populate('areaId', 'name code')
      .populate('createdBy', 'name email');

    if (!task) {
      throw new NotFoundException('Volunteer task not found');
    }

    return task;
  }

  /**
   * 5. Update task details (Admin)
   */
  async update(tenant: TenantDocument, id: string, dto: UpdateVolunteerTaskDto) {
    const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
    if (!task) throw new NotFoundException('Volunteer task not found');

    if (dto.title !== undefined) task.title = dto.title.trim();
    if (dto.description !== undefined) task.description = dto.description.trim();
    if (dto.dueDate !== undefined) task.dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.attachments !== undefined) task.attachments = dto.attachments;

    if (dto.areaId !== undefined) {
      task.areaId = dto.areaId ? new Types.ObjectId(dto.areaId) : undefined;
    }

    if (dto.assignedVolunteerId !== undefined) {
      if (dto.assignedVolunteerId) {
        if (!Types.ObjectId.isValid(dto.assignedVolunteerId)) {
          throw new BadRequestException('Invalid assignedVolunteerId format');
        }
        let vol = await this.volunteerModel.findOne({
          _id: new Types.ObjectId(dto.assignedVolunteerId),
          tenantId: tenant._id,
        });
        if (!vol) {
          vol = await this.volunteerModel.findOne({
            userId: new Types.ObjectId(dto.assignedVolunteerId),
            tenantId: tenant._id,
          });
        }
        if (!vol) throw new NotFoundException('Assigned volunteer not found');
        task.assignedVolunteerId = vol._id as Types.ObjectId;
        task.assignedUserId = vol.userId;
      } else {
        task.assignedVolunteerId = undefined;
        task.assignedUserId = undefined;
      }
    }

    await task.save();
    return task;
  }

  /**
   * 6. Volunteer accepts task
   */
  async acceptTask(tenant: TenantDocument, id: string, user: any) {
    const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
    if (!task) throw new NotFoundException('Volunteer task not found');

    const userId = user?.sub || user?.id;
    const isAdminOrStaff = user?.role === 'admin' || user?.role === 'leader' || user?.isSuperAdmin;

    // Verify volunteer ownership if not admin
    if (!isAdminOrStaff && task.assignedUserId && task.assignedUserId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to accept this task');
    }

    if (task.status === VolunteerTaskStatus.PENDING) {
      task.status = VolunteerTaskStatus.ACCEPTED;
    } else {
      task.status = VolunteerTaskStatus.IN_PROGRESS;
    }

    await task.save();
    return {
      success: true,
      message: 'Task accepted successfully. Status changed to ' + task.status,
      task,
    };
  }

  /**
   * 7. Volunteer submits completion proof (Images, Report, Remarks)
   */
  async submitTask(
    tenant: TenantDocument,
    id: string,
    dto: SubmitVolunteerTaskDto,
    user: any,
  ) {
    const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
    if (!task) throw new NotFoundException('Volunteer task not found');

    const userId = user?.sub || user?.id;
    const isAdminOrStaff = user?.role === 'admin' || user?.role === 'leader' || user?.isSuperAdmin;

    if (!isAdminOrStaff && task.assignedUserId && task.assignedUserId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to submit reports for this task');
    }

    const submitterId = (userId && Types.ObjectId.isValid(userId))
      ? new Types.ObjectId(userId)
      : task.assignedUserId;

    task.submission = {
      submittedAt: new Date(),
      completionRemark: dto.completionRemark.trim(),
      images: dto.images || [],
      reportUrl: dto.reportUrl || undefined,
      submittedBy: submitterId as Types.ObjectId,
    };

    task.status = VolunteerTaskStatus.IN_PROGRESS; // Awaiting admin approval
    await task.save();

    return {
      success: true,
      message: 'Task completion report submitted successfully. Awaiting admin review.',
      task,
    };
  }

  /**
   * 8. Admin reviews volunteer submission (Approve or Reject with feedback)
   */
  async reviewTask(
    tenant: TenantDocument,
    id: string,
    dto: ReviewVolunteerTaskDto,
    adminUser: any,
  ) {
    const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
    if (!task) throw new NotFoundException('Volunteer task not found');

    task.status = dto.isApproved
      ? VolunteerTaskStatus.COMPLETED
      : VolunteerTaskStatus.REJECTED;

    task.review = {
      reviewedAt: new Date(),
      reviewedBy: new Types.ObjectId(adminUser?.sub || adminUser?.id),
      reviewNote: dto.reviewNote ? dto.reviewNote.trim() : undefined,
      isApproved: dto.isApproved,
    };

    await task.save();

    return {
      success: true,
      message: dto.isApproved
        ? 'Task submission approved! Task marked as COMPLETED.'
        : 'Task submission rejected with feedback.',
      task,
    };
  }

  /**
   * 9. Get Task Analytics & Metrics (Admin Dashboard KPI)
   */
  async getStats(tenant: TenantDocument) {
    const now = new Date();
    const [statusStats, overdueCount, priorityStats] = await Promise.all([
      this.taskModel.aggregate([
        { $match: { tenantId: tenant._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.taskModel.countDocuments({
        tenantId: tenant._id,
        dueDate: { $lt: now },
        status: { $ne: VolunteerTaskStatus.COMPLETED },
      }),
      this.taskModel.aggregate([
        { $match: { tenantId: tenant._id } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    const summary = {
      totalTasks: 0,
      pending: 0,
      accepted: 0,
      inProgress: 0,
      completed: 0,
      rejected: 0,
      overdueTasks: overdueCount,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0,
      },
    };

    for (const s of statusStats) {
      summary.totalTasks += s.count;
      if (s._id === VolunteerTaskStatus.PENDING) summary.pending = s.count;
      else if (s._id === VolunteerTaskStatus.ACCEPTED) summary.accepted = s.count;
      else if (s._id === VolunteerTaskStatus.IN_PROGRESS) summary.inProgress = s.count;
      else if (s._id === VolunteerTaskStatus.COMPLETED) summary.completed = s.count;
      else if (s._id === VolunteerTaskStatus.REJECTED) summary.rejected = s.count;
    }

    for (const p of priorityStats) {
      if (p._id in summary.byPriority) {
        summary.byPriority[p._id as keyof typeof summary.byPriority] = p.count;
      }
    }

    return summary;
  }

  /**
   * 10. Delete task
   */
  async remove(tenant: TenantDocument, id: string) {
    const deleted = await this.taskModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    if (!deleted) throw new NotFoundException('Volunteer task not found');
    return { success: true, message: 'Volunteer task deleted successfully' };
  }

  /**
   * 11. Export Volunteer Tasks to CSV or Excel (SRS Sec 58)
   */
  async exportVolunteerTasks(
    tenant: TenantDocument,
    query: any,
    res: Response,
    format: string = 'csv',
    adminUser?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const filter: any = { tenantId: tenant._id };

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.areaId && Types.ObjectId.isValid(query.areaId)) {
      filter.areaId = new Types.ObjectId(query.areaId);
    }
    if (query.volunteerId && Types.ObjectId.isValid(query.volunteerId)) {
      filter.assignedVolunteerId = new Types.ObjectId(query.volunteerId);
    }
    if (query.search) {
      const searchRegex = { $regex: query.search.trim(), $options: 'i' };
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
      if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    const tasks = await this.taskModel
      .find(filter)
      .populate({
        path: 'assignedVolunteerId',
        populate: { path: 'userId', select: 'name mobile email' },
      })
      .populate('assignedUserId', 'name mobile email')
      .populate('areaId', 'name code type')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

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
      'Task ID',
      'Title',
      'Description',
      'Priority',
      'Status',
      'Assigned Volunteer Name',
      'Assigned Volunteer Mobile',
      'Area / Ward',
      'Due Date',
      'Submitted Proof Remark',
      'Submitted Date',
      'Admin Review Status',
      'Admin Review Note',
      'Created Date',
    ];

    const rows = tasks.map((t: any) => {
      const volUser = (t.assignedVolunteerId as any)?.userId || t.assignedUserId || {};
      const area = (t.areaId as any) || {};
      const submission = t.submission || {};
      const review = t.review || {};

      let reviewStatus = 'Not Reviewed';
      if (review.isApproved === true) reviewStatus = 'Approved';
      else if (review.isApproved === false) reviewStatus = 'Rejected';

      return [
        escapeCsv(t._id.toString()),
        escapeCsv(t.title),
        escapeCsv(t.description),
        escapeCsv(t.priority),
        escapeCsv(t.status),
        escapeCsv(volUser.name || 'Unassigned'),
        escapeCsv(maskMobile(volUser.mobile)),
        escapeCsv(area.name ? `${area.name} (${area.type || 'Area'})` : 'Constituency'),
        escapeCsv(t.dueDate ? new Date(t.dueDate).toISOString() : ''),
        escapeCsv(submission.completionRemark || ''),
        escapeCsv(submission.submittedAt ? new Date(submission.submittedAt).toISOString() : ''),
        escapeCsv(reviewStatus),
        escapeCsv(review.reviewNote || ''),
        escapeCsv(t.createdAt ? new Date(t.createdAt).toISOString() : ''),
      ].join(',');
    });

    const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
    const bom = '\uFEFF';
    const csvContent = bom + [headers.join(','), ...rows].join('\r\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `volunteer-tasks-${tenant.slug || 'export'}-${timestamp}.csv`;

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
          action: 'DATA_EXPORT_VOLUNTEER_TASKS',
          performedBy: {
            id: adminUser.sub || adminUser.id || 'admin',
            email: adminUser.email || 'admin@platform.local',
            name: adminUser.name || 'Admin',
            role: adminUser.role || 'admin',
          },
          details: {
            format: isExcel ? 'excel' : 'csv',
            recordCount: tasks.length,
            filterQuery: query,
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

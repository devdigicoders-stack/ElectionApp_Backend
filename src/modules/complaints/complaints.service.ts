import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { ComplaintCategory, ComplaintCategoryDocument, DEFAULT_COMPLAINT_CATEGORIES } from './complaint-category.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { ComplaintStatus, ComplaintPriority } from '../../shared/types';
import {
  CreateComplaintDto,
  QueryComplaintsDto,
  AssignComplaintDto,
  UpdatePriorityDto,
  AddRemarkDto,
  ResolveComplaintDto,
  CloseComplaintDto,
  RejectComplaintDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './complaints.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(ComplaintCategory.name) private categoryModel: Model<ComplaintCategoryDocument>,
  ) {}

  /**
   * Generates formatted Complaint ID: CMP-YYYY-000001 (SRS Sec 15)
   */
  private async generateNumber(tenantId: any): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.complaintModel.countDocuments({
      tenantId,
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31, 23, 59, 59),
      },
    });
    return `CMP-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  // ══════════════════════════════════════════════════════════════
  // CITIZEN FLOW (SRS Section 15)
  // ══════════════════════════════════════════════════════════════

  /**
   * Citizen Complaint Submission (SRS Sec 15)
   */
  async create(tenant: TenantDocument, userId: string, dto: CreateComplaintDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID in auth token');
    }
    if (!Types.ObjectId.isValid(dto.areaId)) {
      throw new BadRequestException(`Invalid areaId "${dto.areaId}". Must be a valid 24-character hexadecimal MongoDB ObjectId (e.g. from GET /areas).`);
    }

    const complaintNumber = await this.generateNumber(tenant._id);
    const mediaUrls = dto.mediaUrls || dto.attachments || [];
    const attachments = dto.attachments || dto.mediaUrls || [];

    const complaint = await this.complaintModel.create({
      tenantId: tenant._id,
      userId: new Types.ObjectId(userId),
      areaId: new Types.ObjectId(dto.areaId),
      complaintNumber,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category.trim(),
      attachments,
      mediaUrls,
      videoUrl: dto.videoUrl || undefined,
      priority: dto.priority || ComplaintPriority.MEDIUM,
      status: ComplaintStatus.SUBMITTED,
      timeline: [
        {
          status: ComplaintStatus.SUBMITTED,
          action: 'SUBMITTED',
          note: 'Complaint submitted by citizen',
          updatedAt: new Date(),
        },
      ],
    });

    return this.findOne(tenant, complaint._id.toString(), { sub: userId, role: 'citizen' });
  }

  /**
   * List citizen's own submitted complaints (SRS Sec 15)
   */
  async findByUser(tenant: TenantDocument, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.complaintModel
      .find({ tenantId: tenant._id, userId: new Types.ObjectId(userId) })
      .populate('areaId', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * Get single complaint with privacy protection for internal admin notes
   */
  async findOne(tenant: TenantDocument, id: string, requester?: { sub: string; role?: string }) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Complaint not found (invalid ID format: "${id}")`);
    }

    const complaint = await this.complaintModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('userId', 'name mobile email voterId')
      .populate('areaId', 'name')
      .populate('assignedTo', 'name email role phone')
      .populate('assignedBy', 'name email')
      .populate('resolvedBy', 'name')
      .populate('closedBy', 'name')
      .lean();

    if (!complaint) throw new NotFoundException('Complaint not found');

    const isCitizenViewer = requester?.role === 'citizen' || (requester?.sub && complaint.userId?._id?.toString() === requester.sub && requester.role !== 'admin' && requester.role !== 'super_admin');

    if (isCitizenViewer) {
      // Sanitize internal remarks and internal timeline notes from citizen view
      return {
        ...complaint,
        internalRemarks: [], // Hide internal admin remarks
        timeline: (complaint.timeline || []).filter((t: any) => !t.isInternal),
      };
    }

    return complaint;
  }

  /**
   * Citizen Complaints Counter Stats (SRS Sec 15: Citizen Dashboard)
   */
  async getCitizenDashboardCounters(tenant: TenantDocument, userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const [total, pending, inProgress, resolved, closed, rejected] = await Promise.all([
      this.complaintModel.countDocuments({ tenantId: tenant._id, userId: userObjId }),
      this.complaintModel.countDocuments({
        tenantId: tenant._id,
        userId: userObjId,
        status: { $in: [ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW] },
      }),
      this.complaintModel.countDocuments({
        tenantId: tenant._id,
        userId: userObjId,
        status: { $in: [ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS] },
      }),
      this.complaintModel.countDocuments({
        tenantId: tenant._id,
        userId: userObjId,
        status: ComplaintStatus.RESOLVED,
      }),
      this.complaintModel.countDocuments({
        tenantId: tenant._id,
        userId: userObjId,
        status: ComplaintStatus.CLOSED,
      }),
      this.complaintModel.countDocuments({
        tenantId: tenant._id,
        userId: userObjId,
        status: ComplaintStatus.REJECTED,
      }),
    ]);

    return {
      total,
      pending,
      inProgress,
      resolved,
      closed,
      rejected,
    };
  }

  // ══════════════════════════════════════════════════════════════
  // ADMIN MANAGEMENT FLOW (SRS Section 16)
  // ══════════════════════════════════════════════════════════════

  /**
   * View all complaints with multi-parameter filtering & search (SRS Sec 16)
   */
  async findAll(tenant: TenantDocument, queryDto: QueryComplaintsDto) {
    const page = Math.max(Number(queryDto.page) || 1, 1);
    const limit = Math.min(Math.max(Number(queryDto.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = { tenantId: tenant._id };

    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    if (queryDto.priority) {
      filter.priority = queryDto.priority;
    }

    if (queryDto.areaId) {
      filter.areaId = new Types.ObjectId(queryDto.areaId);
    }

    if (queryDto.category) {
      filter.category = queryDto.category;
    }

    if (queryDto.assignedTo) {
      filter.assignedTo = new Types.ObjectId(queryDto.assignedTo);
    }

    if (queryDto.startDate || queryDto.endDate) {
      filter.createdAt = {};
      if (queryDto.startDate) filter.createdAt.$gte = new Date(queryDto.startDate);
      if (queryDto.endDate) filter.createdAt.$lte = new Date(queryDto.endDate);
    }

    if (queryDto.search) {
      const searchRegex = { $regex: queryDto.search.trim(), $options: 'i' };
      filter.$or = [
        { complaintNumber: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      this.complaintModel
        .find(filter)
        .populate('userId', 'name mobile email')
        .populate('areaId', 'name')
        .populate('assignedTo', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.complaintModel.countDocuments(filter),
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
   * Assign complaint to a staff/worker (SRS Sec 16)
   */
  async assignComplaint(tenant: TenantDocument, id: string, dto: AssignComplaintDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    if (!Types.ObjectId.isValid(dto.assignedTo)) {
      throw new BadRequestException(`Invalid assignedTo ID "${dto.assignedTo}". Must be a valid 24-character hexadecimal MongoDB ObjectId.`);
    }

    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const adminObjId = adminUser?.sub || adminUser?.id ? new Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
    const assignedToObjId = new Types.ObjectId(dto.assignedTo);

    complaint.assignedTo = assignedToObjId;
    complaint.assignedBy = adminObjId;
    complaint.assignedAt = new Date();
    complaint.status = ComplaintStatus.ASSIGNED;

    if (dto.priority) {
      complaint.priority = dto.priority;
    }

    complaint.timeline.push({
      status: ComplaintStatus.ASSIGNED,
      action: 'ASSIGNED',
      note: dto.note || `Complaint assigned to staff member`,
      updatedBy: adminObjId,
      updatedByName: adminUser?.name || 'Admin',
      updatedByRole: adminUser?.role || 'admin',
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id, adminUser);
  }

  /**
   * Update complaint priority (SRS Sec 16: Low, Medium, High, Urgent)
   */
  async updatePriority(tenant: TenantDocument, id: string, dto: UpdatePriorityDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const oldPriority = complaint.priority;
    complaint.priority = dto.priority;

    const adminObjId = adminUser?.sub || adminUser?.id ? new Types.ObjectId(adminUser.sub || adminUser.id) : undefined;

    complaint.timeline.push({
      status: complaint.status,
      action: 'PRIORITY_CHANGED',
      note: dto.note || `Priority changed from ${oldPriority} to ${dto.priority}`,
      updatedBy: adminObjId,
      updatedByName: adminUser?.name || 'Admin',
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id, adminUser);
  }

  /**
   * Add internal or public remarks (SRS Sec 16)
   */
  async addRemark(tenant: TenantDocument, id: string, dto: AddRemarkDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const adminObjId = adminUser?.sub || adminUser?.id ? new Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
    const isInternal = dto.isInternal !== false; // Default true for staff internal remarks

    const remarkEntry = {
      remark: dto.remark.trim(),
      addedBy: adminObjId,
      addedByName: adminUser?.name || 'Admin',
      isInternal,
      createdAt: new Date(),
    };

    if (isInternal) {
      complaint.internalRemarks.push(remarkEntry);
    } else {
      complaint.publicRemarks.push(remarkEntry);
    }

    complaint.timeline.push({
      status: complaint.status,
      action: 'REMARK_ADDED',
      note: dto.remark.trim(),
      updatedBy: adminObjId,
      updatedByName: adminUser?.name || 'Admin',
      isInternal,
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id, adminUser);
  }

  /**
   * Mark complaint as Resolved with proof and resolution details (SRS Sec 16)
   */
  async resolveComplaint(tenant: TenantDocument, id: string, dto: ResolveComplaintDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const adminObjId = adminUser?.sub || adminUser?.id ? new Types.ObjectId(adminUser.sub || adminUser.id) : undefined;

    complaint.status = ComplaintStatus.RESOLVED;
    complaint.resolutionDetails = dto.resolutionDetails.trim();
    if (dto.resolutionProof?.length) {
      complaint.resolutionProof = dto.resolutionProof;
    }
    complaint.resolvedAt = new Date();
    complaint.resolvedBy = adminObjId;

    complaint.timeline.push({
      status: ComplaintStatus.RESOLVED,
      action: 'RESOLVED',
      note: dto.note || dto.resolutionDetails.trim(),
      proofUrls: dto.resolutionProof || [],
      updatedBy: adminObjId,
      updatedByName: adminUser?.name || 'Admin',
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id, adminUser);
  }

  /**
   * Close complaint (SRS Sec 16)
   */
  async closeComplaint(tenant: TenantDocument, id: string, dto: CloseComplaintDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const adminObjId = adminUser?.sub || adminUser?.id ? new Types.ObjectId(adminUser.sub || adminUser.id) : undefined;

    complaint.status = ComplaintStatus.CLOSED;
    complaint.closedAt = new Date();
    complaint.closedBy = adminObjId;
    if (dto.closingNote) {
      complaint.closingNote = dto.closingNote.trim();
    }

    complaint.timeline.push({
      status: ComplaintStatus.CLOSED,
      action: 'CLOSED',
      note: dto.closingNote || 'Complaint closed after resolution confirmation',
      updatedBy: adminObjId,
      updatedByName: adminUser?.name || 'Admin',
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id, adminUser);
  }

  /**
   * Reject complaint with reason (SRS Sec 15 & 16)
   */
  async rejectComplaint(tenant: TenantDocument, id: string, dto: RejectComplaintDto, adminUser: any) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const adminObjId = adminUser?.sub || adminUser?.id ? new Types.ObjectId(adminUser.sub || adminUser.id) : undefined;

    complaint.status = ComplaintStatus.REJECTED;
    complaint.rejectionReason = dto.reason.trim();
    complaint.rejectedAt = new Date();
    complaint.rejectedBy = adminObjId;

    complaint.timeline.push({
      status: ComplaintStatus.REJECTED,
      action: 'REJECTED',
      note: `Complaint rejected: ${dto.reason.trim()}`,
      updatedBy: adminObjId,
      updatedByName: adminUser?.name || 'Admin',
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id, adminUser);
  }

  /**
   * Generic Status Transition (Backward Compatible)
   */
  async updateStatus(tenant: TenantDocument, id: string, status: ComplaintStatus, note: string, updatedBy: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Complaint not found');
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    const adminObjId = updatedBy ? new Types.ObjectId(updatedBy) : undefined;

    complaint.status = status;
    if (status === ComplaintStatus.RESOLVED && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = adminObjId;
    } else if (status === ComplaintStatus.CLOSED && !complaint.closedAt) {
      complaint.closedAt = new Date();
      complaint.closedBy = adminObjId;
    }

    complaint.timeline.push({
      status,
      action: 'STATUS_UPDATED',
      note: note || `Status updated to ${status}`,
      updatedBy: adminObjId,
      updatedAt: new Date(),
    });

    await complaint.save();
    return this.findOne(tenant, id);
  }

  // ══════════════════════════════════════════════════════════════
  // COMPLAINT ANALYTICS (SRS Section 17)
  // ══════════════════════════════════════════════════════════════

  /**
   * Comprehensive Complaint Analytics (SRS Sec 17)
   */
  async getAnalytics(tenant: TenantDocument) {
    const tenantObjId = new Types.ObjectId(tenant._id.toString());

    const [
      statusStats,
      priorityStats,
      areaStats,
      categoryStats,
      resolutionStats,
      monthlyTrend,
    ] = await Promise.all([
      // 1. Status breakdown
      this.complaintModel.aggregate([
        { $match: { tenantId: tenantObjId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // 2. Priority breakdown
      this.complaintModel.aggregate([
        { $match: { tenantId: tenantObjId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),

      // 3. Complaints by Area (Top 10)
      this.complaintModel.aggregate([
        { $match: { tenantId: tenantObjId } },
        { $group: { _id: '$areaId', total: { $sum: 1 }, open: { $sum: { $cond: [{ $in: ['$status', [ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS]] }, 1, 0] } } } },
        { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
        { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, areaName: '$area.name', total: 1, open: 1 } },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),

      // 4. Complaints by Category
      this.complaintModel.aggregate([
        { $match: { tenantId: tenantObjId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 5. Resolution Performance & Average Resolution Time
      this.complaintModel.aggregate([
        {
          $match: {
            tenantId: tenantObjId,
            resolvedAt: { $exists: true, $ne: null },
          },
        },
        {
          $project: {
            durationHours: {
              $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000],
            },
          },
        },
        {
          $group: {
            _id: null,
            averageHours: { $avg: '$durationHours' },
            minHours: { $min: '$durationHours' },
            maxHours: { $max: '$durationHours' },
            totalResolvedCount: { $sum: 1 },
          },
        },
      ]),

      // 6. Monthly Trend (Past 12 Months)
      this.complaintModel.aggregate([
        {
          $match: {
            tenantId: tenantObjId,
            createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            submitted: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $in: ['$status', [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]] }, 1, 0] },
            },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    // Format Status map
    const byStatus: Record<string, number> = {
      [ComplaintStatus.SUBMITTED]: 0,
      [ComplaintStatus.UNDER_REVIEW]: 0,
      [ComplaintStatus.ASSIGNED]: 0,
      [ComplaintStatus.IN_PROGRESS]: 0,
      [ComplaintStatus.RESOLVED]: 0,
      [ComplaintStatus.CLOSED]: 0,
      [ComplaintStatus.REJECTED]: 0,
    };
    let totalComplaints = 0;
    statusStats.forEach((s) => {
      byStatus[s._id] = s.count;
      totalComplaints += s.count;
    });

    const pending = (byStatus[ComplaintStatus.SUBMITTED] || 0) + (byStatus[ComplaintStatus.UNDER_REVIEW] || 0);
    const inProgress = (byStatus[ComplaintStatus.ASSIGNED] || 0) + (byStatus[ComplaintStatus.IN_PROGRESS] || 0);
    const resolvedTotal = (byStatus[ComplaintStatus.RESOLVED] || 0) + (byStatus[ComplaintStatus.CLOSED] || 0);

    // Format Priority map
    const byPriority: Record<string, number> = {
      [ComplaintPriority.LOW]: 0,
      [ComplaintPriority.MEDIUM]: 0,
      [ComplaintPriority.HIGH]: 0,
      [ComplaintPriority.URGENT]: 0,
    };
    priorityStats.forEach((p) => {
      byPriority[p._id] = p.count;
    });

    // Average Resolution Time (in Hours and Days)
    const avgResData = resolutionStats[0] || {};
    const averageResolutionTimeHours = avgResData.averageHours ? Math.round(avgResData.averageHours * 10) / 10 : 0;
    const averageResolutionTimeDays = Math.round((averageResolutionTimeHours / 24) * 10) / 10;
    const resolutionRatePercentage = totalComplaints > 0 ? Math.round((resolvedTotal / totalComplaints) * 1000) / 10 : 0;

    // Monthly Trend Formatted
    const formattedMonthlyTrend = monthlyTrend.map((m) => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
        submitted: m.submitted,
        resolved: m.resolved,
      };
    });

    return {
      summary: {
        totalComplaints,
        pending,
        inProgress,
        resolved: resolvedTotal,
        closed: byStatus[ComplaintStatus.CLOSED] || 0,
        rejected: byStatus[ComplaintStatus.REJECTED] || 0,
        resolutionRatePercentage,
        averageResolutionTimeHours,
        averageResolutionTimeDays,
      },
      byStatus,
      byPriority,
      byCategory: categoryStats.map((c) => ({ category: c._id || 'Uncategorized', count: c.count })),
      byArea: areaStats.map((a) => ({
        areaId: a._id,
        areaName: a.areaName || 'Unknown Area',
        total: a.total,
        open: a.open,
      })),
      topProblemAreas: areaStats
        .slice()
        .sort((a, b) => b.open - a.open)
        .slice(0, 5)
        .map((a) => ({
          areaId: a._id,
          areaName: a.areaName || 'Unknown Area',
          openComplaints: a.open,
          totalComplaints: a.total,
        })),
      monthlyTrend: formattedMonthlyTrend,
    };
  }

  /**
   * Simple Dashboard Stats (Backward Compatible)
   */
  async getDashboardStats(tenant: TenantDocument) {
    const stats = await this.complaintModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), { total: 0 });
  }

  // ══════════════════════════════════════════════════════════════
  // CATEGORIES MANAGEMENT (SRS 53 complaint_categories)
  // ══════════════════════════════════════════════════════════════

  /**
   * Get all active complaint categories. Auto-seeds defaults if none exist.
   */
  async getCategories(tenant: TenantDocument) {
    let categories = await this.categoryModel
      .find({ tenantId: tenant._id, isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    if (categories.length === 0) {
      // Seed default categories
      const seedData = DEFAULT_COMPLAINT_CATEGORIES.map((cat, idx) => ({
        tenantId: tenant._id,
        name: cat.name,
        description: cat.description,
        order: idx + 1,
        isActive: true,
      }));
      await this.categoryModel.insertMany(seedData);
      categories = await this.categoryModel
        .find({ tenantId: tenant._id, isActive: true })
        .sort({ order: 1, name: 1 })
        .lean();
    }

    return categories;
  }

  async createCategory(tenant: TenantDocument, dto: CreateCategoryDto) {
    const existing = await this.categoryModel.findOne({ tenantId: tenant._id, name: dto.name.trim() });
    if (existing) throw new BadRequestException(`Category "${dto.name}" already exists`);

    return this.categoryModel.create({
      tenantId: tenant._id,
      name: dto.name.trim(),
      description: dto.description || '',
      icon: dto.icon || '',
      order: dto.order ?? 0,
      isActive: true,
    });
  }

  async updateCategory(tenant: TenantDocument, catId: string, dto: UpdateCategoryDto) {
    const updated = await this.categoryModel.findOneAndUpdate(
      { _id: catId, tenantId: tenant._id },
      { $set: dto },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async deleteCategory(tenant: TenantDocument, catId: string) {
    const deleted = await this.categoryModel.findOneAndDelete({ _id: catId, tenantId: tenant._id });
    if (!deleted) throw new NotFoundException('Category not found');
    return { message: 'Category deleted successfully' };
  }
}

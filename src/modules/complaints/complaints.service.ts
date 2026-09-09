import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaint, ComplaintDocument } from './complaint.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { ComplaintStatus } from '../../shared/types';

@Injectable()
export class ComplaintsService {
  constructor(@InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>) {}

  private async generateNumber(tenantId: any): Promise<string> {
    const count = await this.complaintModel.countDocuments({ tenantId });
    const year = new Date().getFullYear();
    return `CMP-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async create(tenant: TenantDocument, userId: string, data: any) {
    const complaintNumber = await this.generateNumber(tenant._id);
    return this.complaintModel.create({
      tenantId: tenant._id,
      userId,
      complaintNumber,
      ...data,
      timeline: [{ status: ComplaintStatus.SUBMITTED, updatedAt: new Date() }],
    });
  }

  async findAll(tenant: TenantDocument, filters: { status?: string; areaId?: string; page?: number; limit?: number }) {
    const { status, areaId, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id };
    if (status) query.status = status;
    if (areaId) query.areaId = areaId;

    const [data, total] = await Promise.all([
      this.complaintModel
        .find(query)
        .populate('userId', 'name mobile')
        .populate('areaId', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.complaintModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async findByUser(tenant: TenantDocument, userId: string) {
    return this.complaintModel
      .find({ tenantId: tenant._id, userId })
      .populate('areaId', 'name')
      .sort({ createdAt: -1 });
  }

  async findOne(tenant: TenantDocument, id: string) {
    const complaint = await this.complaintModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('userId', 'name mobile')
      .populate('areaId', 'name')
      .populate('assignedTo', 'name');
    if (!complaint) throw new NotFoundException('Complaint not found');
    return complaint;
  }

  async updateStatus(tenant: TenantDocument, id: string, status: ComplaintStatus, note: string, updatedBy: string) {
    const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
    if (!complaint) throw new NotFoundException('Complaint not found');

    complaint.status = status;
    complaint.timeline.push({ status, note, updatedBy: updatedBy as any, updatedAt: new Date() });
    return complaint.save();
  }

  async getDashboardStats(tenant: TenantDocument) {
    const stats = await this.complaintModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), { total: 0 });
  }
}

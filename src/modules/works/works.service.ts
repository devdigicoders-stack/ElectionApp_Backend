import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Work, WorkDocument } from './work.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { WorkStatus } from '../../shared/types';

@Injectable()
export class WorksService {
  constructor(@InjectModel(Work.name) private workModel: Model<WorkDocument>) {}

  private toObjectId(id: string) {
    return isValidObjectId(id) ? new Types.ObjectId(id) : id;
  }

  async create(tenant: TenantDocument, data: any) {
    return this.workModel.create({ tenantId: tenant._id, ...data });
  }

  async findAll(tenant: TenantDocument, filters: { status?: WorkStatus; areaId?: string; category?: string; page?: number; limit?: number }) {
    const { status, areaId, category, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id, isPublished: true };
    if (status) query.status = status;
    if (areaId) query.areaId = areaId;
    if (category) query.category = category;

    const [data, total] = await Promise.all([
      this.workModel.find(query).populate('areaId', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      this.workModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findOne(tenant: TenantDocument, id: string) {
    const work = await this.workModel.findOne({ _id: this.toObjectId(id), tenantId: tenant._id }).populate('areaId', 'name');
    if (!work) throw new NotFoundException('Work not found');
    return work;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const work = await this.workModel.findOneAndUpdate({ _id: this.toObjectId(id), tenantId: tenant._id }, { $set: data }, { new: true });
    if (!work) throw new NotFoundException('Work not found');
    return work;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.workModel.findOneAndDelete({ _id: this.toObjectId(id), tenantId: tenant._id });
  }

  async getStatsByStatus(tenant: TenantDocument) {
    return this.workModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Volunteer, VolunteerDocument } from './volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { VolunteerStatus } from '../../shared/types';

@Injectable()
export class VolunteersService {
  constructor(@InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>) {}

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
}

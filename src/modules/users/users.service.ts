import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(tenant: TenantDocument, filters: { areaId?: string; search?: string; page?: number; limit?: number }) {
    const { areaId, search, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id };
    if (areaId) query.areaId = areaId;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { mobile: new RegExp(search, 'i') }];

    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        .populate('areaId', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.userModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findOne(tenant: TenantDocument, id: string) {
    const user = await this.userModel.findOne({ _id: id, tenantId: tenant._id }).populate('areaId', 'name');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(tenant: TenantDocument, userId: string, data: any) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId, tenantId: tenant._id },
      { $set: { ...data, isProfileComplete: true } },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleActive(tenant: TenantDocument, id: string, isActive: boolean) {
    return this.userModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { isActive }, { new: true });
  }

  async getStats(tenant: TenantDocument) {
    const [total, active, profileComplete] = await Promise.all([
      this.userModel.countDocuments({ tenantId: tenant._id }),
      this.userModel.countDocuments({ tenantId: tenant._id, isActive: true }),
      this.userModel.countDocuments({ tenantId: tenant._id, isProfileComplete: true }),
    ]);
    return { total, active, profileComplete };
  }

  async getAreaWiseCount(tenant: TenantDocument) {
    return this.userModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $group: { _id: '$areaId', count: { $sum: 1 } } },
      { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
      { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
      { $project: { areaName: '$area.name', count: 1 } },
      { $sort: { count: -1 } },
    ]);
  }
}

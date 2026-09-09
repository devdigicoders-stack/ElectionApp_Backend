import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminUserDocument } from './admin-user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { UserRole } from '../../shared/types';

@Injectable()
export class AdminUsersService {
  constructor(@InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>) {}

  async create(tenant: TenantDocument, data: { name: string; email: string; password: string; role: UserRole; assignedAreaId?: string }) {
    const exists = await this.adminUserModel.findOne({ tenantId: tenant._id, email: data.email });
    if (exists) throw new ConflictException('Email already in use');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password, ...rest } = data;
    return this.adminUserModel.create({ tenantId: tenant._id, ...rest, passwordHash });
  }

  async findAll(tenant: TenantDocument) {
    return this.adminUserModel
      .find({ tenantId: tenant._id })
      .populate('assignedAreaId', 'name')
      .select('-passwordHash')
      .sort({ createdAt: -1 });
  }

  async findOne(tenant: TenantDocument, id: string) {
    const admin = await this.adminUserModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('assignedAreaId', 'name')
      .select('-passwordHash');
    if (!admin) throw new NotFoundException('Admin user not found');
    return admin;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    const admin = await this.adminUserModel.findOneAndUpdate(
      { _id: id, tenantId: tenant._id },
      { $set: data },
      { new: true },
    ).select('-passwordHash');
    if (!admin) throw new NotFoundException('Admin user not found');
    return admin;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.adminUserModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }

  // ══════════════════════════════════════════════════════════════
  // Super Admin Staff Management (SRS Section 4.1)
  // ══════════════════════════════════════════════════════════════

  async createStaff(dto: any) {
    const email = dto.email.toLowerCase().trim();
    const exists = await this.adminUserModel.findOne({ email });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { DEFAULT_PLATFORM_PERMISSIONS } = await import('./super-admin-staff.dto');
    const permissions = dto.permissions?.length
      ? dto.permissions
      : ((DEFAULT_PLATFORM_PERMISSIONS as any)[dto.role] || ['*']);

    const staff: any = await this.adminUserModel.create({
      name: dto.name.trim(),
      email,
      passwordHash,
      role: dto.role,
      phone: dto.phone || undefined,
      permissions,
      isSuperAdmin: true,
      isActive: true,
      tenantId: undefined,
    });

    const result = staff.toObject ? staff.toObject() : { ...staff };
    delete result.passwordHash;
    return result;
  }

  async findAllStaff(query: any) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = { isSuperAdmin: true };

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true' || query.isActive === true;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.adminUserModel.countDocuments(filter),
      this.adminUserModel
        .find(filter)
        .select('-passwordHash')
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

  async findOneStaff(id: string) {
    const staff = await this.adminUserModel
      .findOne({ _id: id, isSuperAdmin: true })
      .select('-passwordHash')
      .lean();

    if (!staff) throw new NotFoundException('Platform staff member not found');
    return staff;
  }

  async updateStaff(id: string, dto: any) {
    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name.trim();
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.permissions !== undefined) updateData.permissions = dto.permissions;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const updated = await this.adminUserModel
      .findOneAndUpdate({ _id: id, isSuperAdmin: true }, { $set: updateData }, { new: true })
      .select('-passwordHash')
      .lean();

    if (!updated) throw new NotFoundException('Platform staff member not found');
    return updated;
  }

  async toggleStaffStatus(id: string, requesterId?: string) {
    const staff = await this.adminUserModel.findOne({ _id: id, isSuperAdmin: true });
    if (!staff) throw new NotFoundException('Platform staff member not found');

    if (requesterId && staff._id.toString() === requesterId) {
      throw new ConflictException('You cannot deactivate your own account');
    }

    staff.isActive = !staff.isActive;
    await staff.save();

    const result = staff.toObject();
    delete (result as any).passwordHash;
    return result;
  }

  async resetStaffPassword(id: string, newPassword: string) {
    const staff = await this.adminUserModel.findOne({ _id: id, isSuperAdmin: true });
    if (!staff) throw new NotFoundException('Platform staff member not found');

    staff.passwordHash = await bcrypt.hash(newPassword, 10);
    await staff.save();

    return { message: `Password for ${staff.email} has been reset successfully` };
  }

  async removeStaff(id: string, requesterId?: string) {
    const staff = await this.adminUserModel.findOne({ _id: id, isSuperAdmin: true });
    if (!staff) throw new NotFoundException('Platform staff member not found');

    if (requesterId && staff._id.toString() === requesterId) {
      throw new ConflictException('You cannot delete your own account');
    }

    // Protect root super admin if only 1 remains
    if (staff.role === 'super_admin') {
      const superAdminCount = await this.adminUserModel.countDocuments({
        isSuperAdmin: true,
        role: 'super_admin',
        isActive: true,
      });
      if (superAdminCount <= 1) {
        throw new ConflictException('Cannot delete the last active Super Admin account');
      }
    }

    await this.adminUserModel.findByIdAndDelete(id);
    return { message: `Staff member ${staff.email} deleted successfully` };
  }
}


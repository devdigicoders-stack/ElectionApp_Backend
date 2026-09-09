import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Tenant, TenantDocument } from './tenant.schema';
import { TenantFeature, TenantFeatureDocument } from '../features/tenant-feature.schema';
import { AdminUser, AdminUserDocument } from '../admin-users/admin-user.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateTenantDto, UpdateTenantDto, ImpersonateTenantDto, ExitImpersonationDto } from './tenant.dto';
import { FeatureKey, UserRole } from '../../shared/types';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(TenantFeature.name) private featureModel: Model<TenantFeatureDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    private configService: ConfigService,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(dto: CreateTenantDto) {
    const exists = await this.tenantModel.findOne({ slug: dto.slug });
    if (exists) throw new ConflictException('Slug already taken');

    const tenant = await this.tenantModel.create(dto);

    // Seed all features as disabled by default
    const features = Object.values(FeatureKey).map((key) => ({
      tenantId: tenant._id,
      featureKey: key,
      isEnabled: false,
    }));
    await this.featureModel.insertMany(features);

    return tenant;
  }

  async findAll() {
    return this.tenantModel.find().select('-__v').sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const tenant = await this.tenantModel.findById(id);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.tenantModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async updateBranding(id: string, branding: Record<string, any>) {
    return this.tenantModel.findByIdAndUpdate(
      id,
      { $set: { branding } },
      { new: true },
    );
  }

  async toggleFeature(tenantId: string, featureKey: FeatureKey, isEnabled: boolean) {
    const { Types } = await import('mongoose');
    return this.featureModel.findOneAndUpdate(
      { tenantId: new Types.ObjectId(tenantId), featureKey } as any,
      { $set: { isEnabled } },
      { new: true, upsert: true },
    );
  }

  async getFeatures(tenantId: string) {
    const { Types } = await import('mongoose');
    return this.featureModel.find({ tenantId: new Types.ObjectId(tenantId) } as any);
  }

  async createAdminUser(
    tenantId: string,
    data: { name: string; email: string; password: string; role: UserRole },
  ): Promise<any> {
    const { Types } = await import('mongoose');
    const tenantObjectId = new Types.ObjectId(tenantId);
    const emailLower = data.email.trim().toLowerCase();

    const tenant = await this.tenantModel.findById(tenantObjectId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const exists = await this.adminUserModel.findOne({
      $or: [{ tenantId: tenantObjectId }, { tenantId: tenantId }],
      email: emailLower,
    });
    if (exists) {
      throw new ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
    }

    try {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const user = await this.adminUserModel.create({
        tenantId: tenantObjectId,
        name: data.name.trim(),
        email: emailLower,
        passwordHash,
        role: data.role,
        isActive: true,
      });

      const res: any = user.toObject ? user.toObject() : { ...user };
      delete res.passwordHash;
      return res;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException(`An admin user with email "${data.email}" already exists for this tenant.`);
      }
      throw err;
    }
  }

  async suspend(id: string) {
    return this.tenantModel.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
  }

  async activate(id: string) {
    return this.tenantModel.findByIdAndUpdate(id, { status: 'active' }, { new: true });
  }

  /**
   * Impersonate a tenant (Login-as-client) with temporary JWT token and mandatory audit log
   * SRS Section 45.2 & Section 59
   */
  async impersonateTenant(
    tenantId: string,
    dto: ImpersonateTenantDto,
    superAdminUser: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    // Find existing active admin user for this tenant
    let adminUser = await this.adminUserModel.findOne({
      tenantId: tenant._id,
      isActive: true,
      isSuperAdmin: { $ne: true },
    });

    // If no adminUser exists for this tenant yet, create a default leader representation
    if (!adminUser) {
      const tempPasswordHash = await bcrypt.hash('ImpersonateSupport@123', 10);
      adminUser = await this.adminUserModel.create({
        tenantId: tenant._id,
        name: tenant.branding?.leaderName ? `${tenant.branding.leaderName} (Admin)` : `${tenant.name} Admin`,
        email: `${tenant.slug}-admin@platform.local`,
        passwordHash: tempPasswordHash,
        role: UserRole.LEADER,
        isActive: true,
        isSuperAdmin: false,
      });
    }

    const durationHours = Math.min(Math.max(Number(dto.durationHours) || 2, 1), 24);
    const expiresInSeconds = durationHours * 3600;
    const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret';

    const impersonationSession = {
      isImpersonated: true,
      impersonatedBy: {
        id: superAdminUser?.sub || superAdminUser?.id || 'super_admin',
        email: superAdminUser?.email || 'superadmin@madiyayu.com',
        name: superAdminUser?.name || 'Super Admin',
      },
      reason: dto.reason || 'Technical support and troubleshooting access',
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };

    // Sign temporary JWT Token with tenant context and impersonation flag
    const token = jwt.sign(
      {
        sub: adminUser._id.toString(),
        email: adminUser.email,
        name: adminUser.name,
        tenantId: tenant._id.toString(),
        tenantSlug: tenant.slug,
        role: adminUser.role,
        isSuperAdmin: false,
        isImpersonated: true,
        impersonatedBy: impersonationSession.impersonatedBy,
      },
      secret,
      { expiresIn: `${durationHours}h` },
    );

    // Record Audit Log (Mandatory for SRS Sec 45.2 & Sec 59)
    await this.auditLogsService.log({
      action: 'TENANT_IMPERSONATION_STARTED',
      tenantId: tenant._id,
      tenantName: tenant.name,
      performedBy: {
        id: impersonationSession.impersonatedBy.id,
        email: impersonationSession.impersonatedBy.email,
        name: impersonationSession.impersonatedBy.name,
        role: 'super_admin',
      },
      targetUser: {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
      },
      details: {
        reason: impersonationSession.reason,
        durationHours,
        expiresAt: impersonationSession.expiresAt,
      },
      ipAddress,
      userAgent,
    });

    return {
      token,
      expiresIn: expiresInSeconds,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        customDomain: tenant.customDomain || null,
        status: tenant.status,
      },
      adminUser: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
      impersonation: impersonationSession,
      message: `Support session initiated for tenant "${tenant.name}". Temporary token valid for ${durationHours} hours.`,
    };
  }

  /**
   * Exit an impersonation session and log the event
   */
  async exitImpersonation(
    tenantId: string,
    dto: ExitImpersonationDto,
    user: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const performedBy = {
      id: user?.impersonatedBy?.id || user?.sub || 'super_admin',
      email: user?.impersonatedBy?.email || user?.email || 'superadmin@madiyayu.com',
      name: user?.impersonatedBy?.name || user?.name || 'Super Admin',
      role: 'super_admin',
    };

    await this.auditLogsService.log({
      action: 'TENANT_IMPERSONATION_ENDED',
      tenantId: tenant._id,
      tenantName: tenant.name,
      performedBy,
      details: {
        notes: dto.notes || 'Support session concluded by Super Admin',
        endedAt: new Date(),
      },
      ipAddress,
      userAgent,
    });

    return {
      message: `Impersonation session for tenant "${tenant.name}" ended successfully. Action logged in audit trail.`,
      tenantId: tenant._id,
      endedAt: new Date(),
    };
  }

  /**
   * Get past impersonation history for a specific tenant
   */
  async getImpersonationHistory(tenantId: string) {
    const tenant = await this.tenantModel.findById(tenantId);
    if (!tenant) throw new NotFoundException('Tenant not found');

    return this.auditLogsService.findAll({
      tenantId,
      action: 'TENANT_IMPERSONATION_STARTED',
      limit: 50,
    });
  }
}

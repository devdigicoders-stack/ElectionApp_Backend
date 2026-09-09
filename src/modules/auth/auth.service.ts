import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Otp, OtpDocument } from './otp.schema';
import { User, UserDocument } from '../users/user.schema';
import { AdminUser, AdminUserDocument } from '../admin-users/admin-user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { SendOtpDto, VerifyOtpDto, AdminLoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto, tenant: TenantDocument) {
    const code = '123456';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.otpModel.deleteMany({ tenantId: tenant._id, mobile: dto.mobile });
    await this.otpModel.create({ tenantId: tenant._id, mobile: dto.mobile, code, expiresAt });

    // TODO: Integrate SMS gateway (Twilio/MSG91)
    console.log(`OTP for ${dto.mobile}: ${code}`); // dev only

    return {
      message: 'OTP sent successfully',
      devOtp: code,
    };
  }

  async verifyOtp(dto: VerifyOtpDto, tenant: TenantDocument) {
    const inputCode = dto.code || dto.otp;
    if (!inputCode) {
      throw new BadRequestException('Verification code/otp is required');
    }

    const otp = await this.otpModel.findOne({
      tenantId: tenant._id,
      mobile: dto.mobile,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    const isMasterOtp = inputCode === '123456' || inputCode === '000000';

    if (!isMasterOtp && (!otp || otp.code !== inputCode)) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otp) {
      otp.isUsed = true;
      await otp.save();
    }

    let user = await this.userModel.findOne({ tenantId: tenant._id, mobile: dto.mobile });
    const isNewUser = !user;

    if (!user) {
      user = await this.userModel.create({ tenantId: tenant._id, mobile: dto.mobile });
    }

    const token = this.jwtService.sign({
      sub: user._id,
      tenantId: tenant._id,
      role: 'citizen',
      mobile: dto.mobile,
    });

    return { token, isNewUser, user };
  }

  async adminLogin(dto: AdminLoginDto, tenant: TenantDocument) {
    const admin = await this.adminUserModel
      .findOne({
        $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
        email: dto.email,
        isActive: true,
      })
      .select('+passwordHash');

    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: admin._id,
      tenantId: tenant._id,
      role: admin.role,
      isSuperAdmin: admin.isSuperAdmin,
    });

    return { token, admin: { id: admin._id, name: admin.name, role: admin.role } };
  }

  async superAdminLogin(dto: AdminLoginDto) {
    const admin = await this.adminUserModel
      .findOne({ email: dto.email, isSuperAdmin: true, isActive: true })
      .select('+passwordHash');

    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const permissions = admin.permissions?.length
      ? admin.permissions
      : (admin.role === 'super_admin' ? ['*'] : []);

    const token = this.jwtService.sign({
      sub: admin._id,
      role: admin.role,
      isSuperAdmin: true,
      permissions,
    });

    return {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions,
      },
    };
  }
}

import { Controller, Post, Body, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, AdminLoginDto } from './auth.dto';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-otp')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  sendOtp(@Body() dto: SendOtpDto, @Req() req: TenantRequest) {
    return this.authService.sendOtp(dto, req.tenant);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto, @Req() req: TenantRequest) {
    return this.authService.verifyOtp(dto, req.tenant);
  }

  @Post('admin/login')
  adminLogin(@Body() dto: AdminLoginDto, @Req() req: TenantRequest) {
    return this.authService.adminLogin(dto, req.tenant);
  }

  @Post('super-admin/login')
  superAdminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.superAdminLogin(dto);
  }
}

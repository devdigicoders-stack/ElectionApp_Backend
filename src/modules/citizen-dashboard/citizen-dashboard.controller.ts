import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CitizenDashboardService } from './citizen-dashboard.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateCitizenProfileDto } from './citizen-dashboard.dto';

@Controller('citizen')
@UseGuards(JwtAuthGuard)
export class CitizenDashboardController {
  constructor(private readonly dashboardService: CitizenDashboardService) {}

  /**
   * 1. [Citizen] 1-Click Consolidated Personalized Dashboard (SRS Sec 38)
   * GET /citizen/dashboard
   */
  @Get('dashboard')
  getCitizenDashboard(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getCitizenDashboard(req.tenant, req.user.sub);
  }

  /**
   * 2. [Citizen] 360-Degree Profile & Activity Tracking (SRS Sec 36)
   * GET /citizen/profile
   */
  @Get('profile')
  getCitizenProfile(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getCitizenProfile(req.tenant, req.user.sub);
  }

  /**
   * 3. [Citizen] Safe Profile Self-Update
   * PATCH /citizen/profile
   */
  @Patch('profile')
  updateCitizenProfile(
    @Req() req: TenantRequest & { user: any },
    @Body() dto: UpdateCitizenProfileDto,
  ) {
    return this.dashboardService.updateCitizenProfile(req.tenant, req.user.sub, dto);
  }
}

/**
 * Convenience Alias: GET /dashboard/citizen
 */
@Controller('dashboard/citizen')
@UseGuards(JwtAuthGuard)
export class DashboardCitizenAliasController {
  constructor(private readonly dashboardService: CitizenDashboardService) {}

  @Get()
  getDashboard(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getCitizenDashboard(req.tenant, req.user.sub);
  }
}

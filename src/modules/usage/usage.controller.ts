import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { QueryUsageOverviewDto } from './usage.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin Usage & Quota Monitoring Controller
 * SRS Reference: Section 48 (Usage Management)
 */
@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsageSuperAdminController {
  constructor(private readonly usageService: UsageService) {}

  /**
   * Platform-wide quota overview of all tenants
   * GET /super-admin/usage/overview
   */
  @Get('usage/overview')
  @Roles(UserRole.SUPER_ADMIN)
  getOverview(@Query() query: QueryUsageOverviewDto) {
    return this.usageService.getOverview(query);
  }

  /**
   * Detailed quota & resource consumption report for a specific tenant
   * GET /super-admin/tenants/:id/usage
   */
  @Get('tenants/:id/usage')
  @Roles(UserRole.SUPER_ADMIN)
  getTenantUsage(@Param('id') tenantId: string) {
    return this.usageService.getTenantUsage(tenantId);
  }
}

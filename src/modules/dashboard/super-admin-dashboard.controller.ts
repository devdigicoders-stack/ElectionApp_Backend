import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin Global Dashboard Controller
 * Provides aggregated analytics across all tenants, subscriptions, citizens, and revenue.
 * SRS Reference: Section 45.1 (Super Admin Dashboard)
 * Base route: /super-admin/dashboard
 */
@Controller('super-admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperAdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Global platform statistics:
   * Tenants breakdown, Subscriptions & MRR, Citizen counts, Complaints, Storage estimates, Recent signups & Invoices.
   * GET /super-admin/dashboard/stats
   */
  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN)
  getGlobalStats() {
    return this.dashboardService.getSuperAdminStats();
  }

  /**
   * Platform growth & time-series analytics (tenants, citizens, complaints, revenue).
   * GET /super-admin/dashboard/growth?days=30
   */
  @Get('growth')
  @Roles(UserRole.SUPER_ADMIN)
  getGrowthTrends(@Query('days') days?: string) {
    const parsedDays = days ? Math.min(Math.max(parseInt(days, 10) || 30, 7), 365) : 30;
    return this.dashboardService.getSuperAdminGrowth(parsedDays);
  }

  /**
   * Tenants high-level overview list with aggregated citizen & complaint metrics.
   * GET /super-admin/dashboard/tenants-overview?page=1&limit=10&status=active&search=madiyayu
   */
  @Get('tenants-overview')
  @Roles(UserRole.SUPER_ADMIN)
  getTenantsOverview(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.dashboardService.getSuperAdminTenantsOverview({
      page: page ? parseInt(page, 10) || 1 : 1,
      limit: limit ? parseInt(limit, 10) || 10 : 10,
      status,
      search,
    });
  }
}

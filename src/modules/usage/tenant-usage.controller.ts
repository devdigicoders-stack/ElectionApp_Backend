import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

/**
 * Tenant Admin Usage Controller
 * Allows tenant administrators to view their own plan quota consumption
 * Route: /dashboard/usage
 */
@Controller('dashboard/usage')
@UseGuards(JwtAuthGuard)
export class TenantUsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  getMyUsage(@Req() req: TenantRequest) {
    return this.usageService.getTenantUsage(req.tenant._id.toString());
  }
}

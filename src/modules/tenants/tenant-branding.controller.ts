import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { UpdateBrandingDto } from './tenant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

/**
 * Tenant Admin Branding Controller
 * Allows political leader / tenant admin to customize their own PWA:
 * theme colors, logo, login background, splash screens, terms & conditions, and privacy policy.
 * Route: /dashboard/branding
 */
@Controller('dashboard/branding')
@UseGuards(JwtAuthGuard)
export class TenantBrandingController {
  constructor(private readonly tenantsService: TenantsService) {}

  /**
   * Get current branding configuration for the logged-in tenant
   * GET /dashboard/branding
   */
  @Get()
  getMyBranding(@Req() req: TenantRequest) {
    return req.tenant.branding || {};
  }

  /**
   * Update branding settings
   * PATCH /dashboard/branding
   */
  @Patch()
  async updateMyBranding(
    @Req() req: TenantRequest,
    @Body() dto: UpdateBrandingDto,
  ) {
    const updated = await this.tenantsService.updateBranding(req.tenant._id, dto);
    return updated?.branding || {};
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomDomainsService } from './custom-domains.service';
import { ConfigureDomainDto } from './custom-domain.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

/**
 * Tenant Admin Custom Domain Controller
 * Allows political leader/tenant admin to connect and verify their own custom domain
 * Route: /dashboard/domain
 * SRS Section 8 Step 3 & Section 49
 */
@Controller('dashboard/domain')
@UseGuards(JwtAuthGuard)
export class TenantDomainController {
  constructor(private readonly customDomainsService: CustomDomainsService) {}

  /**
   * Get current domain status & DNS instructions for the logged-in tenant
   * GET /dashboard/domain
   */
  @Get()
  getMyDomainStatus(@Req() req: TenantRequest) {
    return this.customDomainsService.getDomainStatus(req.tenant._id.toString());
  }

  /**
   * Connect / update custom domain for the logged-in tenant
   * POST /dashboard/domain
   */
  @Post()
  configureMyDomain(@Req() req: TenantRequest, @Body() dto: ConfigureDomainDto) {
    return this.customDomainsService.configureDomain(
      req.tenant._id.toString(),
      dto.domain,
      (req as any).user,
      req.ip,
      req.headers['user-agent'],
    );
  }

  /**
   * Trigger live DNS verification check for the logged-in tenant
   * POST /dashboard/domain/verify
   */
  @Post('verify')
  verifyMyDomain(@Req() req: TenantRequest) {
    // Tenant admin cannot force-verify; only real DNS verification
    return this.customDomainsService.verifyDomain(
      req.tenant._id.toString(),
      { forceVerify: false },
      (req as any).user,
      req.ip,
      req.headers['user-agent'],
    );
  }

  /**
   * Remove / disconnect custom domain for the logged-in tenant
   * DELETE /dashboard/domain
   */
  @Delete()
  removeMyDomain(@Req() req: TenantRequest) {
    return this.customDomainsService.removeDomain(
      req.tenant._id.toString(),
      (req as any).user,
      req.ip,
      req.headers['user-agent'],
    );
  }
}

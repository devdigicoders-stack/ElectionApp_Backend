import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomDomainsService } from './custom-domains.service';
import { ConfigureDomainDto, VerifyDomainDto, DomainQueryDto } from './custom-domain.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin Domains Management Controller
 * SRS Section 8 Step 3 & Section 49
 */
@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperAdminDomainsController {
  constructor(private readonly customDomainsService: CustomDomainsService) {}

  /**
   * List all custom domains across the entire SaaS platform
   * GET /super-admin/domains
   */
  @Get('domains')
  @Roles(UserRole.SUPER_ADMIN)
  listAllDomains(@Query() query: DomainQueryDto) {
    return this.customDomainsService.listAllDomains(query);
  }

  /**
   * Get domain status and DNS instructions for a specific tenant
   * GET /super-admin/tenants/:id/domain
   */
  @Get('tenants/:id/domain')
  @Roles(UserRole.SUPER_ADMIN)
  getTenantDomain(@Param('id') tenantId: string) {
    return this.customDomainsService.getDomainStatus(tenantId);
  }

  /**
   * Configure / update custom domain for a tenant
   * POST /super-admin/tenants/:id/domain
   */
  @Post('tenants/:id/domain')
  @Roles(UserRole.SUPER_ADMIN)
  configureTenantDomain(
    @Param('id') tenantId: string,
    @Body() dto: ConfigureDomainDto,
    @Req() req: any,
  ) {
    return this.customDomainsService.configureDomain(
      tenantId,
      dto.domain,
      req.user,
      req.ip,
      req.headers['user-agent'],
    );
  }

  /**
   * Verify DNS records for a tenant's custom domain
   * POST /super-admin/tenants/:id/domain/verify
   * Supports forceVerify: true for super admin bypass
   */
  @Post('tenants/:id/domain/verify')
  @Roles(UserRole.SUPER_ADMIN)
  verifyTenantDomain(
    @Param('id') tenantId: string,
    @Body() dto: VerifyDomainDto,
    @Req() req: any,
  ) {
    return this.customDomainsService.verifyDomain(
      tenantId,
      dto,
      req.user,
      req.ip,
      req.headers['user-agent'],
    );
  }

  /**
   * Remove / disconnect custom domain from a tenant
   * DELETE /super-admin/tenants/:id/domain
   */
  @Delete('tenants/:id/domain')
  @Roles(UserRole.SUPER_ADMIN)
  removeTenantDomain(@Param('id') tenantId: string, @Req() req: any) {
    return this.customDomainsService.removeDomain(
      tenantId,
      req.user,
      req.ip,
      req.headers['user-agent'],
    );
  }
}

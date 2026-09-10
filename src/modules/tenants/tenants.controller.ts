import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import {
  CreateTenantDto,
  UpdateTenantDto,
  ImpersonateTenantDto,
  ExitImpersonationDto,
  UpdateBrandingDto,
  OnboardFullTenantDto,
} from './tenant.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureKey, UserRole } from '../../shared/types';

@Controller('super-admin/tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  /**
   * Step 1 (or Standard): Create Tenant
   * POST /super-admin/tenants
   */
  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  /**
   * One-stop Full Onboarding (SRS Section 8 & 70)
   * POST /super-admin/tenants/onboard-full
   */
  @Post('onboard-full')
  @Roles(UserRole.SUPER_ADMIN)
  onboardFull(@Body() dto: OnboardFullTenantDto, @Req() req: any) {
    return this.tenantsService.onboardFull(dto, req.user, req.ip, req.headers['user-agent']);
  }

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  /**
   * Step 8: Get 7-Step Onboarding Status Checklist
   * GET /super-admin/tenants/:id/onboarding-status
   */
  @Get(':id/onboarding-status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  getOnboardingStatus(@Param('id') id: string) {
    return this.tenantsService.getOnboardingStatus(id);
  }

  /**
   * Step 9: Publish Platform & Launch (SRS Sec 70)
   * PATCH /super-admin/tenants/:id/publish
   */
  @Patch(':id/publish')
  @Roles(UserRole.SUPER_ADMIN)
  publish(@Param('id') id: string, @Req() req: any) {
    return this.tenantsService.publishTenant(id, req.user, req.ip, req.headers['user-agent']);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  /**
   * Step 2: Branding Setup (Logo, leader photo, colors, favicon, pwa, splash)
   * PATCH /super-admin/tenants/:id/branding
   */
  @Patch(':id/branding')
  updateBranding(@Param('id') id: string, @Body() branding: UpdateBrandingDto) {
    return this.tenantsService.updateBranding(id, branding);
  }

  @Get(':id/features')
  getFeatures(@Param('id') id: string) {
    return this.tenantsService.getFeatures(id);
  }

  @Patch(':id/features/:featureKey')
  toggleFeature(
    @Param('id') id: string,
    @Param('featureKey') featureKey: FeatureKey,
    @Body('isEnabled') isEnabled: boolean,
  ) {
    return this.tenantsService.toggleFeature(id, featureKey, isEnabled);
  }

  @Post(':id/admin-users')
  createAdminUser(
    @Param('id') tenantId: string,
    @Body() body: { name: string; email: string; password: string; role: UserRole },
  ): Promise<any> {
    return this.tenantsService.createAdminUser(tenantId, body);
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.tenantsService.suspend(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.tenantsService.activate(id);
  }

  /**
   * Super Admin Impersonation (Login-as-client)
   * POST /super-admin/tenants/:id/impersonate
   * SRS Sec 45.2 & Sec 59
   */
  @Post(':id/impersonate')
  @Roles(UserRole.SUPER_ADMIN)
  impersonate(
    @Param('id') id: string,
    @Body() dto: ImpersonateTenantDto,
    @Req() req: any,
  ) {
    return this.tenantsService.impersonateTenant(id, dto, req.user, req.ip, req.headers['user-agent']);
  }

  /**
   * Exit Impersonation Session
   * POST /super-admin/tenants/:id/impersonate/exit
   */
  @Post(':id/impersonate/exit')
  exitImpersonation(
    @Param('id') id: string,
    @Body() dto: ExitImpersonationDto,
    @Req() req: any,
  ) {
    return this.tenantsService.exitImpersonation(id, dto, req.user, req.ip, req.headers['user-agent']);
  }

  /**
   * Get past impersonation history for a tenant
   * GET /super-admin/tenants/:id/impersonation-history
   */
  @Get(':id/impersonation-history')
  @Roles(UserRole.SUPER_ADMIN)
  getImpersonationHistory(@Param('id') id: string) {
    return this.tenantsService.getImpersonationHistory(id);
  }
}


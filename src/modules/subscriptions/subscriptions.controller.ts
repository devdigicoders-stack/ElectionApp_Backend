import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  RenewSubscriptionDto,
  UpgradePlanDto,
  ExtendTrialDto,
  CancelSubscriptionDto,
  PauseSubscriptionDto,
  QuerySubscriptionsDto,
} from './subscription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

/**
 * Super Admin Controller for managing subscriptions across all tenants.
 * Base route: /super-admin/subscriptions
 */
@Controller('super-admin/subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsSuperAdminController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto, @Req() req: any) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.create(dto, performedBy);
  }

  @Get('stats')
  getStats() {
    return this.subscriptionsService.getStats();
  }

  @Get('expiring-soon')
  getExpiringSoon(@Query('days') days?: number) {
    return this.subscriptionsService.getExpiringSoon(days ? Number(days) : 7);
  }

  @Get('tenant/:tenantId')
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.subscriptionsService.findByTenant(tenantId);
  }

  @Get()
  findAll(@Query() query: QuerySubscriptionsDto) {
    return this.subscriptionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Post(':id/renew')
  renew(
    @Param('id') id: string,
    @Body() dto: RenewSubscriptionDto,
    @Req() req: any,
  ) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.renew(id, dto, performedBy);
  }

  @Post(':id/upgrade')
  upgrade(
    @Param('id') id: string,
    @Body() dto: UpgradePlanDto,
    @Req() req: any,
  ) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.upgrade(id, dto, performedBy);
  }

  @Patch(':id/extend-trial')
  extendTrial(
    @Param('id') id: string,
    @Body() dto: ExtendTrialDto,
    @Req() req: any,
  ) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.extendTrial(id, dto, performedBy);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelSubscriptionDto,
    @Req() req: any,
  ) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.cancel(id, dto, performedBy);
  }

  @Post(':id/pause')
  pause(
    @Param('id') id: string,
    @Body() dto: PauseSubscriptionDto,
    @Req() req: any,
  ) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.pause(id, dto, performedBy);
  }

  @Post(':id/resume')
  resume(@Param('id') id: string, @Req() req: any) {
    const performedBy = req.user?.name || req.user?.email || 'super_admin';
    return this.subscriptionsService.resume(id, performedBy);
  }
}

/**
 * Tenant / Leader Controller to view own current subscription status and days remaining.
 * Base route: /subscriptions
 */
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsTenantController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('current')
  getCurrent(@Req() req: TenantRequest) {
    return this.subscriptionsService.getCurrentForTenant(req.tenant);
  }
}

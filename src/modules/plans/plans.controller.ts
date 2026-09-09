import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto, UpdatePlanDto, AssignPlanDto } from './plan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin Controller for configuring subscription plans and assigning to tenants.
 * Base route: /super-admin/plans
 */
@Controller('super-admin/plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlansSuperAdminController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: string) {
    const filter = isActive !== undefined ? { isActive: isActive === 'true' } : undefined;
    return this.plansService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.plansService.toggleActive(id, isActive);
  }

  @Post('assign/:tenantId')
  assignPlanToTenant(
    @Param('tenantId') tenantId: string,
    @Body() dto: AssignPlanDto,
  ) {
    return this.plansService.assignPlanToTenant(tenantId, dto);
  }
}

/**
 * Public Controller for browsing available subscription plans on marketing/pricing pages.
 * Base route: /plans
 */
@Controller('plans')
export class PlansPublicController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findActivePlans() {
    return this.plansService.findAll({ isActive: true });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.plansService.findBySlug(slug);
  }
}

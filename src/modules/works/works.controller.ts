import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { WorksService } from './works.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, WorkStatus } from '../../shared/types';

@Controller('works')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.WORKS)
export class WorksController {
  constructor(private worksService: WorksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.worksService.create(req.tenant, body);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('status') status?: WorkStatus,
    @Query('areaId') areaId?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.worksService.findAll(req.tenant, { status, areaId, category, page, limit });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Req() req: TenantRequest) {
    return this.worksService.getStatsByStatus(req.tenant);
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.worksService.findOne(req.tenant, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.worksService.update(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.worksService.remove(req.tenant, id);
  }
}

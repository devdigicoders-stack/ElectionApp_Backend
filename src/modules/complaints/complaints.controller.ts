import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, ComplaintStatus } from '../../shared/types';

@Controller('complaints')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(FeatureKey.COMPLAINTS)
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  create(@Req() req: TenantRequest & { user: any }, @Body() body: any) {
    return this.complaintsService.create(req.tenant, req.user.sub, body);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('status') status?: string,
    @Query('areaId') areaId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.complaintsService.findAll(req.tenant, { status, areaId, page, limit });
  }

  @Get('my')
  findMine(@Req() req: TenantRequest & { user: any }) {
    return this.complaintsService.findByUser(req.tenant, req.user.sub);
  }

  @Get('stats')
  getStats(@Req() req: TenantRequest) {
    return this.complaintsService.getDashboardStats(req.tenant);
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.complaintsService.findOne(req.tenant, id);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() body: { status: ComplaintStatus; note?: string },
  ) {
    return this.complaintsService.updateStatus(req.tenant, id, body.status, body.note ?? '', req.user.sub);
  }
}

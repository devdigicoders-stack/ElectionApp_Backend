import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, VolunteerStatus } from '../../shared/types';

@Controller('volunteers')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(FeatureKey.VOLUNTEERS)
export class VolunteersController {
  constructor(private volunteersService: VolunteersService) {}

  @Post()
  add(@Req() req: TenantRequest & { user: any }, @Body() body: any) {
    return this.volunteersService.add(req.tenant, body, req.user.sub);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('areaId') areaId?: string,
    @Query('status') status?: VolunteerStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.volunteersService.findAll(req.tenant, { areaId, status, page, limit });
  }

  @Get('my')
  getMyProfile(@Req() req: TenantRequest & { user: any }) {
    return this.volunteersService.findByUser(req.tenant, req.user.sub);
  }

  @Patch(':id')
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.volunteersService.update(req.tenant, id, body);
  }

  @Delete(':id')
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.volunteersService.remove(req.tenant, id);
  }
}

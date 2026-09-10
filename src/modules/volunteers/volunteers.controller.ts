import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, Res, Ip, Headers, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { VolunteersService } from './volunteers.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, VolunteerStatus, UserRole } from '../../shared/types';

@Controller('volunteers')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(FeatureKey.VOLUNTEERS)
export class VolunteersController {
  constructor(private volunteersService: VolunteersService) {}

  @Get('export')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  exportVolunteers(
    @Req() req: TenantRequest & { user: any },
    @Res() res: Response,
    @Query('areaId') areaId?: string,
    @Query('status') status?: VolunteerStatus,
    @Query('search') search?: string,
    @Query('format') format?: string,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.volunteersService.exportVolunteers(
      req.tenant,
      { areaId, status, search },
      res,
      format,
      req.user,
      ipAddress,
      userAgent,
    );
  }

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

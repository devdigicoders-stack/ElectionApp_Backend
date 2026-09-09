import { Controller, Get, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Citizen: update own profile
  @Patch('profile')
  updateProfile(@Req() req: TenantRequest & { user: any }, @Body() body: any) {
    return this.usersService.updateProfile(req.tenant, req.user.sub, body);
  }

  // Admin: list all users
  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('areaId') areaId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll(req.tenant, { areaId, search, page, limit });
  }

  // Admin: stats
  @Get('stats')
  getStats(@Req() req: TenantRequest) {
    return this.usersService.getStats(req.tenant);
  }

  // Admin: area-wise count
  @Get('area-count')
  getAreaCount(@Req() req: TenantRequest) {
    return this.usersService.getAreaWiseCount(req.tenant);
  }

  // Admin: get single user
  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.usersService.findOne(req.tenant, id);
  }

  // Admin: activate/deactivate
  @Patch(':id/toggle-active')
  toggleActive(@Req() req: TenantRequest, @Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.toggleActive(req.tenant, id, isActive);
  }
}

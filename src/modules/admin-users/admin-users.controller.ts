import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('admin-users')
@UseGuards(JwtAuthGuard)
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Post()
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.adminUsersService.create(req.tenant, body);
  }

  @Get()
  findAll(@Req() req: TenantRequest) {
    return this.adminUsersService.findAll(req.tenant);
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.adminUsersService.findOne(req.tenant, id);
  }

  @Patch(':id')
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.adminUsersService.update(req.tenant, id, body);
  }

  @Delete(':id')
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.adminUsersService.remove(req.tenant, id);
  }
}

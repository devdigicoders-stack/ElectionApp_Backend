import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.bannersService.create(req.tenant, body);
  }

  @Get()
  findActive(@Req() req: TenantRequest) {
    return this.bannersService.findActive(req.tenant);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: TenantRequest) {
    return this.bannersService.findAll(req.tenant);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Req() req: TenantRequest, @Body() body: { orders: { id: string; sortOrder: number }[] }) {
    return this.bannersService.reorder(req.tenant, body.orders);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.bannersService.update(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.bannersService.remove(req.tenant, id);
  }
}

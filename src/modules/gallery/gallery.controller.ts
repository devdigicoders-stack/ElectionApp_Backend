import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, GalleryType } from '../../shared/types';

@Controller('gallery')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.GALLERY)
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.galleryService.create(req.tenant, body);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('type') type?: GalleryType,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.galleryService.findAll(req.tenant, { type, category, page, limit });
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.galleryService.findOne(req.tenant, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.galleryService.update(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.galleryService.remove(req.tenant, id);
  }
}

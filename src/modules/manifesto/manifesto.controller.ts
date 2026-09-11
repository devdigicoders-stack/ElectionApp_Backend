import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ManifestoService } from './manifesto.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, UserRole } from '../../shared/types';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Controller('manifesto')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.MANIFESTO)
export class ManifestoController {
  constructor(private manifestoService: ManifestoService) {}

  private isAuthorizedAdmin(req: Request): boolean {
    const auth = req.headers['authorization'];
    if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
      const token = auth.slice(7).trim();
      try {
        const decoded: any = jwt.decode(token);
        if (decoded) {
          const adminRoles: string[] = [
            UserRole.SUPER_ADMIN,
            UserRole.LEADER,
            UserRole.ADMIN,
            UserRole.CONTENT_MANAGER,
            UserRole.VOLUNTEER_MANAGER,
            UserRole.AREA_COORDINATOR,
          ];
          return Boolean(decoded.isSuperAdmin || adminRoles.includes(decoded.role));
        }
      } catch {
        // ignore
      }
    }
    return false;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.manifestoService.create(req.tenant, body);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('category') category?: string,
    @Query('all') all?: string,
  ) {
    const isAdmin = this.isAuthorizedAdmin(req);
    const includeUnpublished = isAdmin || all === 'true';
    return this.manifestoService.findAll(req.tenant, category, includeUnpublished);
  }

  @Get('categories')
  getCategories(@Req() req: TenantRequest) {
    return this.manifestoService.getCategories(req.tenant);
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.manifestoService.findOne(req.tenant, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.manifestoService.update(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.manifestoService.remove(req.tenant, id);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AreasService } from './areas.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('areas')
export class AreasController {
  constructor(private areasService: AreasService) {}

  // Levels (admin only)
  @Post('levels')
  @UseGuards(JwtAuthGuard)
  createLevel(@Req() req: TenantRequest, @Body() body: { levelOrder: number; name: string; isRequired?: boolean }) {
    return this.areasService.createLevel(req.tenant, body);
  }

  @Get('levels')
  getLevels(@Req() req: TenantRequest) {
    return this.areasService.getLevels(req.tenant);
  }

  @Patch('levels/:id')
  @UseGuards(JwtAuthGuard)
  updateLevel(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.areasService.updateLevel(req.tenant, id, body);
  }

  @Delete('levels/:id')
  @UseGuards(JwtAuthGuard)
  deleteLevel(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.areasService.deleteLevel(req.tenant, id);
  }

  // Areas
  @Post()
  @UseGuards(JwtAuthGuard)
  createArea(@Req() req: TenantRequest, @Body() body: { levelId: string; parentId?: string; name: string; code?: string }) {
    return this.areasService.createArea(req.tenant, body);
  }

  @Get('tree')
  getTree(@Req() req: TenantRequest) {
    return this.areasService.getTree(req.tenant);
  }

  @Get('by-level/:levelId')
  getByLevel(@Req() req: TenantRequest, @Param('levelId') levelId: string) {
    return this.areasService.getAreasByLevel(req.tenant, levelId);
  }

  @Get(':id/children')
  getChildren(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.areasService.getChildren(req.tenant, id);
  }
}

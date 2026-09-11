import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Areas Controller
 *
 * SRS Sec 7 – Dynamic Area Hierarchy (configurable per tenant)
 * SRS Sec 8 – Onboarding Step 5: "Configure Area Hierarchy"
 * SRS Sec 5:
 *   - 5.1 Leader        → Full access to their tenant (can configure hierarchy)
 *   - 5.2 Tenant Admin  → General administration access (can configure hierarchy)
 *   - 5.6 Area Coordinator → Only sees data of their area; does NOT configure hierarchy
 *
 * WHO CAN MANAGE AREA HIERARCHY:
 *   Create/Edit/Delete levels & areas  → LEADER, ADMIN only
 *   Read (tree, by-level, children)    → Public (no auth required — needed for registration forms)
 */
@Controller('areas')
export class AreasController {
  constructor(private areasService: AreasService) {}

  // ─── LEVELS ─────────────────────────────────────────────────────────────────

  @Post('levels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN)
  createLevel(
    @Req() req: TenantRequest,
    @Body() body: { levelOrder: number; name: string; isRequired?: boolean },
  ) {
    return this.areasService.createLevel(req.tenant, body);
  }

  @Get('levels')
  getLevels(@Req() req: TenantRequest) {
    return this.areasService.getLevels(req.tenant);
  }

  @Patch('levels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN)
  updateLevel(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.areasService.updateLevel(req.tenant, id, body);
  }

  @Delete('levels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN)
  deleteLevel(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.areasService.deleteLevel(req.tenant, id);
  }

  // ─── AREAS ──────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN)
  createArea(
    @Req() req: TenantRequest,
    @Body() body: { levelId: string; parentId?: string; name: string; code?: string },
  ) {
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

  @Get(':id/ancestors')
  getAncestors(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.areasService.getAncestors(req.tenant, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateArea(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.areasService.updateArea(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEADER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  deleteArea(
    @Req() req: TenantRequest,
    @Param('id') id: string,
  ) {
    return this.areasService.deleteArea(req.tenant, id);
  }
}

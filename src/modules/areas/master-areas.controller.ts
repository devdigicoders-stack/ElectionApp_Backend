import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MasterAreasService } from './master-areas.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';
import { AreaLevelType } from './master-area.schema';

@Controller('master-areas')
export class MasterAreasController {
  constructor(private readonly masterAreasService: MasterAreasService) {}

  // ─── Public / Client Cascading Selectors ───────────────────────────────────

  @Get('states')
  getStates() {
    return this.masterAreasService.getStates();
  }

  @Get('lok-sabhas')
  getLokSabhas(@Query('stateId') stateId?: string) {
    return this.masterAreasService.getLokSabhas(stateId);
  }

  @Get('districts')
  getDistricts(@Query('stateId') stateId?: string) {
    return this.masterAreasService.getDistricts(stateId);
  }

  @Get('vidhan-sabhas')
  getVidhanSabhas(
    @Query('stateId') stateId?: string,
    @Query('lokSabhaId') lokSabhaId?: string,
    @Query('districtId') districtId?: string,
  ) {
    return this.masterAreasService.getVidhanSabhas({ stateId, lokSabhaId, districtId });
  }

  @Get('blocks')
  getBlocks(
    @Query('stateId') stateId?: string,
    @Query('lokSabhaId') lokSabhaId?: string,
    @Query('districtId') districtId?: string,
    @Query('vidhanSabhaId') vidhanSabhaId?: string,
  ) {
    return this.masterAreasService.getBlocks({ stateId, lokSabhaId, districtId, vidhanSabhaId });
  }

  @Get('panchayats')
  getPanchayats(
    @Query('stateId') stateId?: string,
    @Query('vidhanSabhaId') vidhanSabhaId?: string,
    @Query('blockId') blockId?: string,
  ) {
    return this.masterAreasService.getPanchayats({ stateId, vidhanSabhaId, blockId });
  }

  @Get('grams')
  getGrams(
    @Query('panchayatId') panchayatId?: string,
    @Query('blockId') blockId?: string,
  ) {
    return this.masterAreasService.getGrams({ panchayatId, blockId });
  }

  @Get('wards')
  getWards(
    @Query('gramId') gramId?: string,
    @Query('panchayatId') panchayatId?: string,
    @Query('blockId') blockId?: string,
  ) {
    return this.masterAreasService.getWards({ gramId, panchayatId, blockId });
  }

  @Get('summary')
  getSummary() {
    return this.masterAreasService.getSummaryCounts();
  }

  @Get('tree')
  getTree(@Query('stateId') stateId?: string) {
    return this.masterAreasService.getHierarchyTree(stateId);
  }

  // ─── Super Admin Management Endpoints ─────────────────────────────────────

  @Post('seed-up')
  seedUttarPradesh() {
    return this.masterAreasService.seedUttarPradesh();
  }

  @Post('provision-tenant/:tenantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  provisionTenant(
    @Param('tenantId') tenantId: string,
    @Body()
    body: {
      stateId: string;
      scopeType: 'lok_sabha' | 'vidhan_sabha' | 'district' | 'state';
      scopeId: string;
    },
  ) {
    return this.masterAreasService.provisionTenantFromMaster(tenantId, body);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  createMasterArea(
    @Body()
    body: {
      name: string;
      code?: string;
      levelType: AreaLevelType;
      stateId?: string;
      lokSabhaId?: string;
      districtId?: string;
      vidhanSabhaId?: string;
      blockId?: string;
      panchayatId?: string;
      gramId?: string;
      parentId?: string;
      sortOrder?: number;
    },
  ) {
    return this.masterAreasService.createMasterArea(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  updateMasterArea(@Param('id') id: string, @Body() body: any) {
    return this.masterAreasService.updateMasterArea(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  deleteMasterArea(@Param('id') id: string) {
    return this.masterAreasService.deleteMasterArea(id);
  }
}

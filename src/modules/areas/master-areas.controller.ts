import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MasterAreasService } from './master-areas.service';
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

  @Get('by-parent/:parentId')
  getByParent(@Param('parentId') parentId: string) {
    return this.masterAreasService.getByParent(parentId);
  }

  // ─── Management Endpoints (Dynamic cURL & Admin) ──────────────────────────

  @Post('seed-up')
  seedUttarPradesh() {
    return this.masterAreasService.seedUttarPradesh();
  }

  @Post('bulk')
  createMasterAreaBulk(
    @Body()
    body: {
      items?: any[];
    } | any[],
  ) {
    const items = Array.isArray(body) ? body : body.items || [];
    return this.masterAreasService.createMasterAreaBulk(items);
  }

  @Post('provision-tenant/:tenantId')
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

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.masterAreasService.getById(id);
  }

  @Patch(':id')
  updateMasterArea(@Param('id') id: string, @Body() body: any) {
    return this.masterAreasService.updateMasterArea(id, body);
  }

  @Delete(':id')
  deleteMasterArea(@Param('id') id: string) {
    return this.masterAreasService.deleteMasterArea(id);
  }
}

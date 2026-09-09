import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CitizenQueryDto,
  UpdateCitizenDto,
  UpdateCitizenStatusDto,
  AddTagsDto,
  BulkTagDto,
  BulkUntagDto,
  UpgradeCategoryDto,
  AssignMembershipDto,
  AssignVolunteerDto,
} from './citizens.dto';

@Controller('citizens')
@UseGuards(JwtAuthGuard)
export class CitizensController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 1. List & Search Citizens with Multi-Filter CRM
   * GET /citizens
   */
  @Get()
  findCitizens(@Req() req: TenantRequest, @Query() query: CitizenQueryDto) {
    return this.usersService.findCitizens(req.tenant, query);
  }

  /**
   * 2. Tag Library: Get all unique CRM tags in use + suggested default tags
   * GET /citizens/tags
   */
  @Get('tags')
  getAvailableTags(@Req() req: TenantRequest) {
    return this.usersService.getAvailableTags(req.tenant);
  }

  /**
   * 3. CRM Analytics: KPIs, Demographics, Category Distribution, Top Tags
   * GET /citizens/analytics
   */
  @Get('analytics')
  getCrmAnalytics(@Req() req: TenantRequest) {
    return this.usersService.getCrmAnalytics(req.tenant);
  }

  /**
   * 4. Export Filtered Citizens as CSV Download (SRS Sec 40 & 58)
   * GET /citizens/export
   */
  @Get('export')
  exportCitizens(
    @Req() req: TenantRequest,
    @Query() query: CitizenQueryDto,
    @Res() res: Response,
  ) {
    return this.usersService.exportCitizens(req.tenant, query, res);
  }

  /**
   * 5. Bulk Tag Citizens (Assign CRM tags to multiple citizens)
   * POST /citizens/bulk-tags
   */
  @Post('bulk-tags')
  bulkAddTags(@Req() req: TenantRequest, @Body() dto: BulkTagDto) {
    return this.usersService.bulkAddTags(req.tenant, dto.userIds, dto.tags);
  }

  /**
   * 6. Bulk Untag Citizens (Remove a CRM tag from multiple citizens)
   * POST /citizens/bulk-untag
   */
  @Post('bulk-untag')
  bulkRemoveTag(@Req() req: TenantRequest, @Body() dto: BulkUntagDto) {
    return this.usersService.bulkRemoveTag(req.tenant, dto.userIds, dto.tag);
  }

  /**
   * 7. 360-Degree Citizen Profile Details (User info, area hierarchy, membership, volunteer, complaints activity)
   * GET /citizens/:id
   */
  @Get(':id')
  getCitizenDetails(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.usersService.getCitizenDetails(req.tenant, id);
  }

  /**
   * 8. Edit Citizen Permitted Information
   * PATCH /citizens/:id
   */
  @Patch(':id')
  updateCitizen(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCitizenDto,
  ) {
    return this.usersService.updateCitizen(req.tenant, id, dto);
  }

  /**
   * 9. Change Citizen Status (active / inactive / blocked)
   * PATCH /citizens/:id/status
   */
  @Patch(':id/status')
  updateCitizenStatus(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCitizenStatusDto,
  ) {
    return this.usersService.updateCitizenStatus(req.tenant, id, dto);
  }

  /**
   * 10. Add CRM Tag(s) to a Citizen
   * POST /citizens/:id/tags
   */
  @Post(':id/tags')
  addTags(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: AddTagsDto,
  ) {
    return this.usersService.addTags(req.tenant, id, dto.tags);
  }

  /**
   * 11. Remove a CRM Tag from a Citizen
   * DELETE /citizens/:id/tags/:tag
   */
  @Delete(':id/tags/:tag')
  removeTag(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Param('tag') tag: string,
  ) {
    return this.usersService.removeTag(req.tenant, id, tag);
  }

  /**
   * 12. Upgrade Citizen Public Category (citizen | supporter | member | volunteer)
   * PATCH /citizens/:id/category
   */
  @Patch(':id/category')
  upgradeCategory(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpgradeCategoryDto,
  ) {
    return this.usersService.upgradeCategory(req.tenant, id, dto);
  }

  /**
   * 13. Upgrade / Assign Membership to Citizen
   * POST /citizens/:id/membership
   */
  @Post(':id/membership')
  assignMembership(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AssignMembershipDto,
  ) {
    const adminId = req.user?.sub || req.user?._id;
    return this.usersService.assignMembership(req.tenant, id, dto, adminId);
  }

  /**
   * 14. Assign Volunteer Role to Citizen
   * POST /citizens/:id/volunteer
   */
  @Post(':id/volunteer')
  assignVolunteer(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AssignVolunteerDto,
  ) {
    const adminId = req.user?.sub || req.user?._id;
    return this.usersService.assignVolunteer(req.tenant, id, dto, adminId);
  }
}

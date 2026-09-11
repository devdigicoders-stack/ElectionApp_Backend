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
  Ip,
  Headers,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { Response } from 'express';
import { ComplaintsService } from './complaints.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard, IS_PUBLIC } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, ComplaintStatus, UserRole } from '../../shared/types';
import {
  CreateComplaintDto,
  QueryComplaintsDto,
  AssignComplaintDto,
  UpdatePriorityDto,
  AddRemarkDto,
  ResolveComplaintDto,
  CloseComplaintDto,
  RejectComplaintDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  TogglePublicComplaintDto,
  QueryPublicComplaintsDto,
} from './complaints.dto';

@Controller('complaints')
@UseGuards(JwtAuthGuard, FeatureGuard)
@RequireFeature(FeatureKey.COMPLAINTS)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  // ══════════════════════════════════════════════════════════════
  // CATEGORIES (SRS 53 complaint_categories)
  // ══════════════════════════════════════════════════════════════

  /**
   * 1. Get all available complaint categories (public/citizen/admin)
   * GET /complaints/categories
   */
  @Get('categories')
  getCategories(@Req() req: TenantRequest) {
    return this.complaintsService.getCategories(req.tenant);
  }

  /**
   * 2. Add custom complaint category (Admin)
   * POST /complaints/categories
   */
  @Post('categories')
  createCategory(@Req() req: TenantRequest, @Body() dto: CreateCategoryDto) {
    return this.complaintsService.createCategory(req.tenant, dto);
  }

  /**
   * 3. Update complaint category (Admin)
   * PATCH /complaints/categories/:catId
   */
  @Patch('categories/:catId')
  updateCategory(
    @Req() req: TenantRequest,
    @Param('catId') catId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.complaintsService.updateCategory(req.tenant, catId, dto);
  }

  /**
   * 4. Delete complaint category (Admin)
   * DELETE /complaints/categories/:catId
   */
  @Delete('categories/:catId')
  deleteCategory(@Req() req: TenantRequest, @Param('catId') catId: string) {
    return this.complaintsService.deleteCategory(req.tenant, catId);
  }

  // ══════════════════════════════════════════════════════════════
  // CITIZEN DASHBOARD & SELF-SERVICE (SRS Sec 15)
  // ══════════════════════════════════════════════════════════════

  /**
   * 5. Citizen: List own submitted complaints
   * GET /complaints/my
   */
  @Get('my')
  findMine(@Req() req: TenantRequest & { user: any }) {
    return this.complaintsService.findByUser(req.tenant, req.user.sub);
  }

  /**
   * 6. Citizen: Get my complaint status counters (SRS Sec 15 Citizen Dashboard)
   * GET /complaints/my/stats
   */
  @Get('my/stats')
  getMyStats(@Req() req: TenantRequest & { user: any }) {
    return this.complaintsService.getCitizenDashboardCounters(req.tenant, req.user.sub);
  }

  /**
   * 6b. Public Complaints Feed for Citizen PWA Community Board
   * GET /complaints/public
   */
  @Get('public')
  @SetMetadata(IS_PUBLIC, true)
  findPublic(@Req() req: TenantRequest, @Query() query: QueryPublicComplaintsDto) {
    return this.complaintsService.findPublic(req.tenant, query);
  }

  // ══════════════════════════════════════════════════════════════
  // COMPLAINT ANALYTICS (SRS Sec 17)
  // ══════════════════════════════════════════════════════════════

  /**
   * 7. Comprehensive Complaint Analytics (SRS Sec 17)
   * GET /complaints/analytics
   */
  @Get('analytics')
  getAnalytics(@Req() req: TenantRequest) {
    return this.complaintsService.getAnalytics(req.tenant);
  }

  /**
   * 8. Simple Dashboard Stats (Backward Compatible)
   * GET /complaints/stats
   */
  @Get('stats')
  getStats(@Req() req: TenantRequest) {
    return this.complaintsService.getDashboardStats(req.tenant);
  }

  // ══════════════════════════════════════════════════════════════
  // SUBMISSION & ADMIN LISTING
  // ══════════════════════════════════════════════════════════════

  /**
   * 9. Citizen: Submit a new complaint (SRS Sec 15)
   * POST /complaints
   */
  @Post()
  create(@Req() req: TenantRequest & { user: any }, @Body() dto: CreateComplaintDto) {
    return this.complaintsService.create(req.tenant, req.user.sub, dto);
  }

  /**
   * 10. Admin: List & Search Complaints with advanced filters (SRS Sec 16)
   * GET /complaints
   */
  @Get()
  findAll(@Req() req: TenantRequest, @Query() query: QueryComplaintsDto) {
    return this.complaintsService.findAll(req.tenant, query);
  }

  /**
   * 11. Admin: Export Filtered Complaints to CSV or Excel (SRS Sec 58 & 59)
   * GET /complaints/export
   */
  @Get('export')
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.AREA_COORDINATOR,
    UserRole.CONTENT_MANAGER,
  )
  exportComplaints(
    @Req() req: TenantRequest & { user: any },
    @Query() query: QueryComplaintsDto & { format?: string },
    @Res() res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.complaintsService.exportComplaints(
      req.tenant,
      query,
      res,
      query.format || 'csv',
      req.user,
      ip,
      userAgent,
    );
  }

  /**
   * 12. Single Complaint Detail (SRS Sec 15 & 16)
   * GET /complaints/:id
   */
  @Get(':id')
  findOne(@Req() req: TenantRequest & { user: any }, @Param('id') id: string) {
    return this.complaintsService.findOne(req.tenant, id, req.user);
  }

  // ══════════════════════════════════════════════════════════════
  // ADMIN WORKFLOW & DISPATCH (SRS Sec 16)
  // ══════════════════════════════════════════════════════════════

  /**
   * 12. Admin: Assign Complaint to Staff / Field Coordinator (SRS Sec 16)
   * PATCH /complaints/:id/assign
   */
  @Patch(':id/assign')
  assignComplaint(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: AssignComplaintDto,
  ) {
    return this.complaintsService.assignComplaint(req.tenant, id, dto, req.user);
  }

  /**
   * 13. Admin: Update Complaint Priority (Low, Medium, High, Urgent - SRS Sec 16)
   * PATCH /complaints/:id/priority
   */
  @Patch(':id/priority')
  updatePriority(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: UpdatePriorityDto,
  ) {
    return this.complaintsService.updatePriority(req.tenant, id, dto, req.user);
  }

  /**
   * 14. Admin: Add Internal or Public Remark (SRS Sec 16)
   * POST /complaints/:id/remarks
   */
  @Post(':id/remarks')
  addRemark(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: AddRemarkDto,
  ) {
    return this.complaintsService.addRemark(req.tenant, id, dto, req.user);
  }

  /**
   * 15. Admin: Resolve Complaint with Proof Media (SRS Sec 16)
   * PATCH /complaints/:id/resolve
   */
  @Patch(':id/resolve')
  resolveComplaint(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: ResolveComplaintDto,
  ) {
    return this.complaintsService.resolveComplaint(req.tenant, id, dto, req.user);
  }

  /**
   * 16. Admin: Close Complaint (SRS Sec 16)
   * PATCH /complaints/:id/close
   */
  @Patch(':id/close')
  closeComplaint(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: CloseComplaintDto,
  ) {
    return this.complaintsService.closeComplaint(req.tenant, id, dto, req.user);
  }

  /**
   * 17. Admin: Reject Complaint with reason (SRS Sec 15 & 16)
   * PATCH /complaints/:id/reject
   */
  @Patch(':id/reject')
  rejectComplaint(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: RejectComplaintDto,
  ) {
    return this.complaintsService.rejectComplaint(req.tenant, id, dto, req.user);
  }

  /**
   * 18. Admin: Generic status transition (Backward Compatible)
   * PATCH /complaints/:id/status
   */
  @Patch(':id/status')
  updateStatus(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() body: { status: ComplaintStatus; note?: string },
  ) {
    return this.complaintsService.updateStatus(
      req.tenant,
      id,
      body.status,
      body.note ?? '',
      req.user.sub,
    );
  }

  /**
   * 19. Admin: Toggle Public Visibility on Citizen PWA
   * PATCH /complaints/:id/public
   */
  @Patch(':id/public')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.COMPLAINT_MANAGER,
    UserRole.AREA_COORDINATOR,
  )
  @UseGuards(RolesGuard)
  togglePublic(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: TogglePublicComplaintDto,
  ) {
    return this.complaintsService.togglePublic(req.tenant, id, dto, req.user);
  }
}

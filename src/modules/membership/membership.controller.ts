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
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { MembershipService } from './membership.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, UserRole } from '../../shared/types';
import {
  ApplyMembershipDto,
  ApproveMembershipDto,
  RejectMembershipDto,
  RegenerateCardDto,
  UpdateMembershipCardDetailsDto,
  QueryMembershipDto,
  CreateMembershipPlanDto,
  UpdateMembershipPlanDto,
} from './membership.dto';

@Controller('membership')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.MEMBERSHIP)
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  // ══════════════════════════════════════════════════════════════
  // MEMBERSHIP PLANS (SRS Sec 20 & 53)
  // ══════════════════════════════════════════════════════════════

  /**
   * 1. [Public / Citizen] List active membership plans for the organization
   * GET /membership/plans
   */
  @Get('plans')
  getPublicPlans(@Req() req: TenantRequest) {
    return this.membershipService.findAllPlans(req.tenant, true);
  }

  /**
   * 2. [Admin] List all membership plans (including inactive)
   * GET /membership/plans/admin
   */
  @Get('plans/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  getAllPlansAdmin(@Req() req: TenantRequest) {
    return this.membershipService.findAllPlans(req.tenant, false);
  }

  /**
   * 3. [Public / Citizen] Get single membership plan detail
   * GET /membership/plans/:id
   */
  @Get('plans/:id')
  getPlanById(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.membershipService.findPlanById(req.tenant, id);
  }

  /**
   * 4. [Admin] Create a new membership plan
   * POST /membership/plans
   */
  @Post('plans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  createPlan(
    @Req() req: TenantRequest,
    @Body() dto: CreateMembershipPlanDto,
  ) {
    return this.membershipService.createPlan(req.tenant, dto);
  }

  /**
   * 5. [Admin] Update membership plan
   * PATCH /membership/plans/:id
   */
  @Patch('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  updatePlan(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMembershipPlanDto,
  ) {
    return this.membershipService.updatePlan(req.tenant, id, dto);
  }

  /**
   * 6. [Admin] Delete / deactivate membership plan
   * DELETE /membership/plans/:id
   */
  @Delete('plans/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  deletePlan(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.membershipService.deletePlan(req.tenant, id);
  }

  // ══════════════════════════════════════════════════════════════
  // CITIZEN MEMBERSHIP FLOW (SRS Sec 20, 21, 22)
  // ══════════════════════════════════════════════════════════════

  /**
   * 7. [Citizen] Apply for membership (Supports free plan auto-approval or paid plan)
   * POST /membership/apply
   */
  @Post('apply')
  @UseGuards(JwtAuthGuard)
  apply(@Req() req: TenantRequest & { user: any }, @Body() dto: ApplyMembershipDto) {
    return this.membershipService.apply(req.tenant, req.user.sub, dto);
  }

  /**
   * 8. [Citizen] Get my membership application & record
   * GET /membership/my
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyMembership(@Req() req: TenantRequest & { user: any }) {
    return this.membershipService.findByUser(req.tenant, req.user.sub);
  }

  /**
   * 9. [Citizen] Get my digital membership card (generates card with scannable QR & shareData)
   * GET /membership/my/card
   */
  @Get('my/card')
  @UseGuards(JwtAuthGuard)
  getMyCard(@Req() req: TenantRequest & { user: any }) {
    return this.membershipService.getMyCard(req.tenant, req.user.sub);
  }

  /**
   * 10. [Citizen] Download my digital membership card as PNG image attachment
   * GET /membership/my/card/download
   */
  @Get('my/card/download')
  @UseGuards(JwtAuthGuard)
  async downloadMyCard(
    @Req() req: TenantRequest & { user: any },
    @Res() res: Response,
  ) {
    const cardData = await this.membershipService.getMyCard(req.tenant, req.user.sub);
    if (!cardData.hasCard || !cardData.membershipNumber) {
      throw new NotFoundException(cardData.message || 'Membership card is not yet available');
    }
    const filePath = await this.membershipService.getCardFilePath(
      req.tenant,
      cardData.membershipNumber,
    );
    return res.download(filePath, `membership-card-${cardData.membershipNumber}.png`);
  }

  // ══════════════════════════════════════════════════════════════
  // PUBLIC VERIFICATION (SRS Sec 22)
  // ══════════════════════════════════════════════════════════════

  /**
   * 11. [Public] QR Code Verification Endpoint (when QR is scanned in the field)
   * GET /membership/verify/:membershipNumber
   */
  @Get('verify/:membershipNumber')
  verifyCard(
    @Req() req: TenantRequest,
    @Param('membershipNumber') membershipNumber: string,
  ) {
    return this.membershipService.verifyCard(req.tenant, membershipNumber);
  }

  // ══════════════════════════════════════════════════════════════
  // ADMIN MEMBERSHIP MANAGEMENT & EXPORT (SRS Sec 20, 22, 58)
  // ══════════════════════════════════════════════════════════════

  /**
   * 12. [Admin] Get membership statistics (by status & designation)
   * GET /membership/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  getStats(@Req() req: TenantRequest) {
    return this.membershipService.getStats(req.tenant);
  }

  /**
   * 13. [Admin] Export members list to CSV or Excel (SRS Sec 58)
   * GET /membership/export
   */
  @Get('export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  exportMembers(
    @Req() req: TenantRequest & { user?: any },
    @Query() query: QueryMembershipDto,
    @Res() res: Response,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.membershipService.exportMembers(req.tenant, query, res, req.user, ipAddress, userAgent);
  }

  /**
   * 14. [Admin] List all memberships (with search, pagination, status, and plan filter)
   * GET /membership
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  findAll(@Req() req: TenantRequest, @Query() query: QueryMembershipDto) {
    return this.membershipService.findAll(req.tenant, query);
  }

  /**
   * 15. [Admin] Get single membership application by ID
   * GET /membership/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.membershipService.findOne(req.tenant, id);
  }

  /**
   * 16. [Admin] Download any member's digital card PNG
   * GET /membership/:id/card/download
   */
  @Get(':id/card/download')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  async downloadMemberCard(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const filePath = await this.membershipService.getCardFilePath(req.tenant, id);
    const filename = path.basename(filePath);
    return res.download(filePath, filename);
  }

  /**
   * 17. [Admin] Approve membership and generate digital card with QR code
   * PATCH /membership/:id/approve
   */
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  approve(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: ApproveMembershipDto,
  ) {
    return this.membershipService.approve(req.tenant, id, req.user.sub, dto);
  }

  /**
   * 18. [Admin] Reject membership application
   * PATCH /membership/:id/reject
   */
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  reject(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: RejectMembershipDto,
  ) {
    return this.membershipService.reject(req.tenant, id, dto.reason);
  }

  /**
   * 19. [Admin] Force regenerate digital membership card
   * POST /membership/:id/regenerate-card
   */
  @Post(':id/regenerate-card')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  regenerateCard(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: RegenerateCardDto,
  ) {
    return this.membershipService.regenerateCard(req.tenant, id, dto);
  }

  /**
   * 20. [Admin] Update card details (designation, photo, validity) & auto-regenerate
   * PATCH /membership/:id/card-details
   */
  @Patch(':id/card-details')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  updateCardDetails(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMembershipCardDetailsDto,
  ) {
    return this.membershipService.updateCardDetails(req.tenant, id, dto);
  }
}

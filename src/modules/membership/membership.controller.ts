import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { MembershipService } from './membership.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey } from '../../shared/types';
import {
  ApplyMembershipDto,
  ApproveMembershipDto,
  RejectMembershipDto,
  RegenerateCardDto,
  UpdateMembershipCardDetailsDto,
  QueryMembershipDto,
} from './membership.dto';

@Controller('membership')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.MEMBERSHIP)
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  /**
   * 1. [Citizen] Apply for membership
   * POST /membership/apply
   */
  @Post('apply')
  @UseGuards(JwtAuthGuard)
  apply(@Req() req: TenantRequest & { user: any }, @Body() dto: ApplyMembershipDto) {
    return this.membershipService.apply(req.tenant, req.user.sub, dto);
  }

  /**
   * 2. [Citizen] Get my membership application & record
   * GET /membership/my
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyMembership(@Req() req: TenantRequest & { user: any }) {
    return this.membershipService.findByUser(req.tenant, req.user.sub);
  }

  /**
   * 3. [Citizen] Get my digital membership card (auto-generates if approved)
   * GET /membership/my/card
   */
  @Get('my/card')
  @UseGuards(JwtAuthGuard)
  getMyCard(@Req() req: TenantRequest & { user: any }) {
    return this.membershipService.getMyCard(req.tenant, req.user.sub);
  }

  /**
   * 4. [Citizen] Download my digital membership card as image attachment
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

  /**
   * 5. [Public] QR Code Verification Endpoint (when QR is scanned in the field)
   * GET /membership/verify/:membershipNumber
   */
  @Get('verify/:membershipNumber')
  verifyCard(
    @Req() req: TenantRequest,
    @Param('membershipNumber') membershipNumber: string,
  ) {
    return this.membershipService.verifyCard(req.tenant, membershipNumber);
  }

  /**
   * 6. [Admin] Get membership statistics
   * GET /membership/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Req() req: TenantRequest) {
    return this.membershipService.getStats(req.tenant);
  }

  /**
   * 7. [Admin] List all memberships (with search, pagination, status filter)
   * GET /membership
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: TenantRequest, @Query() query: QueryMembershipDto) {
    return this.membershipService.findAll(req.tenant, query);
  }

  /**
   * 8. [Admin] Get single membership application by ID
   * GET /membership/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.membershipService.findOne(req.tenant, id);
  }

  /**
   * 9. [Admin] Download any member's digital card PNG
   * GET /membership/:id/card/download
   */
  @Get(':id/card/download')
  @UseGuards(JwtAuthGuard)
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
   * 10. [Admin] Approve membership and generate digital card with QR code
   * PATCH /membership/:id/approve
   */
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  approve(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: ApproveMembershipDto,
  ) {
    return this.membershipService.approve(req.tenant, id, req.user.sub, dto);
  }

  /**
   * 11. [Admin] Reject membership application
   * PATCH /membership/:id/reject
   */
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  reject(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: RejectMembershipDto,
  ) {
    return this.membershipService.reject(req.tenant, id, dto.reason);
  }

  /**
   * 12. [Admin] Force regenerate digital membership card
   * POST /membership/:id/regenerate-card
   */
  @Post(':id/regenerate-card')
  @UseGuards(JwtAuthGuard)
  regenerateCard(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: RegenerateCardDto,
  ) {
    return this.membershipService.regenerateCard(req.tenant, id, dto);
  }

  /**
   * 13. [Admin] Update card details (designation, photo, validity) & auto-regenerate
   * PATCH /membership/:id/card-details
   */
  @Patch(':id/card-details')
  @UseGuards(JwtAuthGuard)
  updateCardDetails(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMembershipCardDetailsDto,
  ) {
    return this.membershipService.updateCardDetails(req.tenant, id, dto);
  }
}

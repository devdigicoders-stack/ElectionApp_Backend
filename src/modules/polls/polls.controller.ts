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
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, UserRole } from '../../shared/types';
import { CreatePollDto, UpdatePollDto, VotePollDto, QueryPollsDto } from './polls.dto';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('polls')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.POLLS)
export class PollsController {
  constructor(private pollsService: PollsService) {}

  /**
   * Helper to extract optional authenticated user from Bearer token
   */
  private extractOptionalUser(req: Request): { user?: any; isAdmin: boolean } {
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
          ];
          const isAdmin = Boolean(decoded.isSuperAdmin || adminRoles.includes(decoded.role));
          return { user: decoded, isAdmin };
        }
      } catch {
        // Ignore malformed optional token
      }
    }
    return { user: undefined, isAdmin: false };
  }

  // ══════════════════════════════════════════════════════════════
  // CITIZEN & PUBLIC ENDPOINTS
  // ══════════════════════════════════════════════════════════════

  /**
   * 1. List opinion polls (Public / Citizen / Admin)
   * Supports filtering by area, category, status, and applies result visibility rules.
   * GET /polls
   */
  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query() query: QueryPollsDto,
  ) {
    const { user, isAdmin } = this.extractOptionalUser(req);
    return this.pollsService.findAll(req.tenant, query, user, isAdmin);
  }

  /**
   * 2. Get single poll details (Public / Citizen / Admin)
   * GET /polls/:id
   */
  @Get(':id')
  findOne(
    @Req() req: TenantRequest,
    @Param('id') id: string,
  ) {
    const { user, isAdmin } = this.extractOptionalUser(req);
    return this.pollsService.findOne(req.tenant, id, user, isAdmin);
  }

  /**
   * 3. Cast a vote in an opinion poll (Citizen)
   * Validates target audience eligibility (area, age, gender, membership, volunteer status).
   * POST /polls/:id/vote
   */
  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  vote(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: VotePollDto,
  ) {
    return this.pollsService.vote(req.tenant, id, req.user.sub, dto);
  }

  /**
   * 4. Get authenticated user's vote for this poll (Citizen)
   * GET /polls/:id/my-vote
   */
  @Get(':id/my-vote')
  @UseGuards(JwtAuthGuard)
  getMyVote(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
  ) {
    return this.pollsService.getUserVote(req.tenant, id, req.user.sub);
  }

  // ══════════════════════════════════════════════════════════════
  // ADMIN POLL MANAGEMENT & ANALYTICS (SRS Sec 19 & Sec 58)
  // ══════════════════════════════════════════════════════════════

  /**
   * 5. Create a new opinion poll (Admin / Leader / Content Manager)
   * POST /polls
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  create(@Req() req: TenantRequest, @Body() dto: CreatePollDto) {
    return this.pollsService.create(req.tenant, dto);
  }

  /**
   * 6. Get comprehensive poll analytics dashboard (Admin / Leader)
   * Includes option breakdown, participation rate, area aggregation, gender distribution, age groups, & timeline.
   * GET /polls/:id/analytics
   */
  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  getAnalytics(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.pollsService.getAnalytics(req.tenant, id);
  }

  /**
   * 7. Export poll results and voter audit log to CSV (Admin / Leader)
   * GET /polls/:id/export
   */
  @Get(':id/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  exportCsv(
    @Req() req: TenantRequest & { user?: any },
    @Param('id') id: string,
    @Res() res: Response,
    @Query('format') format?: string,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.pollsService.exportPollCsv(req.tenant, id, res, format, req.user, ipAddress, userAgent);
  }

  /**
   * 8. Update poll configuration / status (Admin / Leader / Content Manager)
   * PATCH /polls/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  update(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePollDto,
  ) {
    return this.pollsService.update(req.tenant, id, dto);
  }

  /**
   * 9. Manually declare poll results immediately (Admin / Leader)
   * POST /polls/:id/declare-result or PATCH /polls/:id/declare-result
   */
  @Post(':id/declare-result')
  @Patch(':id/declare-result')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  declareResult(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.pollsService.declareResult(req.tenant, id);
  }

  /**
   * 10. Manually close poll immediately (Admin / Leader)
   * POST /polls/:id/close or PATCH /polls/:id/close
   */
  @Post(':id/close')
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  closePoll(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.pollsService.closePoll(req.tenant, id);
  }

  /**
   * 11. Delete poll and associated votes (Admin / Leader)
   * DELETE /polls/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
  )
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.pollsService.remove(req.tenant, id);
  }
}

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
import { EventsService } from './events.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, UserRole } from '../../shared/types';
import {
  CreateEventDto,
  UpdateEventDto,
  RsvpEventDto,
  CheckInEventDto,
  QueryEventsDto,
} from './events.dto';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('events')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.EVENTS)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  /**
   * Helper to extract optional user from Bearer authorization header
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
            UserRole.VOLUNTEER_MANAGER,
            UserRole.AREA_COORDINATOR,
          ];
          const isAdmin = Boolean(decoded.isSuperAdmin || adminRoles.includes(decoded.role));
          return { user: decoded, isAdmin };
        }
      } catch {
        // Ignore unparseable token
      }
    }
    return { user: undefined, isAdmin: false };
  }

  // ══════════════════════════════════════════════════════════════
  // PUBLIC & CITIZEN ENDPOINTS
  // ══════════════════════════════════════════════════════════════

  /**
   * 1. List events (Public / Citizen / Admin)
   * Supports filtering by upcoming, area, category, search, status, and pagination.
   * GET /events
   */
  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query() query: QueryEventsDto,
  ) {
    const { user, isAdmin } = this.extractOptionalUser(req);
    return this.eventsService.findAll(req.tenant, query, user, isAdmin);
  }

  /**
   * Get events that the current user is marked as 'going' to (Citizen)
   * GET /events/my-going
   * NOTE: Must be defined before @Get(':id') so 'my-going' is not treated as an event ID!
   */
  @Get('my-going')
  @UseGuards(JwtAuthGuard)
  getMyGoing(
    @Req() req: TenantRequest & { user: any },
  ) {
    return this.eventsService.getMyGoing(req.tenant, req.user.sub);
  }

  /**
   * 2. Get single event details with user's RSVP status (Public / Citizen)
   * GET /events/:id
   */
  @Get(':id')
  findOne(
    @Req() req: TenantRequest,
    @Param('id') id: string,
  ) {
    const { user } = this.extractOptionalUser(req);
    return this.eventsService.findOne(req.tenant, id, user);
  }

  /**
   * 3. Cast or update RSVP for an event (Citizen)
   * Status: 'interested', 'going', 'not_going'
   * POST /events/:id/rsvp
   */
  @Post(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  rsvp(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: RsvpEventDto,
  ) {
    return this.eventsService.rsvp(req.tenant, id, req.user.sub, dto);
  }

  /**
   * Cancel or remove RSVP for an event (Citizen)
   * DELETE /events/:id/rsvp
   */
  @Delete(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  removeRsvp(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
  ) {
    return this.eventsService.deleteRsvp(req.tenant, id, req.user.sub);
  }

  /**
   * 4. Get authenticated user's current RSVP status for an event (Citizen)
   * GET /events/:id/my-rsvp
   */
  @Get(':id/my-rsvp')
  @UseGuards(JwtAuthGuard)
  getMyRsvp(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
  ) {
    return this.eventsService.getUserRsvp(req.tenant, id, req.user.sub);
  }

  /**
   * 5. Get Digital Event Pass / Ticket with scannable QR code (Citizen / Admin)
   * GET /events/:id/ticket
   * Allows optional ?userId=... for admin/staff to view an attendee's ticket
   */
  @Get(':id/ticket')
  @UseGuards(JwtAuthGuard)
  getTicket(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Query('userId') queryUserId?: string,
  ) {
    const isAdmin = [
      UserRole.SUPER_ADMIN,
      UserRole.LEADER,
      UserRole.ADMIN,
      UserRole.VOLUNTEER_MANAGER,
    ].includes(req.user?.role);

    const targetUserId = queryUserId && isAdmin ? queryUserId : req.user.sub;
    return this.eventsService.getEventTicket(req.tenant, id, targetUserId, isAdmin);
  }

  /**
   * 6. Generate WhatsApp Social Share Link (Public / Citizen)
   * GET /events/:id/share
   */
  @Get(':id/share')
  getShareLink(
    @Req() req: TenantRequest,
    @Param('id') id: string,
  ) {
    return this.eventsService.getShareLink(req.tenant, id);
  }

  // ══════════════════════════════════════════════════════════════
  // ADMIN & STAFF EVENT MANAGEMENT (SRS Sec 18 & Sec 58)
  // ══════════════════════════════════════════════════════════════

  /**
   * 7. Create a new event (Admin / Leader / Content Manager)
   * POST /events
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
  )
  create(
    @Req() req: TenantRequest,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(req.tenant, dto);
  }

  /**
   * 8. Event Analytics Dashboard (Admin / Leader / Volunteer Manager)
   * GET /events/:id/analytics
   */
  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
    UserRole.VOLUNTEER_MANAGER,
    UserRole.AREA_COORDINATOR,
  )
  getAnalytics(
    @Req() req: TenantRequest,
    @Param('id') id: string,
  ) {
    return this.eventsService.getAnalytics(req.tenant, id);
  }

  /**
   * 9. Export Event Attendees to CSV or Excel (SRS Sec 58)
   * GET /events/:id/export & GET /events/:id/attendees/export
   */
  @Get([':id/export', ':id/attendees/export'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
    UserRole.VOLUNTEER_MANAGER,
  )
  exportCsv(
    @Req() req: TenantRequest & { user?: any },
    @Param('id') id: string,
    @Res() res: Response,
    @Query('format') format?: string,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.eventsService.exportAttendeesCsv(req.tenant, id, res, format, req.user, ipAddress, userAgent);
  }

  /**
   * 10. QR Check-in Lookup: Preview attendee before confirming check-in
   * GET /events/:id/check-in/lookup/:ticketNumber
   */
  @Get(':id/check-in/lookup/:ticketNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
    UserRole.VOLUNTEER_MANAGER,
    UserRole.AREA_COORDINATOR,
  )
  lookupTicket(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Param('ticketNumber') ticketNumber: string,
  ) {
    return this.eventsService.lookupTicket(req.tenant, id, ticketNumber);
  }

  /**
   * 11. QR Check-in Endpoint: Check in attendee on-ground (Admin / Volunteer)
   * POST /events/:id/check-in
   */
  @Post(':id/check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
    UserRole.CONTENT_MANAGER,
    UserRole.VOLUNTEER_MANAGER,
    UserRole.AREA_COORDINATOR,
  )
  checkIn(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: CheckInEventDto,
  ) {
    return this.eventsService.checkInAttendee(req.tenant, id, dto, req.user);
  }

  /**
   * 12. Update event details (Admin / Leader / Content Manager)
   * PATCH /events/:id
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
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(req.tenant, id, dto);
  }

  /**
   * 13. Delete event (Admin / Leader)
   * DELETE /events/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.LEADER,
    UserRole.ADMIN,
  )
  remove(
    @Req() req: TenantRequest,
    @Param('id') id: string,
  ) {
    return this.eventsService.remove(req.tenant, id);
  }
}

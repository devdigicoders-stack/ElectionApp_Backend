import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  Ip,
  Headers,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';
import { UsersService } from '../users/users.service';
import { MembershipService } from '../membership/membership.service';
import { ComplaintsService } from '../complaints/complaints.service';
import { EventsService } from '../events/events.service';
import { PollsService } from '../polls/polls.service';
import { VolunteersService } from '../volunteers/volunteers.service';
import { VolunteerTasksService } from '../volunteers/volunteer-tasks.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Controller('exports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
export class ExportsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly membershipService: MembershipService,
    private readonly complaintsService: ComplaintsService,
    private readonly eventsService: EventsService,
    private readonly pollsService: PollsService,
    private readonly volunteersService: VolunteersService,
    private readonly volunteerTasksService: VolunteerTasksService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  /**
   * 1. Data Export Catalog (SRS Sec 58)
   * GET /exports
   */
  @Get()
  getCatalog() {
    return {
      success: true,
      message: 'Available Data Export Domains & Documentation (SRS Sec 58)',
      supportedFormats: ['csv', 'excel'],
      domains: [
        {
          key: 'citizens',
          title: 'Citizens & Voters CRM',
          description: 'Export registered citizen directory with age, gender, area, CRM tags, membership status.',
          endpoint: '/exports/citizens',
          directEndpoint: '/citizens/export',
          supportedFilters: [
            'search',
            'areaId',
            'gender',
            'minAge',
            'maxAge',
            'tag',
            'category',
            'status',
            'membershipStatus',
            'volunteerStatus',
            'startDate',
            'endDate',
            'format',
          ],
        },
        {
          key: 'members',
          title: 'Party & Organization Members',
          description: 'Export registered members, membership plans, payment status, expiry dates, verification URLs.',
          endpoint: '/exports/members',
          directEndpoint: '/membership/export',
          supportedFilters: ['status', 'planId', 'search', 'format'],
        },
        {
          key: 'complaints',
          title: 'Public Grievance Redressal System',
          description: 'Export complaints with category, priority, status, assigned staff, resolution proofs, and SLA timestamps.',
          endpoint: '/exports/complaints',
          directEndpoint: '/complaints/export',
          supportedFilters: [
            'status',
            'priority',
            'category',
            'areaId',
            'assignedTo',
            'search',
            'startDate',
            'endDate',
            'format',
          ],
        },
        {
          key: 'events',
          title: 'Event Attendees & QR Pass Log',
          description: 'Export event attendee registrations, ticket pass numbers, check-in status, and timestamps.',
          endpoint: '/exports/events?eventId={id}',
          directEndpoint: '/events/{id}/attendees/export',
          requiredQueryParam: 'eventId',
          supportedFilters: ['format'],
        },
        {
          key: 'polls',
          title: 'Opinion Polls & Survey Analytics',
          description: 'Export opinion poll vote results, vote distribution breakdown, and anonymized voter audit trail.',
          endpoint: '/exports/polls?pollId={id}',
          directEndpoint: '/polls/{id}/export',
          requiredQueryParam: 'pollId',
          supportedFilters: ['format'],
        },
        {
          key: 'volunteers',
          title: 'Volunteer Workforce Roster',
          description: 'Export active volunteers, assigned areas, roles, task counts, and task completion percentages.',
          endpoint: '/exports/volunteers',
          directEndpoint: '/volunteers/export',
          supportedFilters: ['areaId', 'status', 'search', 'format'],
        },
        {
          key: 'volunteer-tasks',
          title: 'Volunteer Field Assignments & Proofs',
          description: 'Export volunteer assignments, priority, submission proof remarks, and admin review statuses.',
          endpoint: '/exports/volunteer-tasks',
          directEndpoint: '/volunteers/tasks/export',
          supportedFilters: [
            'status',
            'priority',
            'areaId',
            'volunteerId',
            'search',
            'startDate',
            'endDate',
            'format',
          ],
        },
      ],
    };
  }

  /**
   * 2. Audit Trail of Exports (SRS Sec 58 & 59)
   * GET /exports/history
   */
  @Get('history')
  async getExportHistory(@Req() req: TenantRequest, @Query('limit') limit?: number) {
    const history = await this.auditLogsService.findExportHistory(req.tenant?._id, limit || 50);
    return {
      success: true,
      total: history.length,
      history,
    };
  }

  /**
   * 3. Unified Direct Export Dispatcher
   * GET /exports/:domain
   */
  @Get(':domain')
  async exportDomain(
    @Req() req: TenantRequest & { user?: any },
    @Res() res: Response,
    @Param('domain') domain: string,
    @Query() query: any,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    const format = query?.format || 'csv';

    switch (domain.toLowerCase()) {
      case 'citizens':
        return this.usersService.exportCitizens(req.tenant, query, res, req.user, ipAddress, userAgent);

      case 'members':
      case 'membership':
        return this.membershipService.exportMembers(req.tenant, query, res, req.user, ipAddress, userAgent);

      case 'complaints':
        return this.complaintsService.exportComplaints(req.tenant, query, res, format, req.user, ipAddress, userAgent);

      case 'events':
        if (!query.eventId) {
          throw new BadRequestException('Query parameter "eventId" is required to export event attendees');
        }
        return this.eventsService.exportAttendeesCsv(req.tenant, query.eventId, res, format, req.user, ipAddress, userAgent);

      case 'polls':
        if (!query.pollId) {
          throw new BadRequestException('Query parameter "pollId" is required to export poll results');
        }
        return this.pollsService.exportPollCsv(req.tenant, query.pollId, res, format, req.user, ipAddress, userAgent);

      case 'volunteers':
        return this.volunteersService.exportVolunteers(req.tenant, query, res, format, req.user, ipAddress, userAgent);

      case 'volunteer-tasks':
      case 'tasks':
        return this.volunteerTasksService.exportVolunteerTasks(req.tenant, query, res, format, req.user, ipAddress, userAgent);

      default:
        throw new NotFoundException(
          `Export domain "${domain}" not found. Supported domains: citizens, members, complaints, events, polls, volunteers, volunteer-tasks.`,
        );
    }
  }
}

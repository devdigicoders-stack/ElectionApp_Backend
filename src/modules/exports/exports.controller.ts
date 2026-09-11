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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';

@Controller('exports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
export class ExportsController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
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
        {
          key: 'tenants',
          title: 'Platform Tenants & Clients Directory',
          description: 'Export all registered political clients, candidates, organizations with subscription plans, domains, and statuses.',
          endpoint: '/exports/tenants',
          supportedFilters: ['status', 'search', 'format'],
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

    // If Super Admin provided a specific tenantId, use that tenant context
    let targetTenant = req.tenant;
    if (query?.tenantId && req.user?.role === UserRole.SUPER_ADMIN) {
      const specified = await this.tenantModel.findById(query.tenantId);
      if (specified) {
        targetTenant = specified;
      }
    }

    switch (domain.toLowerCase()) {
      case 'tenants':
      case 'clients':
        return this.exportTenantsList(query, res, req.user, ipAddress, userAgent);

      case 'citizens':
        return this.usersService.exportCitizens(targetTenant, query, res, req.user, ipAddress, userAgent);

      case 'members':
      case 'membership':
        return this.membershipService.exportMembers(targetTenant, query, res, req.user, ipAddress, userAgent);

      case 'complaints':
        return this.complaintsService.exportComplaints(targetTenant, query, res, format, req.user, ipAddress, userAgent);

      case 'events':
        if (!query.eventId) {
          throw new BadRequestException('Query parameter "eventId" is required to export event attendees');
        }
        return this.eventsService.exportAttendeesCsv(targetTenant, query.eventId, res, format, req.user, ipAddress, userAgent);

      case 'polls':
        if (!query.pollId) {
          throw new BadRequestException('Query parameter "pollId" is required to export poll results');
        }
        return this.pollsService.exportPollCsv(targetTenant, query.pollId, res, format, req.user, ipAddress, userAgent);

      case 'volunteers':
        return this.volunteersService.exportVolunteers(targetTenant, query, res, format, req.user, ipAddress, userAgent);

      case 'volunteer-tasks':
      case 'tasks':
        return this.volunteerTasksService.exportVolunteerTasks(targetTenant, query, res, format, req.user, ipAddress, userAgent);

      default:
        throw new NotFoundException(
          `Export domain "${domain}" not found. Supported domains: tenants, citizens, members, complaints, events, polls, volunteers, volunteer-tasks.`,
        );
    }
  }

  private async exportTenantsList(
    query: any,
    res: Response,
    adminUser?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const filter: any = {};
    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { leaderName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { mobile: { $regex: query.search, $options: 'i' } },
      ];
    }

    const tenants = await this.tenantModel.find(filter).sort({ createdAt: -1 }).lean();

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Tenant ID',
      'Platform / Tenant Name',
      'Leader / Candidate Name',
      'Slug / Subdomain',
      'Custom Domain',
      'Election Type',
      'Contact Person',
      'Mobile Number',
      'Email Address',
      'Account Status',
      'Onboarding Completed',
      'Created Date',
    ];

    const rows = tenants.map((t: any) => [
      escapeCsv(t._id.toString()),
      escapeCsv(t.name || ''),
      escapeCsv(t.leaderName || ''),
      escapeCsv(t.slug || ''),
      escapeCsv(t.customDomain || 'None'),
      escapeCsv(t.electionType || 'N/A'),
      escapeCsv(t.contactPerson || ''),
      escapeCsv(t.mobile || ''),
      escapeCsv(t.email || ''),
      escapeCsv(t.status || 'active'),
      escapeCsv(t.isOnboardingCompleted ? 'Yes' : 'No'),
      escapeCsv(t.createdAt ? new Date(t.createdAt).toISOString() : ''),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    try {
      await this.auditLogsService.log({
        action: 'DATA_EXPORT_DOWNLOADED',
        performedBy: {
          id: adminUser?.sub || adminUser?.id || 'super_admin',
          name: adminUser?.name || 'Super Admin',
          email: adminUser?.email || 'admin@madiyayu.com',
          role: adminUser?.role || 'super_admin',
        },
        details: {
          domain: 'tenants',
          format: 'csv',
          recordCount: tenants.length,
        },
        ipAddress,
        userAgent,
      });
    } catch {}

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="tenants_directory_export_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  }
}

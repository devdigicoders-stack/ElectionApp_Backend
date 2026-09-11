"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const types_1 = require("../../shared/types");
const users_service_1 = require("../users/users.service");
const membership_service_1 = require("../membership/membership.service");
const complaints_service_1 = require("../complaints/complaints.service");
const events_service_1 = require("../events/events.service");
const polls_service_1 = require("../polls/polls.service");
const volunteers_service_1 = require("../volunteers/volunteers.service");
const volunteer_tasks_service_1 = require("../volunteers/volunteer-tasks.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let ExportsController = class ExportsController {
    constructor(usersService, membershipService, complaintsService, eventsService, pollsService, volunteersService, volunteerTasksService, auditLogsService) {
        this.usersService = usersService;
        this.membershipService = membershipService;
        this.complaintsService = complaintsService;
        this.eventsService = eventsService;
        this.pollsService = pollsService;
        this.volunteersService = volunteersService;
        this.volunteerTasksService = volunteerTasksService;
        this.auditLogsService = auditLogsService;
    }
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
    async getExportHistory(req, limit) {
        const history = await this.auditLogsService.findExportHistory(req.tenant?._id, limit || 50);
        return {
            success: true,
            total: history.length,
            history,
        };
    }
    async exportDomain(req, res, domain, query, ipAddress, userAgent) {
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
                    throw new common_1.BadRequestException('Query parameter "eventId" is required to export event attendees');
                }
                return this.eventsService.exportAttendeesCsv(req.tenant, query.eventId, res, format, req.user, ipAddress, userAgent);
            case 'polls':
                if (!query.pollId) {
                    throw new common_1.BadRequestException('Query parameter "pollId" is required to export poll results');
                }
                return this.pollsService.exportPollCsv(req.tenant, query.pollId, res, format, req.user, ipAddress, userAgent);
            case 'volunteers':
                return this.volunteersService.exportVolunteers(req.tenant, query, res, format, req.user, ipAddress, userAgent);
            case 'volunteer-tasks':
            case 'tasks':
                return this.volunteerTasksService.exportVolunteerTasks(req.tenant, query, res, format, req.user, ipAddress, userAgent);
            default:
                throw new common_1.NotFoundException(`Export domain "${domain}" not found. Supported domains: citizens, members, complaints, events, polls, volunteers, volunteer-tasks.`);
        }
    }
};
exports.ExportsController = ExportsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExportsController.prototype, "getCatalog", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExportsController.prototype, "getExportHistory", null);
__decorate([
    (0, common_1.Get)(':domain'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('domain')),
    __param(3, (0, common_1.Query)()),
    __param(4, (0, common_1.Ip)()),
    __param(5, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object, String, String]),
    __metadata("design:returntype", Promise)
], ExportsController.prototype, "exportDomain", null);
exports.ExportsController = ExportsController = __decorate([
    (0, common_1.Controller)('exports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        membership_service_1.MembershipService,
        complaints_service_1.ComplaintsService,
        events_service_1.EventsService,
        polls_service_1.PollsService,
        volunteers_service_1.VolunteersService,
        volunteer_tasks_service_1.VolunteerTasksService,
        audit_logs_service_1.AuditLogsService])
], ExportsController);
//# sourceMappingURL=exports.controller.js.map
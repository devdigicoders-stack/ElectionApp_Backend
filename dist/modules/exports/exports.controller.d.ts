import { Response } from 'express';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { UsersService } from '../users/users.service';
import { MembershipService } from '../membership/membership.service';
import { ComplaintsService } from '../complaints/complaints.service';
import { EventsService } from '../events/events.service';
import { PollsService } from '../polls/polls.service';
import { VolunteersService } from '../volunteers/volunteers.service';
import { VolunteerTasksService } from '../volunteers/volunteer-tasks.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class ExportsController {
    private readonly usersService;
    private readonly membershipService;
    private readonly complaintsService;
    private readonly eventsService;
    private readonly pollsService;
    private readonly volunteersService;
    private readonly volunteerTasksService;
    private readonly auditLogsService;
    constructor(usersService: UsersService, membershipService: MembershipService, complaintsService: ComplaintsService, eventsService: EventsService, pollsService: PollsService, volunteersService: VolunteersService, volunteerTasksService: VolunteerTasksService, auditLogsService: AuditLogsService);
    getCatalog(): {
        success: boolean;
        message: string;
        supportedFormats: string[];
        domains: ({
            key: string;
            title: string;
            description: string;
            endpoint: string;
            directEndpoint: string;
            supportedFilters: string[];
            requiredQueryParam?: undefined;
        } | {
            key: string;
            title: string;
            description: string;
            endpoint: string;
            directEndpoint: string;
            requiredQueryParam: string;
            supportedFilters: string[];
        })[];
    };
    getExportHistory(req: TenantRequest, limit?: number): Promise<{
        success: boolean;
        total: number;
        history: (import("../audit-logs/audit-log.schema").AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    exportDomain(req: TenantRequest & {
        user?: any;
    }, res: Response, domain: string, query: any, ipAddress?: string, userAgent?: string): Promise<Response<any, Record<string, any>>>;
}

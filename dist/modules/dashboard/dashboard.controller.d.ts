import { DashboardService } from './dashboard.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(req: TenantRequest): Promise<{
        stats: {
            users: number;
            complaints: {
                total: number;
                pending: number;
                resolved: number;
            };
            works: {
                total: number;
                completed: number;
            };
            events: {
                upcoming: number;
            };
            membership: {
                approved: number;
                pending: number;
            };
            volunteers: number;
        };
        recentComplaints: (import("mongoose").Document<unknown, {}, import("../complaints/complaint.schema").ComplaintDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../complaints/complaint.schema").Complaint & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        complaintTrend: any[];
    }>;
}

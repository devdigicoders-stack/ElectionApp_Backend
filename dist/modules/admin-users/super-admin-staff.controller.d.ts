import { AdminUsersService } from './admin-users.service';
import { CreateSuperAdminStaffDto, UpdateSuperAdminStaffDto, ResetStaffPasswordDto, QueryStaffDto, PlatformStaffRole } from './super-admin-staff.dto';
export declare class SuperAdminStaffController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    createStaff(dto: CreateSuperAdminStaffDto): Promise<any>;
    findAllStaff(query: QueryStaffDto): Promise<{
        items: (import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAvailableRoles(): {
        roles: PlatformStaffRole[];
        defaultPermissions: Record<PlatformStaffRole, string[]>;
    };
    findOneStaff(id: string): Promise<import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStaff(id: string, dto: UpdateSuperAdminStaffDto): Promise<import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggleStaffStatus(id: string, req: any): Promise<import("./admin-user.schema").AdminUser & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    resetStaffPassword(id: string, dto: ResetStaffPasswordDto): Promise<{
        message: string;
    }>;
    removeStaff(id: string, req: any): Promise<{
        message: string;
    }>;
}

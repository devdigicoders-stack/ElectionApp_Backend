export declare enum PlatformStaffRole {
    SUPER_ADMIN = "super_admin",
    SALES_MANAGER = "sales_manager",
    SUPPORT_EXECUTIVE = "support_executive",
    TECHNICAL_SUPPORT = "technical_support",
    FINANCE_MANAGER = "finance_manager"
}
export declare const DEFAULT_PLATFORM_PERMISSIONS: Record<PlatformStaffRole, string[]>;
export declare class CreateSuperAdminStaffDto {
    name: string;
    email: string;
    password: string;
    role: PlatformStaffRole | string;
    phone?: string;
    permissions?: string[];
}
export declare class UpdateSuperAdminStaffDto {
    name?: string;
    phone?: string;
    role?: PlatformStaffRole | string;
    permissions?: string[];
    isActive?: boolean;
}
export declare class ResetStaffPasswordDto {
    newPassword: string;
}
export declare class QueryStaffDto {
    role?: string;
    search?: string;
    isActive?: boolean | string;
    page?: number;
    limit?: number;
}

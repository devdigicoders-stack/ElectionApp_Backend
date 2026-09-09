export declare class CreateAuditLogDto {
    tenantId?: any;
    tenantName?: string;
    action: string;
    performedBy: {
        id: string;
        email: string;
        name?: string;
        role: string;
    };
    targetUser?: {
        id: string;
        email: string;
        name?: string;
    };
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
export declare class QueryAuditLogsDto {
    action?: string;
    tenantId?: string;
    search?: string;
    page?: number;
    limit?: number;
}

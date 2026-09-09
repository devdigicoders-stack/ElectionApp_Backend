import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
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

export class QueryAuditLogsDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

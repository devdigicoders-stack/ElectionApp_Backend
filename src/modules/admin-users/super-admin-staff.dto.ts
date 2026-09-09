import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray, IsBoolean } from 'class-validator';

export enum PlatformStaffRole {
  SUPER_ADMIN = 'super_admin',
  SALES_MANAGER = 'sales_manager',
  SUPPORT_EXECUTIVE = 'support_executive',
  TECHNICAL_SUPPORT = 'technical_support',
  FINANCE_MANAGER = 'finance_manager',
}

export const DEFAULT_PLATFORM_PERMISSIONS: Record<PlatformStaffRole, string[]> = {
  [PlatformStaffRole.SUPER_ADMIN]: ['*'],
  [PlatformStaffRole.SALES_MANAGER]: [
    'tenants:read',
    'tenants:create',
    'plans:read',
    'subscriptions:read',
    'usage:read',
  ],
  [PlatformStaffRole.SUPPORT_EXECUTIVE]: [
    'tenants:read',
    'tenants:impersonate',
    'audit_logs:read',
    'complaints:read',
  ],
  [PlatformStaffRole.TECHNICAL_SUPPORT]: [
    'tenants:read',
    'tenants:impersonate',
    'tenants:domain',
    'audit_logs:read',
    'system:health',
  ],
  [PlatformStaffRole.FINANCE_MANAGER]: [
    'subscriptions:read',
    'subscriptions:manage',
    'invoices:read',
    'revenue:read',
    'plans:read',
  ],
};

export class CreateSuperAdminStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  role: PlatformStaffRole | string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}

export class UpdateSuperAdminStaffDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  role?: PlatformStaffRole | string;

  @IsOptional()
  @IsArray()
  permissions?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ResetStaffPasswordDto {
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}

export class QueryStaffDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  isActive?: boolean | string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

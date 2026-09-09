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

export interface IPlatformRoleMetadata {
  key: PlatformStaffRole;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
}

export const PLATFORM_ROLES_METADATA: IPlatformRoleMetadata[] = [
  {
    key: PlatformStaffRole.SUPER_ADMIN,
    name: 'Super Admin',
    description: 'Full unrestricted platform-level control across all tenants, plans, global settings, and billing.',
    isSystem: true,
    permissions: DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.SUPER_ADMIN],
  },
  {
    key: PlatformStaffRole.SALES_MANAGER,
    name: 'Sales Manager',
    description: 'Handles prospective client onboarding, tenant creation, plans, and subscription inquiries.',
    isSystem: false,
    permissions: DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.SALES_MANAGER],
  },
  {
    key: PlatformStaffRole.SUPPORT_EXECUTIVE,
    name: 'Support Executive',
    description: 'Handles client support, complaints review, audit logs, and authorized tenant troubleshooting.',
    isSystem: false,
    permissions: DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.SUPPORT_EXECUTIVE],
  },
  {
    key: PlatformStaffRole.TECHNICAL_SUPPORT,
    name: 'Technical Support',
    description: 'Manages custom domains, SSL DNS verification, system health, and tech issues.',
    isSystem: false,
    permissions: DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.TECHNICAL_SUPPORT],
  },
  {
    key: PlatformStaffRole.FINANCE_MANAGER,
    name: 'Finance Manager',
    description: 'Oversees SaaS revenue, client subscriptions, invoices, and plan billing cycles.',
    isSystem: false,
    permissions: DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.FINANCE_MANAGER],
  },
];

export const AVAILABLE_PERMISSIONS_BY_CATEGORY = [
  {
    category: 'Tenants & Onboarding',
    permissions: [
      { key: 'tenants:read', label: 'View Tenants' },
      { key: 'tenants:create', label: 'Create New Tenants' },
      { key: 'tenants:impersonate', label: 'Tenant Support Impersonation' },
      { key: 'tenants:domain', label: 'Manage Custom Domains' },
    ],
  },
  {
    category: 'Subscriptions & Billing',
    permissions: [
      { key: 'subscriptions:read', label: 'View Client Subscriptions' },
      { key: 'subscriptions:manage', label: 'Modify & Renew Subscriptions' },
      { key: 'invoices:read', label: 'View Invoices' },
      { key: 'revenue:read', label: 'View Revenue & Financial Reports' },
      { key: 'plans:read', label: 'View Subscription Plans' },
    ],
  },
  {
    category: 'Platform & Monitoring',
    permissions: [
      { key: 'audit_logs:read', label: 'View Security Audit Trail' },
      { key: 'usage:read', label: 'View Tenant Resource Usage & Overages' },
      { key: 'system:health', label: 'System Health & Metrics' },
      { key: 'complaints:read', label: 'Read Complaints' },
    ],
  },
];

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

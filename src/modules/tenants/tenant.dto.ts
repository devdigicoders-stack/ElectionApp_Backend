import { IsString, IsOptional, IsEnum, IsObject, IsBoolean, IsDateString } from 'class-validator';
import { TenantStatus, UserRole } from '../../shared/types';

export class CreateTenantDto {
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  leaderName?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  electionType?: string;

  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @IsDateString()
  subscriptionStartDate?: string;

  @IsOptional()
  @IsDateString()
  subscriptionEndDate?: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsObject()
  branding?: Record<string, any>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  electionType?: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsObject()
  branding?: Record<string, any>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class UpdateBrandingDto {
  @IsOptional()
  @IsString()
  platformName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  leaderPhotoUrl?: string;

  @IsOptional()
  @IsString()
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  pwaIconUrl?: string;

  @IsOptional()
  @IsString()
  loginBgUrl?: string;

  @IsOptional()
  @IsString()
  splashScreenUrl?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  leaderName?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}

export class OnboardFullTenantDto extends CreateTenantDto {
  @IsOptional()
  @IsObject()
  adminUser?: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  };

  @IsOptional()
  areaLevels?: Array<{ levelOrder: number; name: string; isRequired?: boolean }>;
}

export class ImpersonateTenantDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  durationHours?: number;
}

export class ExitImpersonationDto {
  @IsOptional()
  @IsString()
  notes?: string;
}


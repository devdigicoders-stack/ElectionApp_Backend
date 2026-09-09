import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { TenantStatus } from '../../shared/types';

export class CreateTenantDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

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
  customDomain?: string;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @IsOptional()
  @IsObject()
  branding?: Record<string, any>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
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


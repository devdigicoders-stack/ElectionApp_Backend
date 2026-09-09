import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingCycle } from './plan.schema';
import { TenantStatus } from '../../shared/types';

export class PlanLimitsDto {
  @IsOptional()
  @IsNumber()
  maxCitizens?: number = -1;

  @IsOptional()
  @IsNumber()
  maxStaffUsers?: number = -1;

  @IsOptional()
  @IsNumber()
  maxPostersPerMonth?: number = -1;

  @IsOptional()
  @IsNumber()
  maxNotificationsPerMonth?: number = -1;

  @IsOptional()
  @IsNumber()
  maxStorageMB?: number = -1;
}

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle = BillingCycle.YEARLY;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number = 14;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanLimitsDto)
  limits?: PlanLimitsDto;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsNumber()
  sortOrder?: number = 0;
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanLimitsDto)
  limits?: PlanLimitsDto;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class AssignPlanDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMonths?: number; // e.g., 12 months for 1 year

  @IsOptional()
  @IsBoolean()
  isTrial?: boolean = false;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}

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
import { BillingCycle, SupportLevel, TargetSegment } from './plan.schema';
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

export class PlanOverageRatesDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  citizenPer1kRate?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  storagePerGbRate?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  smsRate?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  whatsappRate?: number = 0;
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
  @IsEnum(SupportLevel)
  supportLevel?: SupportLevel = SupportLevel.EMAIL_24H;

  @IsOptional()
  @IsEnum(TargetSegment)
  targetSegment?: TargetSegment = TargetSegment.VIDHAN_SABHA;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[] = [];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanLimitsDto)
  limits?: PlanLimitsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanOverageRatesDto)
  overageRates?: PlanOverageRatesDto;

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
  @IsEnum(SupportLevel)
  supportLevel?: SupportLevel;

  @IsOptional()
  @IsEnum(TargetSegment)
  targetSegment?: TargetSegment;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanLimitsDto)
  limits?: PlanLimitsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanOverageRatesDto)
  overageRates?: PlanOverageRatesDto;

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
  durationMonths?: number;

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

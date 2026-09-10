import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsMongoId,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus } from '../../shared/types';

export class CreateMembershipPlanDto {
  @IsString()
  @IsNotEmpty({ message: 'Plan name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Plan code is required (e.g. PRIMARY, ACTIVE, PATRON)' })
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  @IsOptional()
  price?: number = 0;

  @IsString()
  @IsOptional()
  currency?: string = 'INR';

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'validityDays must be 0 or greater (0 = lifetime)' })
  @IsOptional()
  validityDays?: number = 365;

  @IsString()
  @IsOptional()
  badgeText?: string;

  @IsString()
  @IsOptional()
  badgeColor?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 0;
}

export class UpdateMembershipPlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  validityDays?: number;

  @IsString()
  @IsOptional()
  badgeText?: string;

  @IsString()
  @IsOptional()
  badgeColor?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class ApplyMembershipDto {
  @IsMongoId({ message: 'planId must be a valid MongoDB ObjectId' })
  @IsOptional()
  planId?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsOptional()
  customData?: Record<string, any>;
}

export class ApproveMembershipDto {
  @IsString()
  @IsOptional()
  designation?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class RejectMembershipDto {
  @IsString()
  @IsNotEmpty({ message: 'Rejection reason is required' })
  reason: string;
}

export class RegenerateCardDto {
  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdateMembershipCardDetailsDto {
  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsOptional()
  customData?: Record<string, any>;
}

export class QueryMembershipDto {
  @IsEnum(MembershipStatus)
  @IsOptional()
  status?: MembershipStatus;

  @IsMongoId()
  @IsOptional()
  planId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  format?: string;
}

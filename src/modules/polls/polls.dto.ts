import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PollTargetAudience, PollResultVisibility } from '../../shared/types';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'Poll must have at least 2 options' })
  @IsString({ each: true })
  options: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  durationHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  durationDays?: number;

  @IsOptional()
  @IsDateString()
  resultDeclaredAt?: string;

  @IsOptional()
  @IsEnum(PollTargetAudience)
  targetAudience?: PollTargetAudience;

  @IsOptional()
  @IsString()
  targetAreaId?: string;

  @IsOptional()
  @IsString()
  targetGender?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(120)
  targetMinAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(120)
  targetMaxAge?: number;

  @IsOptional()
  @IsEnum(PollResultVisibility)
  resultVisibility?: PollResultVisibility;

  @IsOptional()
  @IsBoolean()
  allowRevote?: boolean;

  @IsOptional()
  @IsBoolean()
  allowMultipleChoices?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxChoices?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePollDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  durationHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  durationDays?: number;

  @IsOptional()
  @IsDateString()
  resultDeclaredAt?: string;

  @IsOptional()
  @IsEnum(PollTargetAudience)
  targetAudience?: PollTargetAudience;

  @IsOptional()
  @IsString()
  targetAreaId?: string;

  @IsOptional()
  @IsString()
  targetGender?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetMinAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetMaxAge?: number;

  @IsOptional()
  @IsEnum(PollResultVisibility)
  resultVisibility?: PollResultVisibility;

  @IsOptional()
  @IsBoolean()
  allowRevote?: boolean;

  @IsOptional()
  @IsBoolean()
  allowMultipleChoices?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxChoices?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class VotePollDto {
  @IsOptional()
  @IsString()
  optionId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[];
}

export class QueryPollsDto {
  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'upcoming' | 'ended' | 'closed' | 'all';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

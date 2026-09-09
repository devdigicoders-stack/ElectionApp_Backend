import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus } from '../../shared/types';

export class ApplyMembershipDto {
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
}

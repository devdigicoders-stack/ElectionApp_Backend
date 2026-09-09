import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComplaintStatus, ComplaintPriority } from '../../shared/types';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'areaId must be a valid 24-character hex MongoDB ObjectId' })
  areaId: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsOptional()
  @IsArray()
  mediaUrls?: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsEnum(ComplaintPriority)
  priority?: ComplaintPriority;
}

export class QueryComplaintsDto {
  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsEnum(ComplaintPriority)
  priority?: ComplaintPriority;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class AssignComplaintDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'assignedTo must be a valid 24-character hex MongoDB ObjectId' })
  assignedTo: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsEnum(ComplaintPriority)
  priority?: ComplaintPriority;
}

export class UpdatePriorityDto {
  @IsEnum(ComplaintPriority)
  @IsNotEmpty()
  priority: ComplaintPriority;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AddRemarkDto {
  @IsString()
  @IsNotEmpty()
  remark: string;

  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}

export class ResolveComplaintDto {
  @IsString()
  @IsNotEmpty()
  resolutionDetails: string;

  @IsOptional()
  @IsArray()
  resolutionProof?: string[];

  @IsOptional()
  @IsString()
  note?: string;
}

export class CloseComplaintDto {
  @IsOptional()
  @IsString()
  closingNote?: string;
}

export class RejectComplaintDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintStatus)
  @IsNotEmpty()
  status: ComplaintStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order?: number;
}

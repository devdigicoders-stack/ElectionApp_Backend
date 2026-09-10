import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsDateString,
  IsBoolean,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MembershipStatus, VolunteerStatus } from '../../shared/types';

export enum PublicUserCategory {
  CITIZEN = 'citizen',
  SUPPORTER = 'supporter',
  MEMBER = 'member',
  VOLUNTEER = 'volunteer',
}

export enum CitizenStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export const PREDEFINED_CRM_TAGS = [
  'Supporter',
  'Volunteer',
  'Youth',
  'Student',
  'Farmer',
  'Business',
  'Influencer',
  'Media',
  'Active Member',
];

export class CitizenQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // searches across name, mobile, email

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(150)
  maxAge?: number;

  @IsOptional()
  @IsString()
  ageGroup?: string; // e.g. "18-25", "26-35", "36-50", "50+"

  @IsOptional()
  @IsString()
  tag?: string; // single tag

  @IsOptional()
  @IsString()
  tags?: string; // comma-separated tags e.g. "Youth,Farmer"

  @IsOptional()
  @IsEnum(PublicUserCategory)
  category?: PublicUserCategory;

  @IsOptional()
  @IsEnum(CitizenStatus)
  status?: CitizenStatus;

  @IsOptional()
  @IsString()
  membershipStatus?: string; // "approved" | "pending" | "rejected" | "none"

  @IsOptional()
  @IsString()
  volunteerStatus?: string; // "active" | "inactive" | "none"

  @IsOptional()
  @IsDateString()
  startDate?: string; // registration start date

  @IsOptional()
  @IsDateString()
  endDate?: string; // registration end date

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  format?: string;
}

export class UpdateCitizenDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  customFields?: Record<string, any>;
}

export class UpdateCitizenStatusDto {
  @IsEnum(CitizenStatus)
  status: CitizenStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class AddTagsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];
}

export class RemoveTagDto {
  @IsString()
  tag: string;
}

export class BulkTagDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];
}

export class BulkUntagDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsString()
  tag: string;
}

export class UpgradeCategoryDto {
  @IsEnum(PublicUserCategory)
  category: PublicUserCategory;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignMembershipDto {
  @IsOptional()
  @IsEnum(MembershipStatus)
  status?: MembershipStatus = MembershipStatus.APPROVED;

  @IsOptional()
  @IsString()
  designation?: string = 'Active Member';

  @IsOptional()
  @IsString()
  membershipNumber?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  paymentInfo?: {
    amount?: number;
    transactionId?: string;
    paidAt?: Date;
  };

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignVolunteerDto {
  @IsString()
  role: string; // e.g. "Ward Coordinator", "Youth Incharge", "Campaign Volunteer"

  @IsOptional()
  @IsString()
  assignedAreaId?: string;

  @IsOptional()
  @IsEnum(VolunteerStatus)
  status?: VolunteerStatus = VolunteerStatus.ACTIVE;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tasks?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

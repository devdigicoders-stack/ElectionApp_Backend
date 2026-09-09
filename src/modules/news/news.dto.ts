import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsDateString,
  IsObject,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NewsStatus } from '../../shared/types';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  shortDescription: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];

  @IsString()
  category: string; // e.g., 'News', 'Press Release', 'Announcement', 'Article', 'Leader Message'

  @IsOptional()
  @IsObject()
  author?: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };

  @IsOptional()
  @IsDateString()
  publishDate?: string;

  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @IsOptional()
  @IsDateString()
  scheduledPublishDate?: string;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSharing?: boolean;
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  author?: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };

  @IsOptional()
  @IsDateString()
  publishDate?: string;

  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @IsOptional()
  @IsDateString()
  scheduledPublishDate?: string;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  allowSharing?: boolean;
}

export class UpdateNewsStatusDto {
  @IsEnum(NewsStatus)
  status: NewsStatus;

  @IsOptional()
  @IsDateString()
  scheduledPublishDate?: string;
}

export class QueryNewsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  areaId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: 'publishDate' | 'viewsCount' | 'createdAt' = 'publishDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

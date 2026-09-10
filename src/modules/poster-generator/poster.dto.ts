import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TemplatePositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

export class TemplateStyleDto {
  @IsOptional()
  @IsNumber()
  fontSize?: number;

  @IsOptional()
  @IsString()
  fontColor?: string;

  @IsOptional()
  @IsString()
  fontWeight?: string;

  @IsOptional()
  @IsString()
  textAlign?: string;

  @IsOptional()
  @IsIn(['circle', 'rectangle', 'rounded'])
  maskShape?: 'circle' | 'rectangle' | 'rounded';
}

export class TemplateFieldDto {
  @IsString()
  @IsNotEmpty()
  key: string; // 'photo', 'name', 'designation', 'area', 'custom_text'

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsIn(['photo', 'text'])
  type: 'photo' | 'text';

  @IsBoolean()
  editable: boolean;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsString()
  defaultValue?: string;

  @IsOptional()
  position?: TemplatePositionDto;

  @IsOptional()
  style?: TemplateStyleDto;
}

export class CreatePosterTemplateDto {
  @IsString()
  @IsNotEmpty({ message: 'Template title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Template category is required' })
  category: string; // Festival, Birthday, Political Campaign, Event Promotion, National Day, Congratulations, Support Campaign, General

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  templateImageUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  width?: number = 1080;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  height?: number = 1080;

  @IsOptional()
  @IsIn(['1080x1080', '1080x1350', '1080x1920', 'custom'])
  dimensionPreset?: string = '1080x1080';

  @IsOptional()
  @IsArray()
  fields?: TemplateFieldDto[];

  @IsOptional()
  @IsBoolean()
  includeTenantBranding?: boolean = true;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number = 0;
}

export class UpdatePosterTemplateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  templateImageUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsIn(['1080x1080', '1080x1350', '1080x1920', 'custom'])
  dimensionPreset?: string;

  @IsOptional()
  @IsArray()
  fields?: TemplateFieldDto[];

  @IsOptional()
  @IsBoolean()
  includeTenantBranding?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

export class GeneratePosterDto {
  @IsOptional()
  fieldValues?: Record<string, string> | string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  removeBg?: boolean = false;

  @IsOptional()
  @IsIn(['png', 'jpg', 'jpeg'])
  format?: 'png' | 'jpg' | 'jpeg' = 'png';

  @IsOptional()
  @IsBoolean()
  includeBranding?: boolean = true;
}

export class QueryPosterTemplatesDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  preset?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  includeExpired?: boolean = false;
}

import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  Matches,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegistrationFieldType } from './registration-form.types';

export class CreateRegistrationFieldDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Field key must contain only letters, numbers, hyphens, and underscores (e.g. areaId, voter_id, father_name)',
  })
  key: string;

  @IsString()
  @IsNotEmpty({ message: 'Field label is required' })
  label: string;

  @IsEnum(RegistrationFieldType, {
    message: `Field type must be one of: ${Object.values(RegistrationFieldType).join(', ')}`,
  })
  type: RegistrationFieldType;

  @IsBoolean()
  @IsOptional()
  required?: boolean = false;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsString()
  @IsOptional()
  placeholder?: string;

  @IsString()
  @IsOptional()
  helpText?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number = 10;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdateRegistrationFieldDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsEnum(RegistrationFieldType)
  @IsOptional()
  type?: RegistrationFieldType;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsString()
  @IsOptional()
  placeholder?: string;

  @IsString()
  @IsOptional()
  helpText?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class BulkUpdateRegistrationFieldsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRegistrationFieldDto)
  fields: CreateRegistrationFieldDto[];
}

export class CompleteCitizenProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  areaId?: string;

  @IsOptional()
  customFields?: Record<string, any>;
}

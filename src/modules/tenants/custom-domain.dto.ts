import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsIn, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class ConfigureDomainDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim().toLowerCase()
      : value,
  )
  @Matches(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
    message: 'Domain must be a valid domain or subdomain name without http/https (e.g. wncoders.com or www.wncoders.com)',
  })
  domain: string;
}

export class VerifyDomainDto {
  @IsOptional()
  @IsBoolean()
  forceVerify?: boolean;

  @IsOptional()
  @IsIn(['AUTO', 'TXT', 'CNAME'])
  method?: 'AUTO' | 'TXT' | 'CNAME';
}

export class DomainQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['all', 'unconfigured', 'pending', 'verified', 'failed'])
  status?: string;

  @IsOptional()
  page?: string | number;

  @IsOptional()
  limit?: string | number;
}

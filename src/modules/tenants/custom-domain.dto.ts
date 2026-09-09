import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsIn, Matches } from 'class-validator';

export class ConfigureDomainDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
    message: 'Domain must be a valid domain or subdomain name (e.g. rajeshsharma.in or www.rajeshsharma.in)',
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

import { IsOptional, IsString } from 'class-validator';

export class QueryUsageOverviewDto {
  @IsOptional()
  @IsString()
  status?: 'normal' | 'warning' | 'restricted';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

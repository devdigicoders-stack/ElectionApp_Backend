import { IsString, IsMobilePhone, Length, IsOptional, ValidateIf } from 'class-validator';

export class SendOtpDto {
  @IsMobilePhone('en-IN')
  mobile: string;
}

export class VerifyOtpDto {
  @IsMobilePhone('en-IN')
  mobile: string;

  @ValidateIf((o) => !o.otp)
  @IsString({ message: 'code must be a string' })
  @Length(6, 6, { message: 'code must be exactly 6 characters' })
  @IsOptional()
  code?: string;

  @ValidateIf((o) => !o.code)
  @IsString({ message: 'otp must be a string' })
  @Length(6, 6, { message: 'otp must be exactly 6 characters' })
  @IsOptional()
  otp?: string;
}

export class CompleteProfileDto {
  @IsString()
  name: string;

  customFields?: Record<string, any>;
}

export class AdminLoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

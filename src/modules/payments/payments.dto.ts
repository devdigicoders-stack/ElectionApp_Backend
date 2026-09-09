import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus, PaymentPurpose } from '../../shared/types';

export class CreatePaymentOrderDto {
  @IsNumber()
  @Min(1, { message: 'Amount must be at least ₹1.00' })
  amount: number;

  @IsOptional()
  @IsEnum(PaymentPurpose)
  purpose?: PaymentPurpose;

  @IsOptional()
  @IsMongoId({ message: 'membershipPlanId must be a valid MongoDB ObjectId' })
  membershipPlanId?: string;

  @IsOptional()
  @IsMongoId({ message: 'eventId must be a valid MongoDB ObjectId' })
  eventId?: string;

  @IsOptional()
  notes?: Record<string, any>;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}

export class QueryPaymentsDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentPurpose)
  purpose?: PaymentPurpose;

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

export class RefundPaymentDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

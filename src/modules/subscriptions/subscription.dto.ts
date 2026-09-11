import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionStatus, PaymentMethod } from './subscription.schema';
import { BillingCycle } from '../plans/plan.schema';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMonths?: number;

  @IsOptional()
  @IsBoolean()
  isTrial?: boolean = false;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.BANK_TRANSFER;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // ── GST Fields (SRS Sec 46.2) ─────────────────────────────────────────────
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number; // default 18 (%)

  @IsOptional()
  @IsBoolean()
  isInterState?: boolean; // true = IGST, false = CGST+SGST

  @IsOptional()
  @IsString()
  clientGstin?: string; // 15-digit GSTIN (optional)

  @IsOptional()
  @IsString()
  clientState?: string; // e.g. 'Maharashtra', 'Delhi'

  @IsOptional()
  @IsString()
  clientAddress?: string; // full billing address

  @IsOptional()
  @IsString()
  invoiceType?: string; // 'tax_invoice' | 'proforma' | 'credit_note'
}

export class RenewSubscriptionDto {
  @IsNumber()
  @Min(1)
  durationMonths: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.BANK_TRANSFER;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // GST fields for renewal invoice
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @IsOptional()
  @IsBoolean()
  isInterState?: boolean;

  @IsOptional()
  @IsString()
  clientGstin?: string;

  @IsOptional()
  @IsString()
  clientState?: string;

  @IsOptional()
  @IsString()
  clientAddress?: string;
}

export class UpgradePlanDto {
  @IsString()
  @IsNotEmpty()
  newPlanId: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMonths?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.BANK_TRANSFER;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ExtendTrialDto {
  @IsNumber()
  @Min(1)
  additionalDays: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsBoolean()
  immediate?: boolean = true;
}

export class PauseSubscriptionDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class QuerySubscriptionsDto {
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  planId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  expiringInDays?: number;

  @IsOptional()
  @IsString()
  search?: string;

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
}

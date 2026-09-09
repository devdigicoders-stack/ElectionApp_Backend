import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CreatePaymentOrderDto,
  VerifyPaymentDto,
  QueryPaymentsDto,
  RefundPaymentDto,
} from './payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * 1. [Public] Get Gateway Public Config (Key ID & Currency for frontend modal)
   * GET /payments/config
   */
  @Get('config')
  getPublicConfig() {
    return this.paymentsService.getPublicConfig();
  }

  /**
   * Helper for Testing / Postman: Generate valid HMAC-SHA256 signature
   * GET /payments/generate-test-signature?orderId=...&paymentId=...
   */
  @Get('generate-test-signature')
  getTestSignature(
    @Query('orderId') orderId: string,
    @Query('paymentId') paymentId: string,
  ) {
    return this.paymentsService.generateTestSignature(orderId, paymentId);
  }

  /**
   * 2. [Citizen] Create Razorpay Payment Order (Membership / Contribution)
   * POST /payments/orders
   */
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Req() req: TenantRequest & { user: any },
    @Body() dto: CreatePaymentOrderDto,
  ) {
    return this.paymentsService.createOrder(req.tenant, req.user.sub, dto);
  }

  /**
   * 3. [Citizen] Verify Payment Signature & Auto-Activate Membership/Card
   * POST /payments/verify
   */
  @Post('verify')
  @UseGuards(JwtAuthGuard)
  verifyPayment(
    @Req() req: TenantRequest & { user: any },
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(req.tenant, req.user.sub, dto);
  }

  /**
   * 4. [Webhook] Razorpay Webhook Event Listener
   * POST /payments/webhook
   */
  @Post('webhook')
  handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(body, signature);
  }

  /**
   * 5. [Citizen] List My Payments & Receipts History
   * GET /payments/my
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() req: TenantRequest & { user: any }) {
    return this.paymentsService.findByUser(req.tenant, req.user.sub);
  }

  /**
   * 6. [Admin] Comprehensive Payment & Revenue Analytics (SRS Sec 21)
   * GET /payments/analytics
   */
  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  getAnalytics(@Req() req: TenantRequest) {
    return this.paymentsService.getAnalytics(req.tenant);
  }

  /**
   * 7. [Admin] List & Search All Tenant Payments with Filters
   * GET /payments
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: TenantRequest, @Query() query: QueryPaymentsDto) {
    return this.paymentsService.findAll(req.tenant, query);
  }

  /**
   * 8. [Citizen / Admin] Get Single Payment Receipt Detail
   * GET /payments/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.paymentsService.findOne(req.tenant, id);
  }

  /**
   * 9. [Admin] Process Payment Refund via Razorpay
   * POST /payments/:id/refund
   */
  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  refund(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: RefundPaymentDto,
  ) {
    return this.paymentsService.refund(req.tenant, id, dto, req.user);
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { RazorpayGatewayService } from './razorpay.service';
import { Payment, PaymentSchema } from './payment.schema';
import { Membership, MembershipSchema } from '../membership/membership.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayGatewayService],
  exports: [PaymentsService, RazorpayGatewayService],
})
export class PaymentsModule {}

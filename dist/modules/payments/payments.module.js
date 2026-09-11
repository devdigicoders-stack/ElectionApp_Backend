"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const razorpay_service_1 = require("./razorpay.service");
const payment_schema_1 = require("./payment.schema");
const membership_schema_1 = require("../membership/membership.schema");
const membership_plan_schema_1 = require("../membership/membership-plan.schema");
const user_schema_1 = require("../users/user.schema");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: membership_schema_1.Membership.name, schema: membership_schema_1.MembershipSchema },
                { name: membership_plan_schema_1.MembershipPlan.name, schema: membership_plan_schema_1.MembershipPlanSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, razorpay_service_1.RazorpayGatewayService],
        exports: [payments_service_1.PaymentsService, razorpay_service_1.RazorpayGatewayService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map
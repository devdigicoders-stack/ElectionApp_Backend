"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const payments_dto_1 = require("./payments.dto");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    getPublicConfig() {
        return this.paymentsService.getPublicConfig();
    }
    getTestSignature(orderId, paymentId) {
        return this.paymentsService.generateTestSignature(orderId, paymentId);
    }
    createOrder(req, dto) {
        return this.paymentsService.createOrder(req.tenant, req.user.sub, dto);
    }
    verifyPayment(req, dto) {
        return this.paymentsService.verifyPayment(req.tenant, req.user.sub, dto);
    }
    handleWebhook(body, signature) {
        return this.paymentsService.handleWebhook(body, signature);
    }
    findMine(req) {
        return this.paymentsService.findByUser(req.tenant, req.user.sub);
    }
    getAnalytics(req) {
        return this.paymentsService.getAnalytics(req.tenant);
    }
    findAll(req, query) {
        return this.paymentsService.findAll(req.tenant, query);
    }
    findOne(req, id) {
        return this.paymentsService.findOne(req.tenant, id);
    }
    refund(req, id, dto) {
        return this.paymentsService.refund(req.tenant, id, dto, req.user);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPublicConfig", null);
__decorate([
    (0, common_1.Get)('generate-test-signature'),
    __param(0, (0, common_1.Query)('orderId')),
    __param(1, (0, common_1.Query)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getTestSignature", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payments_dto_1.CreatePaymentOrderDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payments_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-razorpay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payments_dto_1.QueryPaymentsDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, payments_dto_1.RefundPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "refund", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map
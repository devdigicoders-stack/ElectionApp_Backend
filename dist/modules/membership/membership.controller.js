"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const membership_service_1 = require("./membership.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
const membership_dto_1 = require("./membership.dto");
let MembershipController = class MembershipController {
    constructor(membershipService) {
        this.membershipService = membershipService;
    }
    apply(req, dto) {
        return this.membershipService.apply(req.tenant, req.user.sub, dto);
    }
    getMyMembership(req) {
        return this.membershipService.findByUser(req.tenant, req.user.sub);
    }
    getMyCard(req) {
        return this.membershipService.getMyCard(req.tenant, req.user.sub);
    }
    async downloadMyCard(req, res) {
        const cardData = await this.membershipService.getMyCard(req.tenant, req.user.sub);
        if (!cardData.hasCard || !cardData.membershipNumber) {
            throw new common_1.NotFoundException(cardData.message || 'Membership card is not yet available');
        }
        const filePath = await this.membershipService.getCardFilePath(req.tenant, cardData.membershipNumber);
        return res.download(filePath, `membership-card-${cardData.membershipNumber}.png`);
    }
    verifyCard(req, membershipNumber) {
        return this.membershipService.verifyCard(req.tenant, membershipNumber);
    }
    getStats(req) {
        return this.membershipService.getStats(req.tenant);
    }
    findAll(req, query) {
        return this.membershipService.findAll(req.tenant, query);
    }
    findOne(req, id) {
        return this.membershipService.findOne(req.tenant, id);
    }
    async downloadMemberCard(req, id, res) {
        const filePath = await this.membershipService.getCardFilePath(req.tenant, id);
        const filename = path.basename(filePath);
        return res.download(filePath, filename);
    }
    approve(req, id, dto) {
        return this.membershipService.approve(req.tenant, id, req.user.sub, dto);
    }
    reject(req, id, dto) {
        return this.membershipService.reject(req.tenant, id, dto.reason);
    }
    regenerateCard(req, id, dto) {
        return this.membershipService.regenerateCard(req.tenant, id, dto);
    }
    updateCardDetails(req, id, dto) {
        return this.membershipService.updateCardDetails(req.tenant, id, dto);
    }
};
exports.MembershipController = MembershipController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, membership_dto_1.ApplyMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "getMyMembership", null);
__decorate([
    (0, common_1.Get)('my/card'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "getMyCard", null);
__decorate([
    (0, common_1.Get)('my/card/download'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MembershipController.prototype, "downloadMyCard", null);
__decorate([
    (0, common_1.Get)('verify/:membershipNumber'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('membershipNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "verifyCard", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, membership_dto_1.QueryMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/card/download'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MembershipController.prototype, "downloadMemberCard", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, membership_dto_1.ApproveMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, membership_dto_1.RejectMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/regenerate-card'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, membership_dto_1.RegenerateCardDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "regenerateCard", null);
__decorate([
    (0, common_1.Patch)(':id/card-details'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, membership_dto_1.UpdateMembershipCardDetailsDto]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "updateCardDetails", null);
exports.MembershipController = MembershipController = __decorate([
    (0, common_1.Controller)('membership'),
    (0, common_1.UseGuards)(feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.MEMBERSHIP),
    __metadata("design:paramtypes", [membership_service_1.MembershipService])
], MembershipController);
//# sourceMappingURL=membership.controller.js.map
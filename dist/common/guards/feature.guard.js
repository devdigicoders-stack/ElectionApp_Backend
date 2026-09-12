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
exports.FeatureGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const feature_decorator_1 = require("../decorators/feature.decorator");
const tenant_feature_schema_1 = require("../../modules/features/tenant-feature.schema");
let FeatureGuard = class FeatureGuard {
    constructor(reflector, featureModel) {
        this.reflector = reflector;
        this.featureModel = featureModel;
    }
    async canActivate(context) {
        const featureKey = this.reflector.getAllAndOverride(feature_decorator_1.FEATURE_KEY, [context.getHandler(), context.getClass()]);
        if (!featureKey)
            return true;
        const request = context.switchToHttp().getRequest();
        const tenant = request.tenant;
        if (!tenant)
            return false;
        const feature = await this.featureModel.findOne({
            tenantId: tenant._id,
            featureKey,
            isEnabled: true,
        });
        if (!feature)
            throw new common_1.ForbiddenException(`Feature '${featureKey}' is not enabled for this account`);
        return true;
    }
};
exports.FeatureGuard = FeatureGuard;
exports.FeatureGuard = FeatureGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(tenant_feature_schema_1.TenantFeature.name)),
    __metadata("design:paramtypes", [core_1.Reflector,
        mongoose_2.Model])
], FeatureGuard);
//# sourceMappingURL=feature.guard.js.map
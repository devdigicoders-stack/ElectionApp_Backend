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
exports.PublicConfigService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const area_schema_1 = require("../areas/area.schema");
let PublicConfigService = class PublicConfigService {
    constructor(featureModel, areaLevelModel) {
        this.featureModel = featureModel;
        this.areaLevelModel = areaLevelModel;
    }
    async getConfig(tenant) {
        const [features, areaLevels] = await Promise.all([
            this.featureModel.find({ tenantId: tenant._id, isEnabled: true }).select('featureKey config'),
            this.areaLevelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 }).select('levelOrder name isRequired'),
        ]);
        return {
            tenant: {
                id: tenant._id,
                slug: tenant.slug,
                name: tenant.name,
                status: tenant.status,
            },
            branding: tenant.branding,
            registrationFields: tenant.settings?.registrationFields ?? [],
            enabledFeatures: features.map((f) => ({ key: f.featureKey, config: f.config })),
            areaLevels,
        };
    }
};
exports.PublicConfigService = PublicConfigService;
exports.PublicConfigService = PublicConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_feature_schema_1.TenantFeature.name)),
    __param(1, (0, mongoose_1.InjectModel)(area_schema_1.AreaLevel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PublicConfigService);
//# sourceMappingURL=public-config.service.js.map
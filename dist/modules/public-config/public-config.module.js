"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicConfigModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const public_config_service_1 = require("./public-config.service");
const public_config_controller_1 = require("./public-config.controller");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const area_schema_1 = require("../areas/area.schema");
let PublicConfigModule = class PublicConfigModule {
};
exports.PublicConfigModule = PublicConfigModule;
exports.PublicConfigModule = PublicConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
                { name: area_schema_1.AreaLevel.name, schema: area_schema_1.AreaLevelSchema },
            ]),
        ],
        controllers: [public_config_controller_1.PublicConfigController],
        providers: [public_config_service_1.PublicConfigService],
    })
], PublicConfigModule);
//# sourceMappingURL=public-config.module.js.map
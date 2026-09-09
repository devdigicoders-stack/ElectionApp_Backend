"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const manifesto_service_1 = require("./manifesto.service");
const manifesto_controller_1 = require("./manifesto.controller");
const manifesto_schema_1 = require("./manifesto.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
let ManifestoModule = class ManifestoModule {
};
exports.ManifestoModule = ManifestoModule;
exports.ManifestoModule = ManifestoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: manifesto_schema_1.Manifesto.name, schema: manifesto_schema_1.ManifestoSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
            ]),
        ],
        controllers: [manifesto_controller_1.ManifestoController],
        providers: [manifesto_service_1.ManifestoService],
    })
], ManifestoModule);
//# sourceMappingURL=manifesto.module.js.map
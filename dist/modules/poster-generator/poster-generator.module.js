"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosterGeneratorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const poster_generator_service_1 = require("./poster-generator.service");
const poster_generator_controller_1 = require("./poster-generator.controller");
const poster_template_schema_1 = require("./poster-template.schema");
const generated_poster_schema_1 = require("./generated-poster.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
let PosterGeneratorModule = class PosterGeneratorModule {
};
exports.PosterGeneratorModule = PosterGeneratorModule;
exports.PosterGeneratorModule = PosterGeneratorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: poster_template_schema_1.PosterTemplate.name, schema: poster_template_schema_1.PosterTemplateSchema },
                { name: generated_poster_schema_1.GeneratedPoster.name, schema: generated_poster_schema_1.GeneratedPosterSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
            ]),
        ],
        controllers: [poster_generator_controller_1.PosterGeneratorController],
        providers: [poster_generator_service_1.PosterGeneratorService],
    })
], PosterGeneratorModule);
//# sourceMappingURL=poster-generator.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreasModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
const areas_service_1 = require("./areas.service");
const areas_controller_1 = require("./areas.controller");
const master_areas_service_1 = require("./master-areas.service");
const master_areas_controller_1 = require("./master-areas.controller");
const area_schema_1 = require("./area.schema");
const master_area_schema_1 = require("./master-area.schema");
const tenant_schema_1 = require("../tenants/tenant.schema");
const roles_guard_1 = require("../../common/guards/roles.guard");
let AreasModule = class AreasModule {
};
exports.AreasModule = AreasModule;
exports.AreasModule = AreasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: area_schema_1.AreaLevel.name, schema: area_schema_1.AreaLevelSchema },
                { name: area_schema_1.Area.name, schema: area_schema_1.AreaSchema },
                { name: master_area_schema_1.MasterArea.name, schema: master_area_schema_1.MasterAreaSchema },
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
            ]),
        ],
        controllers: [areas_controller_1.AreasController, master_areas_controller_1.MasterAreasController],
        providers: [areas_service_1.AreasService, master_areas_service_1.MasterAreasService, roles_guard_1.RolesGuard, core_1.Reflector],
        exports: [areas_service_1.AreasService, master_areas_service_1.MasterAreasService, mongoose_1.MongooseModule],
    })
], AreasModule);
//# sourceMappingURL=areas.module.js.map
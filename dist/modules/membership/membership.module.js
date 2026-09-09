"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const membership_service_1 = require("./membership.service");
const membership_controller_1 = require("./membership.controller");
const membership_schema_1 = require("./membership.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
let MembershipModule = class MembershipModule {
};
exports.MembershipModule = MembershipModule;
exports.MembershipModule = MembershipModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: membership_schema_1.Membership.name, schema: membership_schema_1.MembershipSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: area_schema_1.Area.name, schema: area_schema_1.AreaSchema },
            ]),
        ],
        controllers: [membership_controller_1.MembershipController],
        providers: [membership_service_1.MembershipService],
        exports: [membership_service_1.MembershipService],
    })
], MembershipModule);
//# sourceMappingURL=membership.module.js.map
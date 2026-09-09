"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationFormModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const registration_form_controller_1 = require("./registration-form.controller");
const registration_form_service_1 = require("./registration-form.service");
const tenant_schema_1 = require("../tenants/tenant.schema");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
let RegistrationFormModule = class RegistrationFormModule {
};
exports.RegistrationFormModule = RegistrationFormModule;
exports.RegistrationFormModule = RegistrationFormModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: area_schema_1.AreaLevel.name, schema: area_schema_1.AreaLevelSchema },
            ]),
        ],
        controllers: [registration_form_controller_1.RegistrationFormController],
        providers: [registration_form_service_1.RegistrationFormService],
        exports: [registration_form_service_1.RegistrationFormService],
    })
], RegistrationFormModule);
//# sourceMappingURL=registration-form.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const volunteers_service_1 = require("./volunteers.service");
const volunteers_controller_1 = require("./volunteers.controller");
const volunteer_tasks_service_1 = require("./volunteer-tasks.service");
const volunteer_tasks_controller_1 = require("./volunteer-tasks.controller");
const volunteer_schema_1 = require("./volunteer.schema");
const volunteer_task_schema_1 = require("./volunteer-task.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
let VolunteersModule = class VolunteersModule {
};
exports.VolunteersModule = VolunteersModule;
exports.VolunteersModule = VolunteersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: volunteer_schema_1.Volunteer.name, schema: volunteer_schema_1.VolunteerSchema },
                { name: volunteer_task_schema_1.VolunteerTask.name, schema: volunteer_task_schema_1.VolunteerTaskSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
            ]),
        ],
        controllers: [volunteer_tasks_controller_1.VolunteerTasksController, volunteers_controller_1.VolunteersController],
        providers: [volunteers_service_1.VolunteersService, volunteer_tasks_service_1.VolunteerTasksService],
        exports: [volunteers_service_1.VolunteersService, volunteer_tasks_service_1.VolunteerTasksService],
    })
], VolunteersModule);
//# sourceMappingURL=volunteers.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsModule = void 0;
const common_1 = require("@nestjs/common");
const exports_controller_1 = require("./exports.controller");
const users_module_1 = require("../users/users.module");
const membership_module_1 = require("../membership/membership.module");
const complaints_module_1 = require("../complaints/complaints.module");
const events_module_1 = require("../events/events.module");
const polls_module_1 = require("../polls/polls.module");
const volunteers_module_1 = require("../volunteers/volunteers.module");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
let ExportsModule = class ExportsModule {
};
exports.ExportsModule = ExportsModule;
exports.ExportsModule = ExportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            membership_module_1.MembershipModule,
            complaints_module_1.ComplaintsModule,
            events_module_1.EventsModule,
            polls_module_1.PollsModule,
            volunteers_module_1.VolunteersModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [exports_controller_1.ExportsController],
        providers: [],
        exports: [],
    })
], ExportsModule);
//# sourceMappingURL=exports.module.js.map
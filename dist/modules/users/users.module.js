"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const citizens_controller_1 = require("./citizens.controller");
const user_schema_1 = require("./user.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const area_schema_1 = require("../areas/area.schema");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: membership_schema_1.Membership.name, schema: membership_schema_1.MembershipSchema },
                { name: volunteer_schema_1.Volunteer.name, schema: volunteer_schema_1.VolunteerSchema },
                { name: complaint_schema_1.Complaint.name, schema: complaint_schema_1.ComplaintSchema },
                { name: area_schema_1.Area.name, schema: area_schema_1.AreaSchema },
            ]),
        ],
        controllers: [users_controller_1.UsersController, citizens_controller_1.CitizensController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService, mongoose_1.MongooseModule],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map
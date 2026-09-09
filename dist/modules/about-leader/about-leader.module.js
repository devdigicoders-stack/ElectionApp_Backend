"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutLeaderModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const about_leader_service_1 = require("./about-leader.service");
const about_leader_controller_1 = require("./about-leader.controller");
const about_leader_schema_1 = require("./about-leader.schema");
let AboutLeaderModule = class AboutLeaderModule {
};
exports.AboutLeaderModule = AboutLeaderModule;
exports.AboutLeaderModule = AboutLeaderModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: about_leader_schema_1.AboutLeader.name, schema: about_leader_schema_1.AboutLeaderSchema }])],
        controllers: [about_leader_controller_1.AboutLeaderController],
        providers: [about_leader_service_1.AboutLeaderService],
    })
], AboutLeaderModule);
//# sourceMappingURL=about-leader.module.js.map
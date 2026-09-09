"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const polls_service_1 = require("./polls.service");
const polls_controller_1 = require("./polls.controller");
const poll_schema_1 = require("./poll.schema");
const tenant_feature_schema_1 = require("../features/tenant-feature.schema");
let PollsModule = class PollsModule {
};
exports.PollsModule = PollsModule;
exports.PollsModule = PollsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: poll_schema_1.Poll.name, schema: poll_schema_1.PollSchema },
                { name: poll_schema_1.PollVote.name, schema: poll_schema_1.PollVoteSchema },
                { name: tenant_feature_schema_1.TenantFeature.name, schema: tenant_feature_schema_1.TenantFeatureSchema },
            ]),
        ],
        controllers: [polls_controller_1.PollsController],
        providers: [polls_service_1.PollsService],
    })
], PollsModule);
//# sourceMappingURL=polls.module.js.map
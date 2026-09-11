"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutLeaderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const about_leader_schema_1 = require("./about-leader.schema");
let AboutLeaderService = class AboutLeaderService {
    constructor(aboutModel) {
        this.aboutModel = aboutModel;
    }
    async get(tenant) {
        return this.aboutModel.findOne({ tenantId: tenant._id });
    }
    async upsert(tenant, data) {
        const cleanData = { ...(data || {}) };
        delete cleanData._id;
        delete cleanData.__v;
        delete cleanData.createdAt;
        delete cleanData.updatedAt;
        delete cleanData.tenantId;
        return this.aboutModel.findOneAndUpdate({ $or: [{ tenantId: tenant._id }, { tenantId: tenant._id?.toString() }] }, { $set: { tenantId: tenant._id, ...cleanData } }, { new: true, upsert: true });
    }
};
exports.AboutLeaderService = AboutLeaderService;
exports.AboutLeaderService = AboutLeaderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(about_leader_schema_1.AboutLeader.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AboutLeaderService);
//# sourceMappingURL=about-leader.service.js.map
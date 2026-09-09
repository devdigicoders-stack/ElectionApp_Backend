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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findAll(tenant, filters) {
        const { areaId, search, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id };
        if (areaId)
            query.areaId = areaId;
        if (search)
            query.$or = [{ name: new RegExp(search, 'i') }, { mobile: new RegExp(search, 'i') }];
        const [data, total] = await Promise.all([
            this.userModel
                .find(query)
                .populate('areaId', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.userModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async findOne(tenant, id) {
        const user = await this.userModel.findOne({ _id: id, tenantId: tenant._id }).populate('areaId', 'name');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(tenant, userId, data) {
        const user = await this.userModel.findOneAndUpdate({ _id: userId, tenantId: tenant._id }, { $set: { ...data, isProfileComplete: true } }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async toggleActive(tenant, id, isActive) {
        return this.userModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { isActive }, { new: true });
    }
    async getStats(tenant) {
        const [total, active, profileComplete] = await Promise.all([
            this.userModel.countDocuments({ tenantId: tenant._id }),
            this.userModel.countDocuments({ tenantId: tenant._id, isActive: true }),
            this.userModel.countDocuments({ tenantId: tenant._id, isProfileComplete: true }),
        ]);
        return { total, active, profileComplete };
    }
    async getAreaWiseCount(tenant) {
        return this.userModel.aggregate([
            { $match: { tenantId: tenant._id } },
            { $group: { _id: '$areaId', count: { $sum: 1 } } },
            { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
            { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
            { $project: { areaName: '$area.name', count: 1 } },
            { $sort: { count: -1 } },
        ]);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map
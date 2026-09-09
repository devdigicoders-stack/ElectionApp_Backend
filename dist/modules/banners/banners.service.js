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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const banner_schema_1 = require("./banner.schema");
let BannersService = class BannersService {
    constructor(bannerModel) {
        this.bannerModel = bannerModel;
    }
    async create(tenant, data) {
        return this.bannerModel.create({ tenantId: tenant._id, ...data });
    }
    async findActive(tenant) {
        return this.bannerModel.find({ tenantId: tenant._id, isActive: true }).sort({ sortOrder: 1 });
    }
    async findAll(tenant) {
        return this.bannerModel.find({ tenantId: tenant._id }).sort({ sortOrder: 1 });
    }
    async update(tenant, id, data) {
        const banner = await this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
        if (!banner)
            throw new common_1.NotFoundException('Banner not found');
        return banner;
    }
    async remove(tenant, id) {
        return this.bannerModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
    async reorder(tenant, orders) {
        await Promise.all(orders.map(({ id, sortOrder }) => this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { sortOrder })));
        return { message: 'Reordered' };
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(banner_schema_1.Banner.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BannersService);
//# sourceMappingURL=banners.service.js.map
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
    formatBanner(banner, req, tenant) {
        if (!banner)
            return null;
        const doc = banner.toObject ? banner.toObject() : { ...banner };
        let host = req?.get ? req.get('host') : (req?.headers ? req.headers['host'] : null);
        if (!host && tenant) {
            host = tenant.customDomain || `${tenant.slug}.localhost:3001`;
        }
        const protocol = req?.protocol || 'http';
        if (doc.imageUrl) {
            if (doc.imageUrl.startsWith('/')) {
                doc.fullImageUrl = host ? `${protocol}://${host}${doc.imageUrl}` : doc.imageUrl;
            }
            else {
                doc.fullImageUrl = doc.imageUrl;
            }
        }
        if (doc.mobileImageUrl) {
            if (doc.mobileImageUrl.startsWith('/')) {
                doc.fullMobileImageUrl = host ? `${protocol}://${host}${doc.mobileImageUrl}` : doc.mobileImageUrl;
            }
            else {
                doc.fullMobileImageUrl = doc.mobileImageUrl;
            }
        }
        return doc;
    }
    async create(tenant, data, req) {
        if (!data.title) {
            throw new common_1.BadRequestException('Banner title is required');
        }
        if (!data.imageUrl) {
            throw new common_1.BadRequestException('Banner image is required (upload image via form-data or provide imageUrl)');
        }
        const banner = await this.bannerModel.create({
            tenantId: tenant._id,
            ...data,
        });
        return this.formatBanner(banner, req, tenant);
    }
    async findActive(tenant, req) {
        const banners = await this.bannerModel.find({ tenantId: tenant._id, isActive: true }).sort({ sortOrder: 1 });
        return banners.map((b) => this.formatBanner(b, req, tenant));
    }
    async findAll(tenant, req) {
        const banners = await this.bannerModel.find({ tenantId: tenant._id }).sort({ sortOrder: 1 });
        return banners.map((b) => this.formatBanner(b, req, tenant));
    }
    async findOne(tenant, id, req) {
        const banner = await this.bannerModel.findOne({ _id: id, tenantId: tenant._id });
        if (!banner)
            throw new common_1.NotFoundException('Banner not found');
        return this.formatBanner(banner, req, tenant);
    }
    async update(tenant, id, data, req) {
        const banner = await this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
        if (!banner)
            throw new common_1.NotFoundException('Banner not found');
        return this.formatBanner(banner, req, tenant);
    }
    async remove(tenant, id) {
        const banner = await this.bannerModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
        if (!banner)
            throw new common_1.NotFoundException('Banner not found');
        return { success: true, message: 'Banner deleted successfully' };
    }
    async reorder(tenant, orders) {
        await Promise.all((orders || []).map(({ id, sortOrder }) => this.bannerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { sortOrder })));
        return { message: 'Reordered successfully' };
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(banner_schema_1.Banner.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BannersService);
//# sourceMappingURL=banners.service.js.map
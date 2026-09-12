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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const gallery_schema_1 = require("./gallery.schema");
let GalleryService = class GalleryService {
    constructor(galleryModel) {
        this.galleryModel = galleryModel;
    }
    async create(tenant, data) {
        return this.galleryModel.create({ tenantId: tenant._id, ...data });
    }
    async findAll(tenant, filters) {
        const { type, category, tag, search, all, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id };
        if (!all)
            query.isPublished = true;
        if (type)
            query.type = type;
        if (category)
            query.category = category;
        if (tag)
            query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.galleryModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async findOne(tenant, id) {
        let item = null;
        const tenantCondition = {
            $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
        };
        if (mongoose_2.Types.ObjectId.isValid(id)) {
            item = await this.galleryModel.findOne({
                _id: new mongoose_2.Types.ObjectId(id),
                ...tenantCondition,
            });
        }
        if (!item) {
            item = await this.galleryModel.findOne({
                _id: id,
                ...tenantCondition,
            });
        }
        if (!item && mongoose_2.Types.ObjectId.isValid(id)) {
            const candidate = await this.galleryModel.findById(id);
            if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
                item = candidate;
            }
        }
        if (!item)
            throw new common_1.NotFoundException('Gallery item not found');
        return item;
    }
    async update(tenant, id, data) {
        const tenantCondition = {
            $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
        };
        const idFilter = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        let item = await this.galleryModel.findOneAndUpdate({ _id: idFilter, ...tenantCondition }, { $set: data }, { new: true });
        if (!item && mongoose_2.Types.ObjectId.isValid(id)) {
            const candidate = await this.galleryModel.findById(id);
            if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
                item = await this.galleryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
            }
        }
        if (!item)
            throw new common_1.NotFoundException('Gallery item not found');
        return item;
    }
    async remove(tenant, id) {
        const tenantCondition = {
            $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
        };
        const idFilter = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        let item = await this.galleryModel.findOneAndDelete({ _id: idFilter, ...tenantCondition });
        if (!item && mongoose_2.Types.ObjectId.isValid(id)) {
            const candidate = await this.galleryModel.findById(id);
            if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
                item = await this.galleryModel.findByIdAndDelete(id);
            }
        }
        if (!item)
            throw new common_1.NotFoundException('Gallery item not found');
        return item;
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(gallery_schema_1.GalleryItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map
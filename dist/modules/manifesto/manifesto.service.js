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
exports.ManifestoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const manifesto_schema_1 = require("./manifesto.schema");
let ManifestoService = class ManifestoService {
    constructor(manifestoModel) {
        this.manifestoModel = manifestoModel;
    }
    getManifestoFilter(tenant, id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant?._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant?._id;
        return {
            _id: objectId,
            $or: [
                { tenantId: tenantObjectId },
                { tenantId: tenant?._id?.toString() },
                { tenantId: tenant?._id },
            ],
        };
    }
    async create(tenant, data) {
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant?._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant?._id;
        return this.manifestoModel.create({ tenantId: tenantObjectId, ...data });
    }
    async findAll(tenant, category, includeUnpublished = false) {
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant?._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant?._id;
        const query = {
            $or: [
                { tenantId: tenantObjectId },
                { tenantId: tenant?._id?.toString() },
                { tenantId: tenant?._id },
            ],
        };
        if (!includeUnpublished) {
            query.isPublished = true;
        }
        if (category)
            query.category = category;
        return this.manifestoModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
    }
    async getCategories(tenant) {
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant?._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant?._id;
        return this.manifestoModel.distinct('category', {
            $or: [
                { tenantId: tenantObjectId },
                { tenantId: tenant?._id?.toString() },
                { tenantId: tenant?._id },
            ],
            isPublished: true,
        });
    }
    async findOne(tenant, id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        let item = await this.manifestoModel.findOne(this.getManifestoFilter(tenant, id));
        if (!item && mongoose_2.Types.ObjectId.isValid(id)) {
            const candidate = await this.manifestoModel.findById(objectId);
            if (candidate &&
                (candidate.tenantId?.toString() === tenant?._id?.toString() || !candidate.tenantId)) {
                item = candidate;
            }
        }
        if (!item)
            throw new common_1.NotFoundException('Manifesto item not found');
        return item;
    }
    async update(tenant, id, data) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        let item = await this.manifestoModel.findOneAndUpdate(this.getManifestoFilter(tenant, id), { $set: data }, { new: true });
        if (!item && mongoose_2.Types.ObjectId.isValid(id)) {
            const candidate = await this.manifestoModel.findById(objectId);
            if (candidate &&
                (candidate.tenantId?.toString() === tenant?._id?.toString() || !candidate.tenantId)) {
                item = await this.manifestoModel.findByIdAndUpdate(objectId, { $set: data }, { new: true });
            }
        }
        if (!item)
            throw new common_1.NotFoundException('Manifesto item not found');
        return item;
    }
    async remove(tenant, id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        let item = await this.manifestoModel.findOneAndDelete(this.getManifestoFilter(tenant, id));
        if (!item && mongoose_2.Types.ObjectId.isValid(id)) {
            const candidate = await this.manifestoModel.findById(objectId);
            if (candidate &&
                (candidate.tenantId?.toString() === tenant?._id?.toString() || !candidate.tenantId)) {
                item = await this.manifestoModel.findByIdAndDelete(objectId);
            }
        }
        if (!item)
            throw new common_1.NotFoundException('Manifesto item not found');
        return { success: true, message: 'Manifesto item deleted successfully' };
    }
};
exports.ManifestoService = ManifestoService;
exports.ManifestoService = ManifestoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(manifesto_schema_1.Manifesto.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ManifestoService);
//# sourceMappingURL=manifesto.service.js.map
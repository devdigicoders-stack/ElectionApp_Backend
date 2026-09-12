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
exports.AreasService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const area_schema_1 = require("./area.schema");
let AreasService = class AreasService {
    constructor(levelModel, areaModel) {
        this.levelModel = levelModel;
        this.areaModel = areaModel;
    }
    async createLevel(tenant, data) {
        const levelOrder = Number(data.levelOrder ?? data.rank ?? 1);
        return this.levelModel.create({
            tenantId: tenant._id,
            name: data.name.trim(),
            levelOrder,
            isRequired: data.isRequired !== false,
        });
    }
    async getLevels(tenant) {
        return this.levelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 });
    }
    async updateLevel(tenant, levelId, data) {
        return this.levelModel.findOneAndUpdate({ _id: levelId, tenantId: tenant._id }, { $set: data }, { new: true });
    }
    async deleteLevel(tenant, levelId) {
        const usageCount = await this.areaModel.countDocuments({
            tenantId: tenant._id,
            levelId: new mongoose_2.Types.ObjectId(levelId),
        });
        if (usageCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete level — ${usageCount} area(s) are using it. Delete those areas first.`);
        }
        return this.levelModel.findOneAndDelete({ _id: levelId, tenantId: tenant._id });
    }
    async createArea(tenant, data) {
        const payload = {
            tenantId: tenant._id,
            name: data.name.trim(),
            levelId: mongoose_2.Types.ObjectId.isValid(data.levelId) ? new mongoose_2.Types.ObjectId(data.levelId) : data.levelId,
        };
        if (data.parentId && typeof data.parentId === 'string' && data.parentId.trim().length > 0) {
            payload.parentId = mongoose_2.Types.ObjectId.isValid(data.parentId) ? new mongoose_2.Types.ObjectId(data.parentId) : data.parentId;
        }
        else {
            payload.parentId = null;
        }
        if (data.code && data.code.trim()) {
            payload.code = data.code.trim();
        }
        return this.areaModel.create(payload);
    }
    async updateArea(tenant, id, data) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const cleanData = {};
        if (data.name !== undefined)
            cleanData.name = data.name.trim();
        if (data.code !== undefined)
            cleanData.code = data.code ? data.code.trim() : null;
        if (data.isActive !== undefined)
            cleanData.isActive = Boolean(data.isActive);
        if (data.levelId) {
            cleanData.levelId = mongoose_2.Types.ObjectId.isValid(data.levelId) ? new mongoose_2.Types.ObjectId(data.levelId) : data.levelId;
        }
        if (data.parentId !== undefined) {
            if (data.parentId && typeof data.parentId === 'string' && data.parentId.trim().length > 0) {
                cleanData.parentId = mongoose_2.Types.ObjectId.isValid(data.parentId) ? new mongoose_2.Types.ObjectId(data.parentId) : data.parentId;
            }
            else {
                cleanData.parentId = null;
            }
        }
        const area = await this.areaModel.findOneAndUpdate({
            _id: objectId,
            $or: [{ tenantId: tenant._id }, { tenantId: tenant._id?.toString() }],
        }, { $set: cleanData }, { new: true });
        if (!area)
            throw new common_1.NotFoundException('Area not found');
        return area;
    }
    async deleteArea(tenant, id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const childCount = await this.areaModel.countDocuments({
            tenantId: tenant._id,
            parentId: objectId,
            isActive: true,
        });
        if (childCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete this area because it has ${childCount} sub-area(s). Delete or move sub-areas first.`);
        }
        const area = await this.areaModel.findOneAndDelete({
            _id: objectId,
            $or: [{ tenantId: tenant._id }, { tenantId: tenant._id?.toString() }],
        });
        if (!area)
            throw new common_1.NotFoundException('Area not found');
        return { success: true, message: 'Area deleted successfully' };
    }
    async getAreasByLevel(tenant, levelId) {
        return this.areaModel.find({ tenantId: tenant._id, levelId, isActive: true }).sort({ name: 1 });
    }
    async getChildren(tenant, parentId) {
        return this.areaModel
            .find({ tenantId: tenant._id, parentId: new mongoose_2.Types.ObjectId(parentId), isActive: true })
            .populate('levelId', 'name levelOrder')
            .sort({ name: 1 });
    }
    async getTree(tenant) {
        const levels = await this.levelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 });
        const areas = await this.areaModel
            .find({ tenantId: tenant._id, isActive: true })
            .populate('levelId', 'name levelOrder')
            .lean();
        const map = new Map();
        areas.forEach((a) => map.set(a._id.toString(), { ...a, children: [] }));
        const roots = [];
        areas.forEach((a) => {
            if (a.parentId) {
                const parent = map.get(a.parentId.toString());
                if (parent)
                    parent.children.push(map.get(a._id.toString()));
            }
            else {
                roots.push(map.get(a._id.toString()));
            }
        });
        return { levels, tree: roots };
    }
    async findById(tenant, areaId) {
        const area = await this.areaModel.findOne({ _id: areaId, tenantId: tenant._id }).populate('levelId');
        if (!area)
            throw new common_1.NotFoundException('Area not found');
        return area;
    }
    async getAncestors(tenant, areaId) {
        const ancestors = [];
        let currentId = areaId;
        while (currentId) {
            const area = await this.areaModel
                .findOne({ _id: currentId, tenantId: tenant._id })
                .populate('levelId', 'name levelOrder')
                .lean();
            if (!area)
                break;
            ancestors.unshift(area);
            currentId = area.parentId ? area.parentId.toString() : null;
        }
        return ancestors;
    }
};
exports.AreasService = AreasService;
exports.AreasService = AreasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(area_schema_1.AreaLevel.name)),
    __param(1, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AreasService);
//# sourceMappingURL=areas.service.js.map
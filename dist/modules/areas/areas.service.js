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
        return this.levelModel.create({ tenantId: tenant._id, ...data });
    }
    async getLevels(tenant) {
        return this.levelModel.find({ tenantId: tenant._id }).sort({ levelOrder: 1 });
    }
    async updateLevel(tenant, levelId, data) {
        return this.levelModel.findOneAndUpdate({ _id: levelId, tenantId: tenant._id }, { $set: data }, { new: true });
    }
    async deleteLevel(tenant, levelId) {
        return this.levelModel.findOneAndDelete({ _id: levelId, tenantId: tenant._id });
    }
    async createArea(tenant, data) {
        return this.areaModel.create({ tenantId: tenant._id, ...data });
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
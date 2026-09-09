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
exports.WorksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const work_schema_1 = require("./work.schema");
let WorksService = class WorksService {
    constructor(workModel) {
        this.workModel = workModel;
    }
    async create(tenant, data) {
        return this.workModel.create({ tenantId: tenant._id, ...data });
    }
    async findAll(tenant, filters) {
        const { status, areaId, category, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id, isPublished: true };
        if (status)
            query.status = status;
        if (areaId)
            query.areaId = areaId;
        if (category)
            query.category = category;
        const [data, total] = await Promise.all([
            this.workModel.find(query).populate('areaId', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            this.workModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async findOne(tenant, id) {
        const work = await this.workModel.findOne({ _id: id, tenantId: tenant._id }).populate('areaId', 'name');
        if (!work)
            throw new common_1.NotFoundException('Work not found');
        return work;
    }
    async update(tenant, id, data) {
        const work = await this.workModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
        if (!work)
            throw new common_1.NotFoundException('Work not found');
        return work;
    }
    async remove(tenant, id) {
        return this.workModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
    async getStatsByStatus(tenant) {
        return this.workModel.aggregate([
            { $match: { tenantId: tenant._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
    }
};
exports.WorksService = WorksService;
exports.WorksService = WorksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(work_schema_1.Work.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WorksService);
//# sourceMappingURL=works.service.js.map
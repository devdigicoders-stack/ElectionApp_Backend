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
exports.ComplaintsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const complaint_schema_1 = require("./complaint.schema");
const types_1 = require("../../shared/types");
let ComplaintsService = class ComplaintsService {
    constructor(complaintModel) {
        this.complaintModel = complaintModel;
    }
    async generateNumber(tenantId) {
        const count = await this.complaintModel.countDocuments({ tenantId });
        const year = new Date().getFullYear();
        return `CMP-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    async create(tenant, userId, data) {
        const complaintNumber = await this.generateNumber(tenant._id);
        return this.complaintModel.create({
            tenantId: tenant._id,
            userId,
            complaintNumber,
            ...data,
            timeline: [{ status: types_1.ComplaintStatus.SUBMITTED, updatedAt: new Date() }],
        });
    }
    async findAll(tenant, filters) {
        const { status, areaId, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id };
        if (status)
            query.status = status;
        if (areaId)
            query.areaId = areaId;
        const [data, total] = await Promise.all([
            this.complaintModel
                .find(query)
                .populate('userId', 'name mobile')
                .populate('areaId', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.complaintModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async findByUser(tenant, userId) {
        return this.complaintModel
            .find({ tenantId: tenant._id, userId })
            .populate('areaId', 'name')
            .sort({ createdAt: -1 });
    }
    async findOne(tenant, id) {
        const complaint = await this.complaintModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate('userId', 'name mobile')
            .populate('areaId', 'name')
            .populate('assignedTo', 'name');
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        return complaint;
    }
    async updateStatus(tenant, id, status, note, updatedBy) {
        const complaint = await this.complaintModel.findOne({ _id: id, tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        complaint.status = status;
        complaint.timeline.push({ status, note, updatedBy: updatedBy, updatedAt: new Date() });
        return complaint.save();
    }
    async getDashboardStats(tenant) {
        const stats = await this.complaintModel.aggregate([
            { $match: { tenantId: tenant._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), { total: 0 });
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(complaint_schema_1.Complaint.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map
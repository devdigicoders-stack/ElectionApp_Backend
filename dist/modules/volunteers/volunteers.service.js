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
exports.VolunteersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const volunteer_schema_1 = require("./volunteer.schema");
const types_1 = require("../../shared/types");
let VolunteersService = class VolunteersService {
    constructor(volunteerModel) {
        this.volunteerModel = volunteerModel;
    }
    async add(tenant, data, callerUserId) {
        const targetUserId = data.userId || callerUserId;
        if (!targetUserId) {
            throw new common_1.BadRequestException('userId is required to register as volunteer');
        }
        const assignedAreaId = data.assignedAreaId || data.areaId || undefined;
        const existing = await this.volunteerModel.findOne({
            tenantId: tenant._id,
            userId: new mongoose_2.Types.ObjectId(targetUserId),
        });
        if (existing) {
            throw new common_1.ConflictException('User is already registered as a volunteer');
        }
        const volunteer = await this.volunteerModel.create({
            tenantId: tenant._id,
            userId: new mongoose_2.Types.ObjectId(targetUserId),
            role: data.role || 'Volunteer',
            assignedAreaId: assignedAreaId ? new mongoose_2.Types.ObjectId(assignedAreaId) : undefined,
            status: types_1.VolunteerStatus.ACTIVE,
            tasks: data.tasks || [],
            assignedBy: callerUserId ? new mongoose_2.Types.ObjectId(callerUserId) : undefined,
            notes: data.notes || undefined,
        });
        return volunteer;
    }
    async findAll(tenant, filters) {
        const { areaId, status, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id };
        if (areaId)
            query.assignedAreaId = areaId;
        if (status)
            query.status = status;
        const [data, total] = await Promise.all([
            this.volunteerModel
                .find(query)
                .populate('userId', 'name mobile')
                .populate('assignedAreaId', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.volunteerModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async findByUser(tenant, userId) {
        return this.volunteerModel
            .findOne({ tenantId: tenant._id, userId })
            .populate('assignedAreaId', 'name');
    }
    async update(tenant, id, data) {
        const volunteer = await this.volunteerModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
        if (!volunteer)
            throw new common_1.NotFoundException('Volunteer not found');
        return volunteer;
    }
    async remove(tenant, id) {
        return this.volunteerModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
};
exports.VolunteersService = VolunteersService;
exports.VolunteersService = VolunteersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VolunteersService);
//# sourceMappingURL=volunteers.service.js.map
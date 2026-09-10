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
const volunteer_task_schema_1 = require("./volunteer-task.schema");
const types_1 = require("../../shared/types");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let VolunteersService = class VolunteersService {
    constructor(volunteerModel, taskModel, auditLogsService) {
        this.volunteerModel = volunteerModel;
        this.taskModel = taskModel;
        this.auditLogsService = auditLogsService;
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
    async exportVolunteers(tenant, query, res, format = 'csv', adminUser, ipAddress, userAgent) {
        const filter = { tenantId: tenant._id };
        if (query.status)
            filter.status = query.status;
        if (query.areaId && mongoose_2.Types.ObjectId.isValid(query.areaId)) {
            filter.assignedAreaId = new mongoose_2.Types.ObjectId(query.areaId);
        }
        if (query.role) {
            filter.role = { $regex: query.role.trim(), $options: 'i' };
        }
        const volunteers = await this.volunteerModel
            .find(filter)
            .populate('userId', 'name mobile email gender dob')
            .populate('assignedAreaId', 'name type')
            .sort({ createdAt: -1 })
            .lean();
        const volunteerIds = volunteers.map((v) => v._id);
        const taskStats = await this.taskModel.aggregate([
            { $match: { tenantId: tenant._id, assignedVolunteerId: { $in: volunteerIds } } },
            {
                $group: {
                    _id: '$assignedVolunteerId',
                    total: { $sum: 1 },
                    completed: { $sum: { $cond: [{ $eq: ['$status', types_1.VolunteerTaskStatus.COMPLETED] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ['$status', types_1.VolunteerTaskStatus.PENDING] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', types_1.VolunteerTaskStatus.IN_PROGRESS] }, 1, 0] } },
                },
            },
        ]);
        const taskStatsMap = new Map();
        taskStats.forEach((t) => taskStatsMap.set(t._id.toString(), t));
        const escapeCsv = (val) => {
            if (val === null || val === undefined)
                return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        };
        const maskMobile = (mobile) => {
            if (!mobile || mobile.length < 5)
                return 'N/A';
            return mobile.slice(0, 2) + '****' + mobile.slice(-4);
        };
        const headers = [
            'Volunteer ID',
            'Name',
            'Mobile',
            'Email',
            'Gender',
            'Role / Designation',
            'Assigned Area',
            'Status',
            'Total Tasks Assigned',
            'Completed Tasks',
            'Pending Tasks',
            'Completion Rate (%)',
            'Registered Date',
        ];
        const rows = volunteers.map((v) => {
            const u = v.userId || {};
            const area = v.assignedAreaId || {};
            const stats = taskStatsMap.get(v._id.toString()) || { total: 0, completed: 0, pending: 0 };
            const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            return [
                escapeCsv(v._id.toString()),
                escapeCsv(u.name || 'Volunteer'),
                escapeCsv(maskMobile(u.mobile)),
                escapeCsv(u.email || ''),
                escapeCsv(u.gender || ''),
                escapeCsv(v.role || 'Volunteer'),
                escapeCsv(area.name ? `${area.name} (${area.type || 'Area'})` : 'Constituency'),
                escapeCsv(v.status || 'active'),
                escapeCsv(stats.total),
                escapeCsv(stats.completed),
                escapeCsv(stats.pending),
                escapeCsv(`${rate}%`),
                escapeCsv(v.createdAt ? new Date(v.createdAt).toISOString() : ''),
            ].join(',');
        });
        const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
        const bom = '\uFEFF';
        const csvContent = bom + [headers.join(','), ...rows].join('\r\n');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `volunteers-${tenant.slug || 'export'}-${timestamp}.csv`;
        const contentType = isExcel
            ? 'application/vnd.ms-excel; charset=utf-8'
            : 'text/csv; charset=utf-8';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        if (this.auditLogsService && adminUser) {
            await this.auditLogsService
                .log({
                tenantId: tenant._id,
                tenantName: tenant.name,
                action: 'DATA_EXPORT_VOLUNTEERS',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    format: isExcel ? 'excel' : 'csv',
                    recordCount: volunteers.length,
                    filename,
                },
                ipAddress,
                userAgent,
            })
                .catch(() => { });
        }
        return res.status(200).send(csvContent);
    }
};
exports.VolunteersService = VolunteersService;
exports.VolunteersService = VolunteersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(1, (0, mongoose_1.InjectModel)(volunteer_task_schema_1.VolunteerTask.name)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], VolunteersService);
//# sourceMappingURL=volunteers.service.js.map
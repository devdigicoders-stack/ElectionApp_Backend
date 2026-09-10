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
exports.VolunteerTasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const volunteer_task_schema_1 = require("./volunteer-task.schema");
const volunteer_schema_1 = require("./volunteer.schema");
const types_1 = require("../../shared/types");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let VolunteerTasksService = class VolunteerTasksService {
    constructor(taskModel, volunteerModel, auditLogsService) {
        this.taskModel = taskModel;
        this.volunteerModel = volunteerModel;
        this.auditLogsService = auditLogsService;
    }
    async create(tenant, dto, adminUser) {
        let assignedVolunteerId = undefined;
        let assignedUserId = undefined;
        if (dto.assignedVolunteerId) {
            if (!mongoose_2.Types.ObjectId.isValid(dto.assignedVolunteerId)) {
                throw new common_1.BadRequestException('Invalid assignedVolunteerId format');
            }
            let volunteer = await this.volunteerModel.findOne({
                _id: new mongoose_2.Types.ObjectId(dto.assignedVolunteerId),
                tenantId: tenant._id,
            });
            if (!volunteer) {
                volunteer = await this.volunteerModel.findOne({
                    userId: new mongoose_2.Types.ObjectId(dto.assignedVolunteerId),
                    tenantId: tenant._id,
                });
            }
            if (!volunteer) {
                throw new common_1.NotFoundException('Assigned volunteer not found. Please ensure the user is registered as a volunteer.');
            }
            assignedVolunteerId = volunteer._id;
            assignedUserId = volunteer.userId;
        }
        else if (dto.assignedUserId) {
            if (!mongoose_2.Types.ObjectId.isValid(dto.assignedUserId)) {
                throw new common_1.BadRequestException('Invalid assignedUserId format');
            }
            const volunteer = await this.volunteerModel.findOne({
                userId: new mongoose_2.Types.ObjectId(dto.assignedUserId),
                tenantId: tenant._id,
            });
            if (volunteer) {
                assignedVolunteerId = volunteer._id;
            }
            assignedUserId = new mongoose_2.Types.ObjectId(dto.assignedUserId);
        }
        const task = await this.taskModel.create({
            tenantId: tenant._id,
            title: dto.title.trim(),
            description: dto.description.trim(),
            assignedVolunteerId,
            assignedUserId,
            areaId: dto.areaId ? new mongoose_2.Types.ObjectId(dto.areaId) : undefined,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            priority: dto.priority || types_1.TaskPriority.MEDIUM,
            status: types_1.VolunteerTaskStatus.PENDING,
            attachments: dto.attachments || [],
            createdBy: new mongoose_2.Types.ObjectId(adminUser?.sub || adminUser?.id),
        });
        if (assignedVolunteerId) {
            await this.volunteerModel.updateOne({ _id: assignedVolunteerId }, { $addToSet: { tasks: task.title } });
        }
        return task;
    }
    async findAll(tenant, query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const filter = { tenantId: tenant._id };
        if (query.status)
            filter.status = query.status;
        if (query.priority)
            filter.priority = query.priority;
        if (query.areaId)
            filter.areaId = new mongoose_2.Types.ObjectId(query.areaId);
        if (query.volunteerId)
            filter.assignedVolunteerId = new mongoose_2.Types.ObjectId(query.volunteerId);
        if (query.search) {
            const searchRegex = { $regex: query.search.trim(), $options: 'i' };
            filter.$or = [{ title: searchRegex }, { description: searchRegex }];
        }
        const sortField = query.sortBy || 'createdAt';
        const sortDir = query.sortOrder === 'asc' ? 1 : -1;
        const sortOptions = { [sortField]: sortDir };
        const [items, total] = await Promise.all([
            this.taskModel
                .find(filter)
                .populate({
                path: 'assignedVolunteerId',
                populate: { path: 'userId', select: 'name mobile' },
            })
                .populate('assignedUserId', 'name mobile')
                .populate('areaId', 'name code')
                .populate('createdBy', 'name email')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            this.taskModel.countDocuments(filter),
        ]);
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findMyTasks(tenant, userId, query) {
        const volunteer = await this.volunteerModel.findOne({
            tenantId: tenant._id,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        const filter = {
            tenantId: tenant._id,
            $or: [
                { assignedUserId: new mongoose_2.Types.ObjectId(userId) },
                ...(volunteer ? [{ assignedVolunteerId: volunteer._id }] : []),
            ],
        };
        if (query?.status) {
            filter.status = query.status;
        }
        const tasks = await this.taskModel
            .find(filter)
            .populate('areaId', 'name code')
            .populate('createdBy', 'name')
            .sort({ dueDate: 1, createdAt: -1 })
            .lean();
        return tasks;
    }
    async findOne(tenant, id) {
        const task = await this.taskModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate({
            path: 'assignedVolunteerId',
            populate: { path: 'userId', select: 'name mobile' },
        })
            .populate('assignedUserId', 'name mobile')
            .populate('areaId', 'name code')
            .populate('createdBy', 'name email');
        if (!task) {
            throw new common_1.NotFoundException('Volunteer task not found');
        }
        return task;
    }
    async update(tenant, id, dto) {
        const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
        if (!task)
            throw new common_1.NotFoundException('Volunteer task not found');
        if (dto.title !== undefined)
            task.title = dto.title.trim();
        if (dto.description !== undefined)
            task.description = dto.description.trim();
        if (dto.dueDate !== undefined)
            task.dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
        if (dto.priority !== undefined)
            task.priority = dto.priority;
        if (dto.status !== undefined)
            task.status = dto.status;
        if (dto.attachments !== undefined)
            task.attachments = dto.attachments;
        if (dto.areaId !== undefined) {
            task.areaId = dto.areaId ? new mongoose_2.Types.ObjectId(dto.areaId) : undefined;
        }
        if (dto.assignedVolunteerId !== undefined) {
            if (dto.assignedVolunteerId) {
                if (!mongoose_2.Types.ObjectId.isValid(dto.assignedVolunteerId)) {
                    throw new common_1.BadRequestException('Invalid assignedVolunteerId format');
                }
                let vol = await this.volunteerModel.findOne({
                    _id: new mongoose_2.Types.ObjectId(dto.assignedVolunteerId),
                    tenantId: tenant._id,
                });
                if (!vol) {
                    vol = await this.volunteerModel.findOne({
                        userId: new mongoose_2.Types.ObjectId(dto.assignedVolunteerId),
                        tenantId: tenant._id,
                    });
                }
                if (!vol)
                    throw new common_1.NotFoundException('Assigned volunteer not found');
                task.assignedVolunteerId = vol._id;
                task.assignedUserId = vol.userId;
            }
            else {
                task.assignedVolunteerId = undefined;
                task.assignedUserId = undefined;
            }
        }
        await task.save();
        return task;
    }
    async acceptTask(tenant, id, user) {
        const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
        if (!task)
            throw new common_1.NotFoundException('Volunteer task not found');
        const userId = user?.sub || user?.id;
        const isAdminOrStaff = user?.role === 'admin' || user?.role === 'leader' || user?.isSuperAdmin;
        if (!isAdminOrStaff && task.assignedUserId && task.assignedUserId.toString() !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to accept this task');
        }
        if (task.status === types_1.VolunteerTaskStatus.PENDING) {
            task.status = types_1.VolunteerTaskStatus.ACCEPTED;
        }
        else {
            task.status = types_1.VolunteerTaskStatus.IN_PROGRESS;
        }
        await task.save();
        return {
            success: true,
            message: 'Task accepted successfully. Status changed to ' + task.status,
            task,
        };
    }
    async submitTask(tenant, id, dto, user) {
        const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
        if (!task)
            throw new common_1.NotFoundException('Volunteer task not found');
        const userId = user?.sub || user?.id;
        const isAdminOrStaff = user?.role === 'admin' || user?.role === 'leader' || user?.isSuperAdmin;
        if (!isAdminOrStaff && task.assignedUserId && task.assignedUserId.toString() !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to submit reports for this task');
        }
        const submitterId = (userId && mongoose_2.Types.ObjectId.isValid(userId))
            ? new mongoose_2.Types.ObjectId(userId)
            : task.assignedUserId;
        task.submission = {
            submittedAt: new Date(),
            completionRemark: dto.completionRemark.trim(),
            images: dto.images || [],
            reportUrl: dto.reportUrl || undefined,
            submittedBy: submitterId,
        };
        task.status = types_1.VolunteerTaskStatus.IN_PROGRESS;
        await task.save();
        return {
            success: true,
            message: 'Task completion report submitted successfully. Awaiting admin review.',
            task,
        };
    }
    async reviewTask(tenant, id, dto, adminUser) {
        const task = await this.taskModel.findOne({ _id: id, tenantId: tenant._id });
        if (!task)
            throw new common_1.NotFoundException('Volunteer task not found');
        task.status = dto.isApproved
            ? types_1.VolunteerTaskStatus.COMPLETED
            : types_1.VolunteerTaskStatus.REJECTED;
        task.review = {
            reviewedAt: new Date(),
            reviewedBy: new mongoose_2.Types.ObjectId(adminUser?.sub || adminUser?.id),
            reviewNote: dto.reviewNote ? dto.reviewNote.trim() : undefined,
            isApproved: dto.isApproved,
        };
        await task.save();
        return {
            success: true,
            message: dto.isApproved
                ? 'Task submission approved! Task marked as COMPLETED.'
                : 'Task submission rejected with feedback.',
            task,
        };
    }
    async getStats(tenant) {
        const now = new Date();
        const [statusStats, overdueCount, priorityStats] = await Promise.all([
            this.taskModel.aggregate([
                { $match: { tenantId: tenant._id } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.taskModel.countDocuments({
                tenantId: tenant._id,
                dueDate: { $lt: now },
                status: { $ne: types_1.VolunteerTaskStatus.COMPLETED },
            }),
            this.taskModel.aggregate([
                { $match: { tenantId: tenant._id } },
                { $group: { _id: '$priority', count: { $sum: 1 } } },
            ]),
        ]);
        const summary = {
            totalTasks: 0,
            pending: 0,
            accepted: 0,
            inProgress: 0,
            completed: 0,
            rejected: 0,
            overdueTasks: overdueCount,
            byPriority: {
                low: 0,
                medium: 0,
                high: 0,
                urgent: 0,
            },
        };
        for (const s of statusStats) {
            summary.totalTasks += s.count;
            if (s._id === types_1.VolunteerTaskStatus.PENDING)
                summary.pending = s.count;
            else if (s._id === types_1.VolunteerTaskStatus.ACCEPTED)
                summary.accepted = s.count;
            else if (s._id === types_1.VolunteerTaskStatus.IN_PROGRESS)
                summary.inProgress = s.count;
            else if (s._id === types_1.VolunteerTaskStatus.COMPLETED)
                summary.completed = s.count;
            else if (s._id === types_1.VolunteerTaskStatus.REJECTED)
                summary.rejected = s.count;
        }
        for (const p of priorityStats) {
            if (p._id in summary.byPriority) {
                summary.byPriority[p._id] = p.count;
            }
        }
        return summary;
    }
    async remove(tenant, id) {
        const deleted = await this.taskModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
        if (!deleted)
            throw new common_1.NotFoundException('Volunteer task not found');
        return { success: true, message: 'Volunteer task deleted successfully' };
    }
    async exportVolunteerTasks(tenant, query, res, format = 'csv', adminUser, ipAddress, userAgent) {
        const filter = { tenantId: tenant._id };
        if (query.status)
            filter.status = query.status;
        if (query.priority)
            filter.priority = query.priority;
        if (query.areaId && mongoose_2.Types.ObjectId.isValid(query.areaId)) {
            filter.areaId = new mongoose_2.Types.ObjectId(query.areaId);
        }
        if (query.volunteerId && mongoose_2.Types.ObjectId.isValid(query.volunteerId)) {
            filter.assignedVolunteerId = new mongoose_2.Types.ObjectId(query.volunteerId);
        }
        if (query.search) {
            const searchRegex = { $regex: query.search.trim(), $options: 'i' };
            filter.$or = [{ title: searchRegex }, { description: searchRegex }];
        }
        if (query.startDate || query.endDate) {
            filter.createdAt = {};
            if (query.startDate)
                filter.createdAt.$gte = new Date(query.startDate);
            if (query.endDate)
                filter.createdAt.$lte = new Date(query.endDate);
        }
        const tasks = await this.taskModel
            .find(filter)
            .populate({
            path: 'assignedVolunteerId',
            populate: { path: 'userId', select: 'name mobile email' },
        })
            .populate('assignedUserId', 'name mobile email')
            .populate('areaId', 'name code type')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .lean();
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
            'Task ID',
            'Title',
            'Description',
            'Priority',
            'Status',
            'Assigned Volunteer Name',
            'Assigned Volunteer Mobile',
            'Area / Ward',
            'Due Date',
            'Submitted Proof Remark',
            'Submitted Date',
            'Admin Review Status',
            'Admin Review Note',
            'Created Date',
        ];
        const rows = tasks.map((t) => {
            const volUser = t.assignedVolunteerId?.userId || t.assignedUserId || {};
            const area = t.areaId || {};
            const submission = t.submission || {};
            const review = t.review || {};
            let reviewStatus = 'Not Reviewed';
            if (review.isApproved === true)
                reviewStatus = 'Approved';
            else if (review.isApproved === false)
                reviewStatus = 'Rejected';
            return [
                escapeCsv(t._id.toString()),
                escapeCsv(t.title),
                escapeCsv(t.description),
                escapeCsv(t.priority),
                escapeCsv(t.status),
                escapeCsv(volUser.name || 'Unassigned'),
                escapeCsv(maskMobile(volUser.mobile)),
                escapeCsv(area.name ? `${area.name} (${area.type || 'Area'})` : 'Constituency'),
                escapeCsv(t.dueDate ? new Date(t.dueDate).toISOString() : ''),
                escapeCsv(submission.completionRemark || ''),
                escapeCsv(submission.submittedAt ? new Date(submission.submittedAt).toISOString() : ''),
                escapeCsv(reviewStatus),
                escapeCsv(review.reviewNote || ''),
                escapeCsv(t.createdAt ? new Date(t.createdAt).toISOString() : ''),
            ].join(',');
        });
        const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
        const bom = '\uFEFF';
        const csvContent = bom + [headers.join(','), ...rows].join('\r\n');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `volunteer-tasks-${tenant.slug || 'export'}-${timestamp}.csv`;
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
                action: 'DATA_EXPORT_VOLUNTEER_TASKS',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    format: isExcel ? 'excel' : 'csv',
                    recordCount: tasks.length,
                    filterQuery: query,
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
exports.VolunteerTasksService = VolunteerTasksService;
exports.VolunteerTasksService = VolunteerTasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(volunteer_task_schema_1.VolunteerTask.name)),
    __param(1, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], VolunteerTasksService);
//# sourceMappingURL=volunteer-tasks.service.js.map
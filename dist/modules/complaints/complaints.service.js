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
const complaint_category_schema_1 = require("./complaint-category.schema");
const types_1 = require("../../shared/types");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const firebase_service_1 = require("../notifications/firebase.service");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const user_schema_1 = require("../users/user.schema");
let ComplaintsService = class ComplaintsService {
    constructor(complaintModel, categoryModel, adminUserModel, userModel, auditLogsService, firebaseService) {
        this.complaintModel = complaintModel;
        this.categoryModel = categoryModel;
        this.adminUserModel = adminUserModel;
        this.userModel = userModel;
        this.auditLogsService = auditLogsService;
        this.firebaseService = firebaseService;
    }
    async generateNumber(tenantId) {
        const year = new Date().getFullYear();
        const count = await this.complaintModel.countDocuments({
            tenantId,
            createdAt: {
                $gte: new Date(year, 0, 1),
                $lte: new Date(year, 11, 31, 23, 59, 59),
            },
        });
        return `CMP-${year}-${String(count + 1).padStart(6, '0')}`;
    }
    async pushToAdmins(tenantId, payload) {
        if (!this.firebaseService?.isReady())
            return;
        try {
            const admins = await this.adminUserModel
                .find({ tenantId, isActive: true, fcmTokens: { $exists: true, $not: { $size: 0 } } })
                .select('fcmTokens')
                .lean();
            const tokens = [];
            for (const admin of admins) {
                for (const tok of admin.fcmTokens || []) {
                    if (tok && !tokens.includes(tok))
                        tokens.push(tok);
                }
            }
            if (tokens.length > 0) {
                await this.firebaseService.sendMulticastPush(tokens, payload).catch(() => { });
            }
        }
        catch { }
    }
    async pushToCitizen(userId, payload) {
        if (!this.firebaseService?.isReady())
            return;
        try {
            const userObjId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId.toString()) : null;
            if (!userObjId)
                return;
            const user = await this.userModel.findById(userObjId).select('fcmTokens').lean();
            const tokens = user?.fcmTokens || [];
            if (tokens.length === 0)
                return;
            await this.firebaseService.sendToSingleToken(tokens[0], payload).catch(() => { });
        }
        catch { }
    }
    async create(tenant, userId, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID in auth token');
        }
        if (!mongoose_2.Types.ObjectId.isValid(dto.areaId)) {
            throw new common_1.BadRequestException(`Invalid areaId "${dto.areaId}". Must be a valid 24-character hexadecimal MongoDB ObjectId (e.g. from GET /areas).`);
        }
        const complaintNumber = await this.generateNumber(tenant._id);
        const mediaUrls = dto.mediaUrls || dto.attachments || [];
        const attachments = dto.attachments || dto.mediaUrls || [];
        const complaint = await this.complaintModel.create({
            tenantId: tenant._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            areaId: new mongoose_2.Types.ObjectId(dto.areaId),
            complaintNumber,
            title: dto.title.trim(),
            description: dto.description.trim(),
            category: dto.category.trim(),
            attachments,
            mediaUrls,
            videoUrl: dto.videoUrl || undefined,
            priority: dto.priority || types_1.ComplaintPriority.MEDIUM,
            status: types_1.ComplaintStatus.SUBMITTED,
            timeline: [
                {
                    status: types_1.ComplaintStatus.SUBMITTED,
                    action: 'SUBMITTED',
                    note: 'Complaint submitted by citizen',
                    updatedAt: new Date(),
                },
            ],
        });
        const saved = await this.findOne(tenant, complaint._id.toString(), { sub: userId, role: 'citizen' });
        this.pushToAdmins(tenant._id, {
            title: '🆕 New Complaint Filed',
            body: `${complaint.title} — ${complaint.complaintNumber}`,
            data: { type: 'complaint_new', complaintId: complaint._id.toString(), complaintNumber: complaint.complaintNumber },
        });
        return saved;
    }
    async findByUser(tenant, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        return this.complaintModel
            .find({ tenantId: tenant._id, userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('areaId', 'name')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 })
            .lean();
    }
    async findOne(tenant, id, requester) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Complaint not found (invalid ID format: "${id}")`);
        }
        const complaint = await this.complaintModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id })
            .populate('userId', 'name mobile email voterId')
            .populate('areaId', 'name')
            .populate('assignedTo', 'name email role phone')
            .populate('assignedBy', 'name email')
            .populate('resolvedBy', 'name')
            .populate('closedBy', 'name')
            .lean();
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const isCitizenViewer = requester?.role === 'citizen' || (requester?.sub && complaint.userId?._id?.toString() === requester.sub && requester.role !== 'admin' && requester.role !== 'super_admin');
        if (isCitizenViewer) {
            return {
                ...complaint,
                internalRemarks: [],
                timeline: (complaint.timeline || []).filter((t) => !t.isInternal),
            };
        }
        return complaint;
    }
    async getCitizenDashboardCounters(tenant, userId) {
        const userObjId = new mongoose_2.Types.ObjectId(userId);
        const [total, pending, inProgress, resolved, closed, rejected] = await Promise.all([
            this.complaintModel.countDocuments({ tenantId: tenant._id, userId: userObjId }),
            this.complaintModel.countDocuments({
                tenantId: tenant._id,
                userId: userObjId,
                status: { $in: [types_1.ComplaintStatus.SUBMITTED, types_1.ComplaintStatus.UNDER_REVIEW] },
            }),
            this.complaintModel.countDocuments({
                tenantId: tenant._id,
                userId: userObjId,
                status: { $in: [types_1.ComplaintStatus.ASSIGNED, types_1.ComplaintStatus.IN_PROGRESS] },
            }),
            this.complaintModel.countDocuments({
                tenantId: tenant._id,
                userId: userObjId,
                status: types_1.ComplaintStatus.RESOLVED,
            }),
            this.complaintModel.countDocuments({
                tenantId: tenant._id,
                userId: userObjId,
                status: types_1.ComplaintStatus.CLOSED,
            }),
            this.complaintModel.countDocuments({
                tenantId: tenant._id,
                userId: userObjId,
                status: types_1.ComplaintStatus.REJECTED,
            }),
        ]);
        return {
            total,
            pending,
            inProgress,
            resolved,
            closed,
            rejected,
        };
    }
    async findAll(tenant, queryDto) {
        const page = Math.max(Number(queryDto.page) || 1, 1);
        const limit = Math.min(Math.max(Number(queryDto.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const filter = { tenantId: tenant._id };
        if (queryDto.status) {
            filter.status = queryDto.status;
        }
        if (queryDto.priority) {
            filter.priority = queryDto.priority;
        }
        if (queryDto.isPublic !== undefined) {
            filter.isPublic = queryDto.isPublic === true || String(queryDto.isPublic) === 'true';
        }
        if (queryDto.areaId) {
            filter.areaId = new mongoose_2.Types.ObjectId(queryDto.areaId);
        }
        if (queryDto.category) {
            filter.category = queryDto.category;
        }
        if (queryDto.assignedTo) {
            filter.assignedTo = new mongoose_2.Types.ObjectId(queryDto.assignedTo);
        }
        if (queryDto.startDate || queryDto.endDate) {
            filter.createdAt = {};
            if (queryDto.startDate)
                filter.createdAt.$gte = new Date(queryDto.startDate);
            if (queryDto.endDate)
                filter.createdAt.$lte = new Date(queryDto.endDate);
        }
        if (queryDto.search) {
            const searchRegex = { $regex: queryDto.search.trim(), $options: 'i' };
            filter.$or = [
                { complaintNumber: searchRegex },
                { title: searchRegex },
                { description: searchRegex },
            ];
        }
        const [items, total] = await Promise.all([
            this.complaintModel
                .find(filter)
                .populate('userId', 'name mobile email')
                .populate('areaId', 'name')
                .populate('assignedTo', 'name email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.complaintModel.countDocuments(filter),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async assignComplaint(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        if (!mongoose_2.Types.ObjectId.isValid(dto.assignedTo)) {
            throw new common_1.BadRequestException(`Invalid assignedTo ID "${dto.assignedTo}". Must be a valid 24-character hexadecimal MongoDB ObjectId.`);
        }
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        const assignedToObjId = new mongoose_2.Types.ObjectId(dto.assignedTo);
        complaint.assignedTo = assignedToObjId;
        complaint.assignedBy = adminObjId;
        complaint.assignedAt = new Date();
        complaint.status = types_1.ComplaintStatus.ASSIGNED;
        if (dto.priority) {
            complaint.priority = dto.priority;
        }
        complaint.timeline.push({
            status: types_1.ComplaintStatus.ASSIGNED,
            action: 'ASSIGNED',
            note: dto.note || `Complaint assigned to staff member`,
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            updatedByRole: adminUser?.role || 'admin',
            updatedAt: new Date(),
        });
        await complaint.save();
        return this.findOne(tenant, id, adminUser);
    }
    async updatePriority(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const oldPriority = complaint.priority;
        complaint.priority = dto.priority;
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        complaint.timeline.push({
            status: complaint.status,
            action: 'PRIORITY_CHANGED',
            note: dto.note || `Priority changed from ${oldPriority} to ${dto.priority}`,
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            updatedAt: new Date(),
        });
        await complaint.save();
        return this.findOne(tenant, id, adminUser);
    }
    async addRemark(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        const isInternal = dto.isInternal !== false;
        const remarkEntry = {
            remark: dto.remark.trim(),
            addedBy: adminObjId,
            addedByName: adminUser?.name || 'Admin',
            isInternal,
            createdAt: new Date(),
        };
        if (isInternal) {
            complaint.internalRemarks.push(remarkEntry);
        }
        else {
            complaint.publicRemarks.push(remarkEntry);
        }
        complaint.timeline.push({
            status: complaint.status,
            action: 'REMARK_ADDED',
            note: dto.remark.trim(),
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            isInternal,
            updatedAt: new Date(),
        });
        await complaint.save();
        return this.findOne(tenant, id, adminUser);
    }
    async resolveComplaint(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        complaint.status = types_1.ComplaintStatus.RESOLVED;
        complaint.resolutionDetails = dto.resolutionDetails.trim();
        if (dto.resolutionProof?.length) {
            complaint.resolutionProof = dto.resolutionProof;
        }
        complaint.resolvedAt = new Date();
        complaint.resolvedBy = adminObjId;
        complaint.timeline.push({
            status: types_1.ComplaintStatus.RESOLVED,
            action: 'RESOLVED',
            note: dto.note || dto.resolutionDetails.trim(),
            proofUrls: dto.resolutionProof || [],
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            updatedAt: new Date(),
        });
        await complaint.save();
        const result = await this.findOne(tenant, id, adminUser);
        this.pushToCitizen(complaint.userId, {
            title: '✅ Complaint Resolved',
            body: `Your complaint "${complaint.title}" has been resolved.`,
            data: { type: 'complaint_resolved', complaintId: id },
        });
        return result;
    }
    async closeComplaint(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        complaint.status = types_1.ComplaintStatus.CLOSED;
        complaint.closedAt = new Date();
        complaint.closedBy = adminObjId;
        if (dto.closingNote) {
            complaint.closingNote = dto.closingNote.trim();
        }
        complaint.timeline.push({
            status: types_1.ComplaintStatus.CLOSED,
            action: 'CLOSED',
            note: dto.closingNote || 'Complaint closed after resolution confirmation',
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            updatedAt: new Date(),
        });
        await complaint.save();
        const closedResult = await this.findOne(tenant, id, adminUser);
        this.pushToCitizen(complaint.userId, {
            title: '🔒 Complaint Closed',
            body: `Your complaint "${complaint.title}" has been officially closed.`,
            data: { type: 'complaint_closed', complaintId: id },
        });
        return closedResult;
    }
    async rejectComplaint(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        complaint.status = types_1.ComplaintStatus.REJECTED;
        complaint.rejectionReason = dto.reason.trim();
        complaint.rejectedAt = new Date();
        complaint.rejectedBy = adminObjId;
        complaint.timeline.push({
            status: types_1.ComplaintStatus.REJECTED,
            action: 'REJECTED',
            note: `Complaint rejected: ${dto.reason.trim()}`,
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            updatedAt: new Date(),
        });
        await complaint.save();
        const rejectedResult = await this.findOne(tenant, id, adminUser);
        this.pushToCitizen(complaint.userId, {
            title: '❌ Complaint Rejected',
            body: `Your complaint "${complaint.title}" was rejected: ${dto.reason.trim()}`,
            data: { type: 'complaint_rejected', complaintId: id },
        });
        return rejectedResult;
    }
    async updateStatus(tenant, id, status, note, updatedBy) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = updatedBy ? new mongoose_2.Types.ObjectId(updatedBy) : undefined;
        complaint.status = status;
        if (status === types_1.ComplaintStatus.RESOLVED && !complaint.resolvedAt) {
            complaint.resolvedAt = new Date();
            complaint.resolvedBy = adminObjId;
        }
        else if (status === types_1.ComplaintStatus.CLOSED && !complaint.closedAt) {
            complaint.closedAt = new Date();
            complaint.closedBy = adminObjId;
        }
        complaint.timeline.push({
            status,
            action: 'STATUS_UPDATED',
            note: note || `Status updated to ${status}`,
            updatedBy: adminObjId,
            updatedAt: new Date(),
        });
        await complaint.save();
        const updatedResult = await this.findOne(tenant, id);
        if (status === types_1.ComplaintStatus.RESOLVED || status === types_1.ComplaintStatus.CLOSED) {
            const statusLabel = status === types_1.ComplaintStatus.RESOLVED ? '✅ Resolved' : '🔒 Closed';
            this.pushToCitizen(complaint.userId, {
                title: `Complaint ${statusLabel}`,
                body: note || `Your complaint status updated to ${status}`,
                data: { type: 'complaint_status', complaintId: id, status },
            });
        }
        return updatedResult;
    }
    async togglePublic(tenant, id, dto, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Complaint not found');
        const complaint = await this.complaintModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!complaint)
            throw new common_1.NotFoundException('Complaint not found');
        const adminObjId = adminUser?.sub || adminUser?.id ? new mongoose_2.Types.ObjectId(adminUser.sub || adminUser.id) : undefined;
        complaint.isPublic = dto.isPublic;
        if (dto.isPublic) {
            complaint.publishedAt = new Date();
            complaint.publishedBy = adminObjId;
        }
        else {
            complaint.publishedAt = undefined;
            complaint.publishedBy = undefined;
        }
        complaint.timeline.push({
            status: complaint.status,
            action: dto.isPublic ? 'PUBLISHED_TO_PWA' : 'UNPUBLISHED_FROM_PWA',
            note: dto.isPublic ? 'Complaint published to Citizen PWA community board' : 'Complaint removed from Citizen PWA community board',
            updatedBy: adminObjId,
            updatedByName: adminUser?.name || 'Admin',
            updatedByRole: adminUser?.role || 'admin',
            isInternal: true,
            updatedAt: new Date(),
        });
        await complaint.save();
        return this.findOne(tenant, id, adminUser);
    }
    async remove(tenant, id, adminUser) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Complaint not found (invalid ID: "${id}")`);
        }
        const complaint = await this.complaintModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            tenantId: tenant._id,
        });
        if (!complaint) {
            throw new common_1.NotFoundException('Complaint not found');
        }
        await this.complaintModel.deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
            tenantId: tenant._id,
        });
        if (this.auditLogsService && adminUser) {
            await this.auditLogsService
                .log({
                tenantId: tenant._id,
                tenantName: tenant.name,
                action: 'DELETE_COMPLAINT',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    complaintId: id,
                    complaintNumber: complaint.complaintNumber,
                    title: complaint.title,
                    category: complaint.category,
                },
            })
                .catch(() => { });
        }
        return {
            success: true,
            message: `Complaint ${complaint.complaintNumber || id} deleted successfully`,
        };
    }
    async findPublic(tenant, queryDto) {
        const page = Math.max(Number(queryDto.page) || 1, 1);
        const limit = Math.min(Math.max(Number(queryDto.limit) || 20, 1), 50);
        const skip = (page - 1) * limit;
        const filter = {
            tenantId: tenant._id,
            isPublic: true,
        };
        if (queryDto.areaId && mongoose_2.Types.ObjectId.isValid(queryDto.areaId)) {
            filter.areaId = new mongoose_2.Types.ObjectId(queryDto.areaId);
        }
        if (queryDto.category) {
            filter.category = queryDto.category;
        }
        if (queryDto.search) {
            const searchRegex = { $regex: queryDto.search.trim(), $options: 'i' };
            filter.$or = [
                { complaintNumber: searchRegex },
                { title: searchRegex },
                { description: searchRegex },
            ];
        }
        const [rawItems, total] = await Promise.all([
            this.complaintModel
                .find(filter)
                .populate('userId', 'name')
                .populate('areaId', 'name')
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.complaintModel.countDocuments(filter),
        ]);
        const items = rawItems.map((c) => {
            const citizenName = c.userId?.name ? `${c.userId.name.slice(0, 1)}. (Citizen)` : 'Verified Citizen';
            return {
                _id: c._id,
                complaintNumber: c.complaintNumber,
                title: c.title,
                description: c.description,
                category: c.category,
                status: c.status,
                priority: c.priority,
                area: c.areaId ? { name: c.areaId.name } : null,
                attachments: c.attachments || c.mediaUrls || [],
                resolutionDetails: c.resolutionDetails || null,
                resolutionProof: c.resolutionProof || [],
                resolvedAt: c.resolvedAt || null,
                publishedAt: c.publishedAt || c.updatedAt,
                publicRemarks: (c.publicRemarks || []).map((r) => ({
                    remark: r.remark,
                    addedByName: r.addedByName || 'Official Team',
                    createdAt: r.createdAt,
                })),
                timeline: (c.timeline || [])
                    .filter((t) => !t.isInternal)
                    .map((t) => ({
                    status: t.status,
                    action: t.action,
                    note: t.note,
                    proofUrls: t.proofUrls || [],
                    updatedAt: t.updatedAt,
                })),
                citizenInitial: citizenName,
            };
        });
        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAnalytics(tenant) {
        const tenantObjId = new mongoose_2.Types.ObjectId(tenant._id.toString());
        const [statusStats, priorityStats, areaStats, categoryStats, resolutionStats, monthlyTrend,] = await Promise.all([
            this.complaintModel.aggregate([
                { $match: { tenantId: tenantObjId } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.complaintModel.aggregate([
                { $match: { tenantId: tenantObjId } },
                { $group: { _id: '$priority', count: { $sum: 1 } } },
            ]),
            this.complaintModel.aggregate([
                { $match: { tenantId: tenantObjId } },
                { $group: { _id: '$areaId', total: { $sum: 1 }, open: { $sum: { $cond: [{ $in: ['$status', [types_1.ComplaintStatus.SUBMITTED, types_1.ComplaintStatus.UNDER_REVIEW, types_1.ComplaintStatus.ASSIGNED, types_1.ComplaintStatus.IN_PROGRESS]] }, 1, 0] } } } },
                { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
                { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
                { $project: { _id: 1, areaName: '$area.name', total: 1, open: 1 } },
                { $sort: { total: -1 } },
                { $limit: 10 },
            ]),
            this.complaintModel.aggregate([
                { $match: { tenantId: tenantObjId } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            this.complaintModel.aggregate([
                {
                    $match: {
                        tenantId: tenantObjId,
                        resolvedAt: { $exists: true, $ne: null },
                    },
                },
                {
                    $project: {
                        durationHours: {
                            $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageHours: { $avg: '$durationHours' },
                        minHours: { $min: '$durationHours' },
                        maxHours: { $max: '$durationHours' },
                        totalResolvedCount: { $sum: 1 },
                    },
                },
            ]),
            this.complaintModel.aggregate([
                {
                    $match: {
                        tenantId: tenantObjId,
                        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        submitted: { $sum: 1 },
                        resolved: {
                            $sum: { $cond: [{ $in: ['$status', [types_1.ComplaintStatus.RESOLVED, types_1.ComplaintStatus.CLOSED]] }, 1, 0] },
                        },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),
        ]);
        const byStatus = {
            [types_1.ComplaintStatus.SUBMITTED]: 0,
            [types_1.ComplaintStatus.UNDER_REVIEW]: 0,
            [types_1.ComplaintStatus.ASSIGNED]: 0,
            [types_1.ComplaintStatus.IN_PROGRESS]: 0,
            [types_1.ComplaintStatus.RESOLVED]: 0,
            [types_1.ComplaintStatus.CLOSED]: 0,
            [types_1.ComplaintStatus.REJECTED]: 0,
        };
        let totalComplaints = 0;
        statusStats.forEach((s) => {
            byStatus[s._id] = s.count;
            totalComplaints += s.count;
        });
        const pending = (byStatus[types_1.ComplaintStatus.SUBMITTED] || 0) + (byStatus[types_1.ComplaintStatus.UNDER_REVIEW] || 0);
        const inProgress = (byStatus[types_1.ComplaintStatus.ASSIGNED] || 0) + (byStatus[types_1.ComplaintStatus.IN_PROGRESS] || 0);
        const resolvedTotal = (byStatus[types_1.ComplaintStatus.RESOLVED] || 0) + (byStatus[types_1.ComplaintStatus.CLOSED] || 0);
        const byPriority = {
            [types_1.ComplaintPriority.LOW]: 0,
            [types_1.ComplaintPriority.MEDIUM]: 0,
            [types_1.ComplaintPriority.HIGH]: 0,
            [types_1.ComplaintPriority.URGENT]: 0,
        };
        priorityStats.forEach((p) => {
            byPriority[p._id] = p.count;
        });
        const avgResData = resolutionStats[0] || {};
        const averageResolutionTimeHours = avgResData.averageHours ? Math.round(avgResData.averageHours * 10) / 10 : 0;
        const averageResolutionTimeDays = Math.round((averageResolutionTimeHours / 24) * 10) / 10;
        const resolutionRatePercentage = totalComplaints > 0 ? Math.round((resolvedTotal / totalComplaints) * 1000) / 10 : 0;
        const formattedMonthlyTrend = monthlyTrend.map((m) => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
                submitted: m.submitted,
                resolved: m.resolved,
            };
        });
        return {
            summary: {
                totalComplaints,
                pending,
                inProgress,
                resolved: resolvedTotal,
                closed: byStatus[types_1.ComplaintStatus.CLOSED] || 0,
                rejected: byStatus[types_1.ComplaintStatus.REJECTED] || 0,
                resolutionRatePercentage,
                averageResolutionTimeHours,
                averageResolutionTimeDays,
            },
            byStatus,
            byPriority,
            byCategory: categoryStats.map((c) => ({ category: c._id || 'Uncategorized', count: c.count })),
            byArea: areaStats.map((a) => ({
                areaId: a._id,
                areaName: a.areaName || 'Unknown Area',
                total: a.total,
                open: a.open,
            })),
            topProblemAreas: areaStats
                .slice()
                .sort((a, b) => b.open - a.open)
                .slice(0, 5)
                .map((a) => ({
                areaId: a._id,
                areaName: a.areaName || 'Unknown Area',
                openComplaints: a.open,
                totalComplaints: a.total,
            })),
            monthlyTrend: formattedMonthlyTrend,
        };
    }
    async getDashboardStats(tenant) {
        const stats = await this.complaintModel.aggregate([
            { $match: { tenantId: tenant._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        return stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), { total: 0 });
    }
    async getCategories(tenant) {
        return this.categoryModel
            .find({ tenantId: tenant._id, isActive: true })
            .sort({ order: 1, name: 1 })
            .lean();
    }
    async createCategory(tenant, dto) {
        const existing = await this.categoryModel.findOne({ tenantId: tenant._id, name: dto.name.trim() });
        if (existing)
            throw new common_1.BadRequestException(`Category "${dto.name}" already exists`);
        return this.categoryModel.create({
            tenantId: tenant._id,
            name: dto.name.trim(),
            description: dto.description || '',
            icon: dto.icon || '',
            order: dto.order ?? 0,
            isActive: true,
        });
    }
    async updateCategory(tenant, catId, dto) {
        const filter = {
            _id: mongoose_2.Types.ObjectId.isValid(catId) ? new mongoose_2.Types.ObjectId(catId) : catId,
            tenantId: tenant._id,
        };
        const updated = await this.categoryModel.findOneAndUpdate(filter, { $set: dto }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Category not found');
        return updated;
    }
    async deleteCategory(tenant, catId) {
        const filter = {
            _id: mongoose_2.Types.ObjectId.isValid(catId) ? new mongoose_2.Types.ObjectId(catId) : catId,
            tenantId: tenant._id,
        };
        const deleted = await this.categoryModel.findOneAndDelete(filter);
        if (!deleted)
            throw new common_1.NotFoundException('Category not found');
        return { message: 'Category deleted successfully' };
    }
    async exportComplaints(tenant, query, res, format = 'csv', adminUser, ipAddress, userAgent) {
        const filter = { tenantId: tenant._id };
        if (query.status)
            filter.status = query.status;
        if (query.priority)
            filter.priority = query.priority;
        if (query.category)
            filter.category = query.category;
        if (query.areaId && mongoose_2.Types.ObjectId.isValid(query.areaId)) {
            filter.areaId = new mongoose_2.Types.ObjectId(query.areaId);
        }
        if (query.assignedTo && mongoose_2.Types.ObjectId.isValid(query.assignedTo)) {
            filter.assignedTo = new mongoose_2.Types.ObjectId(query.assignedTo);
        }
        if (query.search) {
            filter.$or = [
                { complaintNumber: { $regex: query.search.trim(), $options: 'i' } },
                { title: { $regex: query.search.trim(), $options: 'i' } },
                { description: { $regex: query.search.trim(), $options: 'i' } },
            ];
        }
        if (query.startDate || query.endDate) {
            filter.createdAt = {};
            if (query.startDate)
                filter.createdAt.$gte = new Date(query.startDate);
            if (query.endDate)
                filter.createdAt.$lte = new Date(query.endDate);
        }
        const complaints = await this.complaintModel
            .find(filter)
            .populate('userId', 'name mobile')
            .populate('areaId', 'name type')
            .populate('assignedTo', 'name email role')
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
            'Complaint No',
            'Title',
            'Category',
            'Priority',
            'Status',
            'Citizen Name',
            'Citizen Mobile',
            'Area / Ward',
            'Assigned Staff',
            'Submitted Date',
            'Resolved Date',
            'Closed Date',
            'Resolution Details',
            'Resolution Proof Links',
        ];
        const rows = complaints.map((c) => {
            const citizen = c.userId || {};
            const area = c.areaId || {};
            const assigned = c.assignedTo || {};
            const proofs = (c.resolutionProof || []).join('; ');
            return [
                escapeCsv(c.complaintNumber),
                escapeCsv(c.title),
                escapeCsv(c.category),
                escapeCsv(c.priority),
                escapeCsv(c.status),
                escapeCsv(citizen.name || 'Citizen'),
                escapeCsv(maskMobile(citizen.mobile)),
                escapeCsv(area.name ? `${area.name} (${area.type || 'Area'})` : 'Constituency'),
                escapeCsv(assigned.name || 'Unassigned'),
                escapeCsv(c.createdAt ? new Date(c.createdAt).toISOString() : ''),
                escapeCsv(c.resolvedAt ? new Date(c.resolvedAt).toISOString() : ''),
                escapeCsv(c.closedAt ? new Date(c.closedAt).toISOString() : ''),
                escapeCsv(c.resolutionDetails || ''),
                escapeCsv(proofs),
            ].join(',');
        });
        const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
        const bom = '\uFEFF';
        const csvContent = bom + [headers.join(','), ...rows].join('\r\n');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `complaints-${tenant.slug || 'export'}-${timestamp}.csv`;
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
                action: 'DATA_EXPORT_COMPLAINTS',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    format: isExcel ? 'excel' : 'csv',
                    recordCount: complaints.length,
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
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(complaint_schema_1.Complaint.name)),
    __param(1, (0, mongoose_1.InjectModel)(complaint_category_schema_1.ComplaintCategory.name)),
    __param(2, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, common_1.Optional)()),
    __param(5, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService,
        firebase_service_1.FirebaseService])
], ComplaintsService);
//# sourceMappingURL=complaints.service.js.map
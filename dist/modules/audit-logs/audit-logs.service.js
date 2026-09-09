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
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("./audit-log.schema");
let AuditLogsService = class AuditLogsService {
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async log(dto) {
        return this.auditLogModel.create({
            ...dto,
            tenantId: dto.tenantId ? new mongoose_2.Types.ObjectId(dto.tenantId.toString()) : undefined,
        });
    }
    async findAll(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.tenantId) {
            filter.tenantId = new mongoose_2.Types.ObjectId(query.tenantId);
        }
        if (query.action) {
            filter.action = query.action;
        }
        if (query.search) {
            filter.$or = [
                { action: { $regex: query.search, $options: 'i' } },
                { tenantName: { $regex: query.search, $options: 'i' } },
                { 'performedBy.email': { $regex: query.search, $options: 'i' } },
                { 'performedBy.name': { $regex: query.search, $options: 'i' } },
            ];
        }
        const [total, items] = await Promise.all([
            this.auditLogModel.countDocuments(filter),
            this.auditLogModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
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
    async findByTenant(tenantId, limit = 20) {
        return this.auditLogModel
            .find({ tenantId: new mongoose_2.Types.ObjectId(tenantId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map
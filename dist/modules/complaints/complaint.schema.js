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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintSchema = exports.Complaint = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let Complaint = class Complaint {
};
exports.Complaint = Complaint;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Complaint.prototype, "complaintNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "areaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Complaint.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Complaint.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Complaint.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Complaint.prototype, "mediaUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Complaint.prototype, "videoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.ComplaintStatus),
        default: types_1.ComplaintStatus.SUBMITTED,
    }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.ComplaintPriority),
        default: types_1.ComplaintPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Complaint.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "assignedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Complaint.prototype, "assignedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                remark: String,
                addedBy: { type: mongoose_2.Types.ObjectId, ref: 'AdminUser' },
                addedByName: String,
                isInternal: { type: Boolean, default: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Complaint.prototype, "internalRemarks", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                remark: String,
                addedBy: { type: mongoose_2.Types.ObjectId, ref: 'AdminUser' },
                addedByName: String,
                isInternal: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Complaint.prototype, "publicRemarks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Complaint.prototype, "resolutionDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Complaint.prototype, "resolutionProof", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Complaint.prototype, "resolvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "resolvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Complaint.prototype, "closedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "closedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Complaint.prototype, "closingNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Complaint.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Complaint.prototype, "rejectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "rejectedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Complaint.prototype, "isPublic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Complaint.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "publishedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                status: String,
                note: String,
                action: String,
                updatedBy: mongoose_2.Types.ObjectId,
                updatedByName: String,
                updatedByRole: String,
                isInternal: { type: Boolean, default: false },
                proofUrls: [String],
                updatedAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Complaint.prototype, "timeline", void 0);
exports.Complaint = Complaint = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Complaint);
exports.ComplaintSchema = mongoose_1.SchemaFactory.createForClass(Complaint);
exports.ComplaintSchema.index({ tenantId: 1, status: 1 });
exports.ComplaintSchema.index({ tenantId: 1, isPublic: 1, status: 1 });
exports.ComplaintSchema.index({ tenantId: 1, priority: 1 });
exports.ComplaintSchema.index({ tenantId: 1, areaId: 1 });
exports.ComplaintSchema.index({ tenantId: 1, category: 1 });
exports.ComplaintSchema.index({ tenantId: 1, userId: 1 });
exports.ComplaintSchema.index({ tenantId: 1, assignedTo: 1 });
exports.ComplaintSchema.index({ tenantId: 1, createdAt: -1 });
exports.ComplaintSchema.index({ tenantId: 1, complaintNumber: 1 });
//# sourceMappingURL=complaint.schema.js.map
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
], Complaint.prototype, "mediaUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: types_1.ComplaintStatus.SUBMITTED, enum: Object.values(types_1.ComplaintStatus) }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Complaint.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ status: String, note: String, updatedBy: mongoose_2.Types.ObjectId, updatedAt: Date }],
        default: [],
    }),
    __metadata("design:type", Array)
], Complaint.prototype, "timeline", void 0);
exports.Complaint = Complaint = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Complaint);
exports.ComplaintSchema = mongoose_1.SchemaFactory.createForClass(Complaint);
exports.ComplaintSchema.index({ tenantId: 1, status: 1 });
exports.ComplaintSchema.index({ tenantId: 1, areaId: 1 });
exports.ComplaintSchema.index({ tenantId: 1, userId: 1 });
//# sourceMappingURL=complaint.schema.js.map
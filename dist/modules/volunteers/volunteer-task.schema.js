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
exports.VolunteerTaskSchema = exports.VolunteerTask = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let VolunteerTask = class VolunteerTask {
};
exports.VolunteerTask = VolunteerTask;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VolunteerTask.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], VolunteerTask.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], VolunteerTask.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Volunteer', default: null, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VolunteerTask.prototype, "assignedVolunteerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VolunteerTask.prototype, "assignedUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VolunteerTask.prototype, "areaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], VolunteerTask.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(types_1.TaskPriority),
        default: types_1.TaskPriority.MEDIUM,
        index: true,
    }),
    __metadata("design:type", String)
], VolunteerTask.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: Object.values(types_1.VolunteerTaskStatus),
        default: types_1.VolunteerTaskStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], VolunteerTask.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], VolunteerTask.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: null,
    }),
    __metadata("design:type", Object)
], VolunteerTask.prototype, "submission", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: null,
    }),
    __metadata("design:type", Object)
], VolunteerTask.prototype, "review", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VolunteerTask.prototype, "createdBy", void 0);
exports.VolunteerTask = VolunteerTask = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VolunteerTask);
exports.VolunteerTaskSchema = mongoose_1.SchemaFactory.createForClass(VolunteerTask);
exports.VolunteerTaskSchema.index({ tenantId: 1, status: 1 });
exports.VolunteerTaskSchema.index({ tenantId: 1, assignedVolunteerId: 1 });
exports.VolunteerTaskSchema.index({ tenantId: 1, assignedUserId: 1 });
exports.VolunteerTaskSchema.index({ tenantId: 1, areaId: 1 });
exports.VolunteerTaskSchema.index({ tenantId: 1, priority: 1 });
exports.VolunteerTaskSchema.index({ tenantId: 1, dueDate: 1 });
//# sourceMappingURL=volunteer-task.schema.js.map
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
exports.VolunteerSchema = exports.Volunteer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let Volunteer = class Volunteer {
};
exports.Volunteer = Volunteer;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Volunteer.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Volunteer.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Volunteer.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Volunteer.prototype, "assignedAreaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: types_1.VolunteerStatus.ACTIVE, enum: Object.values(types_1.VolunteerStatus) }),
    __metadata("design:type", String)
], Volunteer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Volunteer.prototype, "tasks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Volunteer.prototype, "assignedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Volunteer.prototype, "notes", void 0);
exports.Volunteer = Volunteer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Volunteer);
exports.VolunteerSchema = mongoose_1.SchemaFactory.createForClass(Volunteer);
exports.VolunteerSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
exports.VolunteerSchema.index({ tenantId: 1, assignedAreaId: 1 });
//# sourceMappingURL=volunteer.schema.js.map
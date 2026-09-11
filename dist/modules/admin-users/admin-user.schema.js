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
exports.AdminUserSchema = exports.AdminUser = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AdminUser = class AdminUser {
};
exports.AdminUser = AdminUser;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AdminUser.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, lowercase: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], AdminUser.prototype, "passwordHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], AdminUser.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], AdminUser.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AdminUser.prototype, "assignedAreaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], AdminUser.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], AdminUser.prototype, "isSuperAdmin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], AdminUser.prototype, "fcmTokens", void 0);
exports.AdminUser = AdminUser = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AdminUser);
exports.AdminUserSchema = mongoose_1.SchemaFactory.createForClass(AdminUser);
exports.AdminUserSchema.index({ email: 1 });
exports.AdminUserSchema.index({ tenantId: 1, email: 1 });
//# sourceMappingURL=admin-user.schema.js.map
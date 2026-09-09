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
exports.AreaSchema = exports.Area = exports.AreaLevelSchema = exports.AreaLevel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AreaLevel = class AreaLevel {
};
exports.AreaLevel = AreaLevel;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AreaLevel.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], AreaLevel.prototype, "levelOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AreaLevel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], AreaLevel.prototype, "isRequired", void 0);
exports.AreaLevel = AreaLevel = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AreaLevel);
exports.AreaLevelSchema = mongoose_1.SchemaFactory.createForClass(AreaLevel);
exports.AreaLevelSchema.index({ tenantId: 1, levelOrder: 1 }, { unique: true });
let Area = class Area {
};
exports.Area = Area;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Area.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AreaLevel', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Area.prototype, "levelId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Area.prototype, "parentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Area.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Area.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Area.prototype, "isActive", void 0);
exports.Area = Area = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Area);
exports.AreaSchema = mongoose_1.SchemaFactory.createForClass(Area);
exports.AreaSchema.index({ tenantId: 1, parentId: 1 });
exports.AreaSchema.index({ tenantId: 1, levelId: 1 });
//# sourceMappingURL=area.schema.js.map
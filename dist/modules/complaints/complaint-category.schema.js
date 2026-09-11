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
exports.DEFAULT_COMPLAINT_CATEGORIES = exports.ComplaintCategorySchema = exports.ComplaintCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ComplaintCategory = class ComplaintCategory {
};
exports.ComplaintCategory = ComplaintCategory;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ComplaintCategory.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ComplaintCategory.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ComplaintCategory.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ComplaintCategory.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ComplaintCategory.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ComplaintCategory.prototype, "order", void 0);
exports.ComplaintCategory = ComplaintCategory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ComplaintCategory);
exports.ComplaintCategorySchema = mongoose_1.SchemaFactory.createForClass(ComplaintCategory);
exports.ComplaintCategorySchema.index({ tenantId: 1, name: 1 }, { unique: true });
exports.ComplaintCategorySchema.index({ tenantId: 1, isActive: 1, order: 1 });
exports.DEFAULT_COMPLAINT_CATEGORIES = [
    { name: 'Roads & Infrastructure', description: 'Potholes, broken roads, footpaths, bridges, public construction' },
    { name: 'Electricity & Street Lights', description: 'Faulty street lights, power outages, damaged electric poles/transformers' },
    { name: 'Water Supply & Pipelines', description: 'Drinking water shortage, pipeline leakage, dirty water supply' },
    { name: 'Sanitation & Garbage', description: 'Uncollected garbage, open dumping, overflowing drains, sewer blockage' },
    { name: 'Health & Hospitals', description: 'Primary health center issues, lack of medicines, sanitation around clinics' },
    { name: 'Public Safety & Law/Order', description: 'Nuisance, dark alleys, security concerns, police reporting assistance' },
    { name: 'Education & Schools', description: 'Government school infrastructure, midday meal, teacher absenteeism' },
    { name: 'Ration & Food Security', description: 'Ration card issues, fair price shop irregularities, supply shortage' },
    { name: 'Pension & Welfare Schemes', description: 'Old age pension, widow pension, disability allowance delays' },
    { name: 'Other / Miscellaneous', description: 'Other civic grievances and local community issues' },
];
//# sourceMappingURL=complaint-category.schema.js.map
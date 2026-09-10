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
exports.EventRsvpSchema = exports.EventRsvp = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let EventRsvp = class EventRsvp {
};
exports.EventRsvp = EventRsvp;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EventRsvp.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Event', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EventRsvp.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EventRsvp.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.EventRsvpStatus),
        default: types_1.EventRsvpStatus.GOING,
    }),
    __metadata("design:type", String)
], EventRsvp.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, index: true }),
    __metadata("design:type", String)
], EventRsvp.prototype, "ticketNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], EventRsvp.prototype, "qrData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], EventRsvp.prototype, "isCheckedIn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], EventRsvp.prototype, "checkedInAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'AdminUser', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], EventRsvp.prototype, "checkedInBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], EventRsvp.prototype, "notes", void 0);
exports.EventRsvp = EventRsvp = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], EventRsvp);
exports.EventRsvpSchema = mongoose_1.SchemaFactory.createForClass(EventRsvp);
exports.EventRsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });
exports.EventRsvpSchema.index({ tenantId: 1, ticketNumber: 1 });
exports.EventRsvpSchema.index({ eventId: 1, isCheckedIn: 1 });
exports.EventRsvpSchema.index({ tenantId: 1, eventId: 1, status: 1 });
//# sourceMappingURL=event-rsvp.schema.js.map
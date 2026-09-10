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
exports.PollVoteSchema = exports.PollVote = exports.PollSchema = exports.Poll = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../../shared/types");
let Poll = class Poll {
};
exports.Poll = Poll;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Poll.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Poll.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Poll.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'General' }),
    __metadata("design:type", String)
], Poll.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ optionId: String, text: String, votes: { type: Number, default: 0 } }],
        required: true,
    }),
    __metadata("design:type", Array)
], Poll.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Poll.prototype, "targetAreaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.PollTargetAudience),
        default: types_1.PollTargetAudience.ALL,
    }),
    __metadata("design:type", String)
], Poll.prototype, "targetAudience", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Poll.prototype, "targetGender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Poll.prototype, "targetMinAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Poll.prototype, "targetMaxAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(types_1.PollResultVisibility),
        default: types_1.PollResultVisibility.AFTER_VOTE,
    }),
    __metadata("design:type", String)
], Poll.prototype, "resultVisibility", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Poll.prototype, "allowRevote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Poll.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Poll.prototype, "startsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Poll.prototype, "endsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Poll.prototype, "totalVotes", void 0);
exports.Poll = Poll = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Poll);
exports.PollSchema = mongoose_1.SchemaFactory.createForClass(Poll);
exports.PollSchema.index({ tenantId: 1, isActive: 1 });
exports.PollSchema.index({ tenantId: 1, category: 1 });
exports.PollSchema.index({ tenantId: 1, targetAreaId: 1 });
let PollVote = class PollVote {
};
exports.PollVote = PollVote;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Tenant', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PollVote.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Poll', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PollVote.prototype, "pollId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PollVote.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PollVote.prototype, "optionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Area', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PollVote.prototype, "areaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], PollVote.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], PollVote.prototype, "age", void 0);
exports.PollVote = PollVote = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PollVote);
exports.PollVoteSchema = mongoose_1.SchemaFactory.createForClass(PollVote);
exports.PollVoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });
exports.PollVoteSchema.index({ pollId: 1, optionId: 1 });
exports.PollVoteSchema.index({ pollId: 1, areaId: 1 });
//# sourceMappingURL=poll.schema.js.map
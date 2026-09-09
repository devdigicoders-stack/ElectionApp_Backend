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
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const poll_schema_1 = require("./poll.schema");
const uuid_1 = require("uuid");
let PollsService = class PollsService {
    constructor(pollModel, voteModel) {
        this.pollModel = pollModel;
        this.voteModel = voteModel;
    }
    async create(tenant, data) {
        const options = data.options.map((text) => ({ optionId: (0, uuid_1.v4)(), text, votes: 0 }));
        return this.pollModel.create({ tenantId: tenant._id, ...data, options });
    }
    async findAll(tenant, userAreaId) {
        const query = { tenantId: tenant._id, isActive: true };
        if (userAreaId) {
            query.$or = [{ targetAreaId: null }, { targetAreaId: new mongoose_2.Types.ObjectId(userAreaId) }];
        }
        return this.pollModel.find(query).sort({ createdAt: -1 });
    }
    async findOne(tenant, id) {
        const poll = await this.pollModel.findOne({ _id: id, tenantId: tenant._id });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        return poll;
    }
    async vote(tenant, pollId, userId, optionId) {
        const poll = await this.pollModel.findOne({ _id: pollId, tenantId: tenant._id, isActive: true });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found or inactive');
        if (poll.endsAt && poll.endsAt < new Date())
            throw new common_1.BadRequestException('Poll has ended');
        const option = poll.options.find((o) => o.optionId === optionId);
        if (!option)
            throw new common_1.BadRequestException('Invalid option');
        const existing = await this.voteModel.findOne({ pollId, userId });
        if (existing)
            throw new common_1.BadRequestException('You have already voted');
        await this.voteModel.create({ tenantId: tenant._id, pollId, userId, optionId });
        await this.pollModel.updateOne({ _id: pollId, 'options.optionId': optionId }, { $inc: { 'options.$.votes': 1, totalVotes: 1 } });
        return { message: 'Vote recorded' };
    }
    async getUserVote(pollId, userId) {
        return this.voteModel.findOne({ pollId, userId });
    }
    async update(tenant, id, data) {
        return this.pollModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
    }
    async remove(tenant, id) {
        return this.pollModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
};
exports.PollsService = PollsService;
exports.PollsService = PollsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(poll_schema_1.Poll.name)),
    __param(1, (0, mongoose_1.InjectModel)(poll_schema_1.PollVote.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PollsService);
//# sourceMappingURL=polls.service.js.map
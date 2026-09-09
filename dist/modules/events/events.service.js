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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_schema_1 = require("./event.schema");
const event_rsvp_schema_1 = require("./event-rsvp.schema");
const types_1 = require("../../shared/types");
let EventsService = class EventsService {
    constructor(eventModel, rsvpModel) {
        this.eventModel = eventModel;
        this.rsvpModel = rsvpModel;
    }
    async create(tenant, data) {
        return this.eventModel.create({ tenantId: tenant._id, ...data });
    }
    async findAll(tenant, filters) {
        const { upcoming, areaId, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id, isPublished: true };
        if (upcoming)
            query.startDate = { $gte: new Date() };
        if (areaId)
            query.areaId = areaId;
        const [data, total] = await Promise.all([
            this.eventModel.find(query).populate('areaId', 'name').sort({ startDate: 1 }).skip((page - 1) * limit).limit(limit),
            this.eventModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async findOne(tenant, id) {
        const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id }).populate('areaId', 'name');
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return event;
    }
    async update(tenant, id, data) {
        const event = await this.eventModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        return event;
    }
    async remove(tenant, id) {
        return this.eventModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
    async rsvp(tenant, eventId, userId, status) {
        const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const existing = await this.rsvpModel.findOne({ eventId, userId });
        if (existing) {
            if (existing.status === types_1.EventRsvpStatus.GOING)
                event.goingCount = Math.max(0, event.goingCount - 1);
            if (existing.status === types_1.EventRsvpStatus.INTERESTED)
                event.interestedCount = Math.max(0, event.interestedCount - 1);
            existing.status = status;
            await existing.save();
        }
        else {
            await this.rsvpModel.create({ tenantId: tenant._id, eventId, userId, status });
        }
        if (status === types_1.EventRsvpStatus.GOING)
            event.goingCount += 1;
        if (status === types_1.EventRsvpStatus.INTERESTED)
            event.interestedCount += 1;
        await event.save();
        return { message: 'RSVP updated', status };
    }
    async getUserRsvp(eventId, userId) {
        return this.rsvpModel.findOne({ eventId, userId });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(1, (0, mongoose_1.InjectModel)(event_rsvp_schema_1.EventRsvp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EventsService);
//# sourceMappingURL=events.service.js.map
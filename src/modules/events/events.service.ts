import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { EventRsvp, EventRsvpDocument } from './event-rsvp.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { EventRsvpStatus } from '../../shared/types';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventRsvp.name) private rsvpModel: Model<EventRsvpDocument>,
  ) {}

  async create(tenant: TenantDocument, data: any) {
    return this.eventModel.create({ tenantId: tenant._id, ...data });
  }

  async findAll(tenant: TenantDocument, filters: { upcoming?: boolean; areaId?: string; page?: number; limit?: number }) {
    const { upcoming, areaId, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id, isPublished: true };
    if (upcoming) query.startDate = { $gte: new Date() };
    if (areaId) query.areaId = areaId;

    const [data, total] = await Promise.all([
      this.eventModel.find(query).populate('areaId', 'name').sort({ startDate: 1 }).skip((page - 1) * limit).limit(limit),
      this.eventModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findOne(tenant: TenantDocument, id: string) {
    const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id }).populate('areaId', 'name');
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    const event = await this.eventModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.eventModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }

  async rsvp(tenant: TenantDocument, eventId: string, userId: string, status: EventRsvpStatus) {
    const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    const existing = await this.rsvpModel.findOne({ eventId, userId });

    if (existing) {
      // Update counts
      if (existing.status === EventRsvpStatus.GOING) event.goingCount = Math.max(0, event.goingCount - 1);
      if (existing.status === EventRsvpStatus.INTERESTED) event.interestedCount = Math.max(0, event.interestedCount - 1);
      existing.status = status;
      await existing.save();
    } else {
      await this.rsvpModel.create({ tenantId: tenant._id, eventId, userId, status });
    }

    if (status === EventRsvpStatus.GOING) event.goingCount += 1;
    if (status === EventRsvpStatus.INTERESTED) event.interestedCount += 1;
    await event.save();

    return { message: 'RSVP updated', status };
  }

  async getUserRsvp(eventId: string, userId: string) {
    return this.rsvpModel.findOne({ eventId, userId });
  }
}

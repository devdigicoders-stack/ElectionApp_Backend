import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { EventRsvp, EventRsvpDocument } from './event-rsvp.schema';
import { User, UserDocument } from '../users/user.schema';
import { Area, AreaDocument } from '../areas/area.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { EventRsvpStatus, EventStatus, EventType } from '../../shared/types';
import { CreateEventDto, UpdateEventDto, QueryEventsDto, RsvpEventDto, CheckInEventDto } from './events.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import * as QRCode from 'qrcode';
import { Response } from 'express';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventRsvp.name) private rsvpModel: Model<EventRsvpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @Optional() private auditLogsService?: AuditLogsService,
  ) {}

  /**
   * Helper to generate unique event ticket pass number (e.g. "EVT-2026-582914")
   */
  private generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `EVT-${year}-${random}`;
  }

  /**
   * Auto-seed default realistic political & community events for a tenant if none exist.
   * Ensures new/demo clients have immediate data matching SRS Sec 18.
   */
  async seedDefaultEventsIfEmpty(tenant: TenantDocument) {
    await this.eventModel.updateMany(
      { tenantId: tenant._id, isActive: { $exists: false } },
      { $set: { isActive: true, isPublished: true, category: EventType.JAN_SABHA } },
    );

    const count = await this.eventModel.countDocuments({ tenantId: tenant._id });
    if (count > 0) return;

    this.logger.log(`Seeding default events for tenant "${tenant.slug}"...`);

    const now = Date.now();
    const sampleEvents = [
      {
        tenantId: tenant._id,
        title: 'Vikas Jan Sabha: Constituency Infrastructure & Road Network Review',
        description: 'Join our honorable leader for an open public dialogue and review of ongoing road connectivity, flyovers, and drinking water pipeline projects in the constituency.',
        category: EventType.JAN_SABHA,
        startDate: new Date(now + 5 * 24 * 60 * 60 * 1000), // In 5 days
        startTime: '10:30 AM',
        endTime: '02:00 PM',
        location: 'Panchayat Bhavan Ground, Main Road',
        mapLink: 'https://maps.google.com/?q=Panchayat+Bhavan',
        registrationRequired: true,
        maximumParticipants: 500,
        registeredCount: 0,
        checkedInCount: 0,
        interestedCount: 0,
        goingCount: 0,
        status: EventStatus.UPCOMING,
        organizerName: 'District Campaign Committee',
        organizerPhone: '+91 98765 43210',
        tags: ['Jan Sabha', 'Development', 'Infrastructure', 'Roads'],
        isPublished: true,
        isActive: true,
      },
      {
        tenantId: tenant._id,
        title: 'Yuva Sankalp Mega Rally & Digital Platform Launch',
        description: 'Empowering the youth with digital skills, education fellowships, and volunteer leadership opportunities across all wards.',
        category: EventType.RALLY,
        startDate: new Date(now + 12 * 24 * 60 * 60 * 1000), // In 12 days
        startTime: '04:00 PM',
        endTime: '08:00 PM',
        location: 'Chhatrapati Shivaji Sports Stadium, Ward 12',
        mapLink: 'https://maps.google.com/?q=Stadium',
        registrationRequired: true,
        maximumParticipants: 2000,
        registeredCount: 0,
        checkedInCount: 0,
        interestedCount: 0,
        goingCount: 0,
        status: EventStatus.UPCOMING,
        organizerName: 'Youth Front Coordinator',
        organizerPhone: '+91 98765 12345',
        tags: ['Youth', 'Rally', 'Digital Leadership', 'Sports'],
        isPublished: true,
        isActive: true,
      },
      {
        tenantId: tenant._id,
        title: 'Kisan Samvad: Public Meeting on Solar Pumps & Crop Insurance Subsidies',
        description: 'Direct interactive consultation with agricultural experts and administration officers on subsidy disbursements and solar borewell installations.',
        category: EventType.PUBLIC_MEETING,
        startDate: new Date(now + 20 * 24 * 60 * 60 * 1000), // In 20 days
        startTime: '11:00 AM',
        endTime: '01:30 PM',
        location: 'Krishi Upaj Mandi Complex, Gate No. 2',
        mapLink: 'https://maps.google.com/?q=Krishi+Mandi',
        registrationRequired: false,
        registeredCount: 0,
        checkedInCount: 0,
        interestedCount: 0,
        goingCount: 0,
        status: EventStatus.UPCOMING,
        organizerName: 'Kisan Morcha Cell',
        organizerPhone: '+91 98765 67890',
        tags: ['Farmers', 'Agriculture', 'Public Meeting', 'Welfare'],
        isPublished: true,
        isActive: true,
      },
    ];

    await this.eventModel.insertMany(sampleEvents);
  }

  /**
   * Create a new event (Admin / Leader / Content Manager)
   */
  async create(tenant: TenantDocument, dto: CreateEventDto) {
    const startDate = new Date(dto.startDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;

    if (endDate && endDate < startDate) {
      throw new BadRequestException('Event end date cannot be earlier than the start date');
    }

    const areaId = dto.areaId ? new Types.ObjectId(dto.areaId) : undefined;

    const event = await this.eventModel.create({
      tenantId: tenant._id,
      title: dto.title.trim(),
      description: dto.description || '',
      category: dto.category || EventType.JAN_SABHA,
      bannerUrl: dto.bannerUrl || undefined,
      startDate,
      endDate,
      startTime: dto.startTime || '',
      endTime: dto.endTime || '',
      location: dto.location || '',
      mapLink: dto.mapLink || undefined,
      areaId,
      images: dto.images || [],
      registrationRequired: dto.registrationRequired ?? false,
      maximumParticipants: dto.maximumParticipants || undefined,
      registeredCount: 0,
      checkedInCount: 0,
      interestedCount: 0,
      goingCount: 0,
      status: dto.status || EventStatus.UPCOMING,
      organizerName: dto.organizerName || '',
      organizerPhone: dto.organizerPhone || '',
      tags: dto.tags || [],
      isPublished: dto.isPublished ?? true,
      isActive: true,
    });

    return event;
  }

  /**
   * List events with rich filtering, search, and user RSVP status
   */
  async findAll(tenant: TenantDocument, queryDto: QueryEventsDto, user?: any, isAdmin: boolean = false) {
    await this.seedDefaultEventsIfEmpty(tenant);

    const filter: any = { tenantId: tenant._id };

    if (!isAdmin) {
      filter.isActive = { $ne: false };
      filter.isPublished = { $ne: false };
    }

    if (queryDto.category) {
      filter.category = queryDto.category;
    }

    if (queryDto.areaId) {
      filter.areaId = new Types.ObjectId(queryDto.areaId);
    }

    if (queryDto.status && queryDto.status !== 'all') {
      filter.status = queryDto.status;
    }

    if (queryDto.upcoming === 'true') {
      filter.startDate = { $gte: new Date() };
    } else if (queryDto.upcoming === 'false') {
      filter.startDate = { $lt: new Date() };
    }

    if (queryDto.search) {
      filter.$or = [
        { title: { $regex: queryDto.search, $options: 'i' } },
        { description: { $regex: queryDto.search, $options: 'i' } },
        { location: { $regex: queryDto.search, $options: 'i' } },
        { tags: { $in: [new RegExp(queryDto.search, 'i')] } },
      ];
    }

    const page = Math.max(1, Number(queryDto.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryDto.limit) || 20));
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .populate('areaId', 'name code')
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit),
      this.eventModel.countDocuments(filter),
    ]);

    // Attach user RSVP status if authenticated
    let userRsvpMap = new Map<string, any>();
    if (user?.sub) {
      const eventIds = events.map((e) => e._id);
      const userRsvps = await this.rsvpModel.find({
        tenantId: tenant._id,
        userId: new Types.ObjectId(user.sub),
        eventId: { $in: eventIds },
      });
      userRsvps.forEach((r) => userRsvpMap.set(r.eventId.toString(), r));
    }

    const items = events.map((e) => {
      const userRsvp = userRsvpMap.get(e._id.toString());
      const isFull = Boolean(e.maximumParticipants && e.registeredCount >= e.maximumParticipants);

      return {
        _id: e._id,
        title: e.title,
        description: e.description,
        category: e.category,
        bannerUrl: e.bannerUrl,
        startDate: e.startDate,
        endDate: e.endDate,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        mapLink: e.mapLink,
        area: e.areaId,
        images: e.images,
        registrationRequired: e.registrationRequired,
        maximumParticipants: e.maximumParticipants || null,
        isFull,
        registeredCount: e.registeredCount,
        interestedCount: e.interestedCount,
        goingCount: e.goingCount,
        status: e.status,
        organizerName: e.organizerName,
        organizerPhone: e.organizerPhone,
        tags: e.tags,
        isPublished: e.isPublished,
        hasRsvp: Boolean(userRsvp),
        myRsvp: userRsvp
          ? {
              status: userRsvp.status,
              ticketNumber: userRsvp.ticketNumber,
              isCheckedIn: userRsvp.isCheckedIn,
            }
          : null,
        createdAt: (e as any).createdAt,
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single event details with full status and user registration status
   */
  async findOne(tenant: TenantDocument, id: string, user?: any) {
    let event = null;

    if (Types.ObjectId.isValid(id)) {
      event = await this.eventModel
        .findOne({
          _id: new Types.ObjectId(id),
          $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
        })
        .populate('areaId', 'name code');
    }

    if (!event) {
      const candidate = await this.eventModel.findById(id).populate('areaId', 'name code');
      if (candidate && candidate.tenantId && candidate.tenantId.toString() === tenant._id.toString()) {
        event = candidate;
      }
    }

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let userRsvp: EventRsvpDocument | null = null;
    if (user?.sub) {
      const userObjectId = Types.ObjectId.isValid(user.sub) ? new Types.ObjectId(user.sub) : user.sub;
      userRsvp = await this.rsvpModel.findOne({
        tenantId: tenant._id,
        $or: [
          { eventId: event._id, userId: userObjectId },
          { eventId: event._id.toString(), userId: user.sub },
          { eventId: event._id, userId: user.sub },
          { eventId: event._id.toString(), userId: userObjectId },
        ],
      });
    }

    const isFull = Boolean(event.maximumParticipants && event.registeredCount >= event.maximumParticipants);

    return {
      _id: event._id,
      title: event.title,
      description: event.description,
      category: event.category,
      bannerUrl: event.bannerUrl,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      mapLink: event.mapLink,
      area: event.areaId,
      images: event.images,
      registrationRequired: event.registrationRequired,
      maximumParticipants: event.maximumParticipants || null,
      isFull,
      registeredCount: event.registeredCount,
      checkedInCount: event.checkedInCount,
      interestedCount: event.interestedCount,
      goingCount: event.goingCount,
      status: event.status,
      organizerName: event.organizerName,
      organizerPhone: event.organizerPhone,
      tags: event.tags,
      isPublished: event.isPublished,
      hasRsvp: Boolean(userRsvp),
      myRsvp: userRsvp
        ? {
            status: userRsvp.status,
            ticketNumber: userRsvp.ticketNumber,
            isCheckedIn: userRsvp.isCheckedIn,
            checkedInAt: userRsvp.checkedInAt,
            notes: userRsvp.notes,
          }
        : null,
      createdAt: (event as any).createdAt,
      updatedAt: (event as any).updatedAt,
    };
  }

  /**
   * Cast or update RSVP for an event (Citizen)
   * Supports 'interested', 'going', and 'not_going'.
   * Generates ticketNumber and QR verification string when marking 'going'.
   */
  async rsvp(tenant: TenantDocument, eventId: string, userId: string, dto: RsvpEventDto) {
    const event = await this.eventModel.findOne({
      _id: eventId,
      tenantId: tenant._id,
      isActive: true,
    });

    if (!event) {
      throw new NotFoundException('Event not found or inactive');
    }

    if (event.status === EventStatus.CANCELLED) {
      throw new BadRequestException('This event has been cancelled');
    }

    const user = await this.userModel.findOne({ _id: userId, tenantId: tenant._id });
    if (!user) {
      throw new NotFoundException('User record not found');
    }

    const existing = await this.rsvpModel.findOne({
      tenantId: tenant._id,
      $or: [
        { eventId: event._id, userId: user._id },
        { eventId: event._id.toString(), userId: user._id.toString() },
        { eventId: event._id, userId: user._id.toString() },
        { eventId: event._id.toString(), userId: user._id },
      ],
    });

    const newStatus = dto.status;
    const oldStatus = existing ? existing.status : null;

    // Check capacity limit if transitioning to 'going'
    if (newStatus === EventRsvpStatus.GOING && oldStatus !== EventRsvpStatus.GOING) {
      if (event.maximumParticipants && event.registeredCount >= event.maximumParticipants) {
        throw new BadRequestException(
          `Event registration is full. Maximum participant capacity (${event.maximumParticipants}) has been reached.`,
        );
      }
    }

    // Decrement old status counters
    if (oldStatus === EventRsvpStatus.GOING && newStatus !== EventRsvpStatus.GOING) {
      event.goingCount = Math.max(0, event.goingCount - 1);
      event.registeredCount = Math.max(0, event.registeredCount - 1);
    } else if (oldStatus === EventRsvpStatus.INTERESTED && newStatus !== EventRsvpStatus.INTERESTED) {
      event.interestedCount = Math.max(0, event.interestedCount - 1);
    }

    // Increment new status counters
    if (newStatus === EventRsvpStatus.GOING && oldStatus !== EventRsvpStatus.GOING) {
      event.goingCount += 1;
      event.registeredCount += 1;
    } else if (newStatus === EventRsvpStatus.INTERESTED && oldStatus !== EventRsvpStatus.INTERESTED) {
      event.interestedCount += 1;
    }

    await event.save();

    // Prepare ticket pass if going
    let ticketNumber = existing?.ticketNumber;
    let qrData = existing?.qrData;

    if (newStatus === EventRsvpStatus.GOING && !ticketNumber) {
      ticketNumber = this.generateTicketNumber();
      qrData = JSON.stringify({
        ticketNumber,
        eventId: event._id.toString(),
        userId: user._id.toString(),
        tenantSlug: tenant.slug,
      });
    }

    if (existing) {
      existing.status = newStatus;
      if (ticketNumber) existing.ticketNumber = ticketNumber;
      if (qrData) existing.qrData = qrData;
      if (dto.notes !== undefined) existing.notes = dto.notes;
      await existing.save();

      return {
        message: `RSVP updated to "${newStatus}"`,
        status: newStatus,
        ticketNumber: existing.ticketNumber || null,
        isCheckedIn: existing.isCheckedIn,
      };
    }

    const newRsvp = await this.rsvpModel.create({
      tenantId: tenant._id,
      eventId: event._id,
      userId: user._id,
      status: newStatus,
      ticketNumber,
      qrData,
      notes: dto.notes || '',
      isCheckedIn: false,
    });

    return {
      message: `RSVP recorded as "${newStatus}"`,
      status: newStatus,
      ticketNumber: newRsvp.ticketNumber || null,
      isCheckedIn: false,
    };
  }

  /**
   * Get authenticated user's RSVP status for an event
   */
  async getUserRsvp(tenant: TenantDocument, eventId: string, userId: string) {
    const eventObjectId = Types.ObjectId.isValid(eventId) ? new Types.ObjectId(eventId) : eventId;
    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;

    const rsvp = await this.rsvpModel.findOne({
      tenantId: tenant._id,
      $or: [
        { eventId: eventObjectId, userId: userObjectId },
        { eventId: eventId, userId: userId },
        { eventId: eventObjectId, userId: userId },
        { eventId: eventId, userId: userObjectId },
      ],
    });

    if (!rsvp) {
      return { hasRsvp: false, status: null, ticketNumber: null };
    }

    return {
      hasRsvp: true,
      status: rsvp.status,
      ticketNumber: rsvp.ticketNumber,
      isCheckedIn: rsvp.isCheckedIn,
      checkedInAt: rsvp.checkedInAt,
      createdAt: (rsvp as any).createdAt,
    };
  }

  /**
   * Get Digital Event Pass / Ticket with scannable QR Code (SRS Sec 18)
   */
  async getEventTicket(tenant: TenantDocument, eventId: string, userId: string, isAdmin = false) {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID format');
    }

    const event = await this.eventModel.findOne({
      _id: new Types.ObjectId(eventId),
      tenantId: tenant._id,
    });
    if (!event) throw new NotFoundException('Event not found');

    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;

    let rsvp = await this.rsvpModel
      .findOne({
        tenantId: tenant._id,
        $or: [
          { eventId: event._id, userId: userObjectId },
          { eventId: event._id.toString(), userId: userId },
          { eventId: event._id, userId: userId },
          { eventId: event._id.toString(), userId: userObjectId },
        ],
        status: EventRsvpStatus.GOING,
      })
      .populate('userId', 'name mobile email profilePhoto');

    // If caller is Admin/Leader/Manager and no personal RSVP exists, fallback to latest attendee ticket
    if (!rsvp && isAdmin) {
      rsvp = await this.rsvpModel
        .findOne({
          tenantId: tenant._id,
          eventId: event._id,
          status: EventRsvpStatus.GOING,
        })
        .sort({ createdAt: -1 })
        .populate('userId', 'name mobile email profilePhoto');
    }

    if (!rsvp) {
      throw new NotFoundException(
        'No confirmed registration / ticket found for this event. Please mark RSVP "Going" first.',
      );
    }

    // Auto-generate ticketNumber and qrData if missing (e.g. from legacy records)
    if (!rsvp.ticketNumber) {
      rsvp.ticketNumber = this.generateTicketNumber();
      rsvp.qrData = JSON.stringify({
        ticketNumber: rsvp.ticketNumber,
        eventId: event._id.toString(),
        userId: userId.toString(),
        tenantSlug: tenant.slug,
      });
      (rsvp as any).eventId = event._id;
      (rsvp as any).userId = userObjectId;
      await rsvp.save();
    }

    let attendeeUser: any = rsvp.userId;
    if (!attendeeUser || !attendeeUser._id || typeof attendeeUser === 'string') {
      attendeeUser = (await this.userModel.findById(userId).select('name mobile email profilePhoto')) || {};
    }

    // Generate high-resolution scannable QR code DataURL
    const qrPayload = JSON.stringify({
      ticketNumber: rsvp.ticketNumber,
      eventId: event._id.toString(),
      userId: attendeeUser._id?.toString() || userId,
      tenant: tenant.slug,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    return {
      ticketNumber: rsvp.ticketNumber,
      isCheckedIn: rsvp.isCheckedIn,
      checkedInAt: rsvp.checkedInAt || null,
      event: {
        _id: event._id,
        title: event.title,
        category: event.category,
        startDate: event.startDate,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        mapLink: event.mapLink,
        bannerUrl: event.bannerUrl,
      },
      attendee: {
        name: attendeeUser.name || 'Citizen Attendee',
        mobile: attendeeUser.mobile || 'N/A',
        email: attendeeUser.email || null,
      },
      tenant: {
        slug: tenant.slug,
        name: tenant.branding?.leaderName || tenant.name,
      },
      qrCodeDataUrl,
    };
  }

  /**
   * Quick Lookup for QR Check-in scanner (Admin / Volunteer)
   */
  async lookupTicket(tenant: TenantDocument, eventId: string, ticketNumber: string) {
    const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    const rsvp = await this.rsvpModel
      .findOne({
        tenantId: tenant._id,
        eventId: event._id,
        ticketNumber: ticketNumber.trim(),
      })
      .populate('userId', 'name mobile gender profilePhoto');

    if (!rsvp) {
      throw new NotFoundException(`Invalid ticket number "${ticketNumber}" for this event`);
    }

    const user: any = rsvp.userId || {};

    return {
      isValid: true,
      ticketNumber: rsvp.ticketNumber,
      status: rsvp.status,
      isCheckedIn: rsvp.isCheckedIn,
      checkedInAt: rsvp.checkedInAt || null,
      attendee: {
        _id: user._id,
        name: user.name || 'Citizen Attendee',
        mobile: user.mobile || 'N/A',
        gender: user.gender || 'Unspecified',
      },
      event: {
        _id: event._id,
        title: event.title,
        startDate: event.startDate,
      },
    };
  }

  /**
   * QR-based Event Entry Check-in (SRS Sec 18)
   */
  async checkInAttendee(tenant: TenantDocument, eventId: string, dto: CheckInEventDto, adminUser: any) {
    const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    const rsvp = await this.rsvpModel
      .findOne({
        tenantId: tenant._id,
        eventId: event._id,
        ticketNumber: dto.ticketNumber.trim(),
      })
      .populate('userId', 'name mobile');

    if (!rsvp) {
      throw new NotFoundException(`Ticket "${dto.ticketNumber}" not found for this event`);
    }

    if (rsvp.isCheckedIn) {
      const timeStr = rsvp.checkedInAt ? new Date(rsvp.checkedInAt).toLocaleTimeString() : 'earlier';
      throw new ConflictException(
        `Attendee is already checked in at ${timeStr}. Ticket has already been used.`,
      );
    }

    rsvp.isCheckedIn = true;
    rsvp.checkedInAt = new Date();
    if (adminUser?.sub) {
      rsvp.checkedInBy = new Types.ObjectId(adminUser.sub);
    }
    if (dto.notes) {
      rsvp.notes = dto.notes;
    }
    await rsvp.save();

    // Increment checked-in count
    await this.eventModel.updateOne({ _id: event._id }, { $inc: { checkedInCount: 1 } });

    const user: any = rsvp.userId || {};

    return {
      success: true,
      message: `Check-in successful for ${user.name || 'Attendee'}`,
      ticketNumber: rsvp.ticketNumber,
      checkedInAt: rsvp.checkedInAt,
      attendee: {
        name: user.name || 'Citizen',
        mobile: user.mobile || 'N/A',
      },
    };
  }

  /**
   * Generate Pre-formatted WhatsApp Event Share Link (SRS Sec 18)
   */
  async getShareLink(tenant: TenantDocument, id: string) {
    const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    const domain = tenant.customDomain || `${tenant.slug}.localhost:3001`;
    const dateFormatted = new Date(event.startDate).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const leaderName = tenant.branding?.leaderName || 'Our Leadership Team';

    const message = [
      `📢 *Invitation: ${event.title}*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🏛 *Category:* ${event.category}`,
      `🗓 *Date:* ${dateFormatted}`,
      event.startTime ? `⏰ *Time:* ${event.startTime}${event.endTime ? ` to ${event.endTime}` : ''}` : null,
      event.location ? `📍 *Venue:* ${event.location}` : null,
      event.mapLink ? `🗺 *Google Map:* ${event.mapLink}` : null,
      ``,
      event.description ? `_${event.description}_` : null,
      ``,
      `👉 *Join & Register Pass Here:*`,
      `http://${domain}/events/${event._id}`,
      ``,
      `— Organized by ${leaderName}`,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    return {
      message,
      whatsappUrl,
      event: {
        _id: event._id,
        title: event.title,
        startDate: event.startDate,
        location: event.location,
      },
    };
  }

  /**
   * Admin Event Analytics & Attendance Dashboard (SRS Sec 18)
   */
  async getAnalytics(tenant: TenantDocument, eventId: string) {
    const event = await this.eventModel
      .findOne({ _id: eventId, tenantId: tenant._id })
      .populate('areaId', 'name code');

    if (!event) throw new NotFoundException('Event not found');

    const totalInterested = event.interestedCount || 0;
    const totalGoing = event.goingCount || 0;
    const totalRegistered = event.registeredCount || 0;
    const checkedInCount = event.checkedInCount || 0;

    const capacity = event.maximumParticipants || 0;
    const capacityUtilization =
      capacity > 0 ? Math.round((totalRegistered / capacity) * 1000) / 10 : null;

    const turnoutRate =
      totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 1000) / 10 : 0;

    // Daily RSVP registration velocity timeline
    const timelineAgg = await this.rsvpModel.aggregate([
      { $match: { tenantId: tenant._id, eventId: event._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          going: { $sum: { $cond: [{ $eq: ['$status', EventRsvpStatus.GOING] }, 1, 0] } },
          interested: { $sum: { $cond: [{ $eq: ['$status', EventRsvpStatus.INTERESTED] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const timeline = timelineAgg.map((t) => ({
      date: t._id,
      total: t.total,
      going: t.going,
      interested: t.interested,
    }));

    // Check-in status breakdown
    const checkInBreakdown = {
      registered: totalRegistered,
      checkedIn: checkedInCount,
      pendingCheckIn: Math.max(0, totalRegistered - checkedInCount),
      turnoutPercentage: turnoutRate,
    };

    return {
      event: {
        _id: event._id,
        title: event.title,
        category: event.category,
        startDate: event.startDate,
        startTime: event.startTime,
        location: event.location,
        area: event.areaId,
        status: event.status,
      },
      summary: {
        totalInterested,
        totalGoing,
        totalRegistered,
        capacity: capacity || 'Unlimited',
        capacityUtilizationPercentage: capacityUtilization,
        checkedInCount,
        turnoutPercentage: turnoutRate,
      },
      checkInBreakdown,
      timeline,
    };
  }

  /**
   * Export Event Attendees List to CSV or Excel (SRS Sec 18 & Sec 58)
   */
  async exportAttendeesCsv(
    tenant: TenantDocument,
    eventId: string,
    res: Response,
    format: string = 'csv',
    adminUser?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    const attendees = await this.rsvpModel
      .find({ tenantId: tenant._id, eventId: event._id })
      .populate('userId', 'name mobile gender areaId')
      .sort({ createdAt: -1 })
      .lean();

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const maskMobile = (mobile?: string) => {
      if (!mobile || mobile.length < 5) return 'N/A';
      return mobile.slice(0, 2) + '****' + mobile.slice(-4);
    };

    const lines: string[] = [];

    // Header metadata
    lines.push(escapeCsv('--- EVENT ATTENDEES REPORT (SRS SEC 18 & 58) ---'));
    lines.push(`${escapeCsv('Event Title')},${escapeCsv(event.title)}`);
    lines.push(`${escapeCsv('Category')},${escapeCsv(event.category)}`);
    lines.push(`${escapeCsv('Date & Time')},${escapeCsv(`${event.startDate.toISOString().split('T')[0]} ${event.startTime || ''}`)}`);
    lines.push(`${escapeCsv('Venue')},${escapeCsv(event.location || 'N/A')}`);
    lines.push(`${escapeCsv('Total Registered')},${escapeCsv(event.registeredCount)}`);
    lines.push(`${escapeCsv('Total Checked-In')},${escapeCsv(event.checkedInCount)}`);
    lines.push('');

    // Table headers
    lines.push('Ticket Number,Attendee Name,Masked Mobile,Gender,RSVP Status,Registered At,Checked In,Checked In Time');

    attendees.forEach((a: any) => {
      const user = a.userId || {};
      const regTime = a.createdAt ? new Date(a.createdAt).toISOString() : 'N/A';
      const checkInTime = a.checkedInAt ? new Date(a.checkedInAt).toISOString() : 'N/A';

      lines.push(
        [
          escapeCsv(a.ticketNumber || 'N/A'),
          escapeCsv(user.name || 'Citizen Attendee'),
          escapeCsv(maskMobile(user.mobile)),
          escapeCsv(user.gender || 'Unspecified'),
          escapeCsv(a.status),
          escapeCsv(regTime),
          escapeCsv(a.isCheckedIn ? 'YES' : 'NO'),
          escapeCsv(checkInTime),
        ].join(','),
      );
    });

    const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
    const bom = '\uFEFF';
    const csvContent = bom + lines.join('\r\n');

    const filename = `event_${event._id}_attendees.csv`;
    const contentType = isExcel
      ? 'application/vnd.ms-excel; charset=utf-8'
      : 'text/csv; charset=utf-8';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    // Audit log (SRS Sec 58 & 59)
    if (this.auditLogsService && adminUser) {
      await this.auditLogsService
        .log({
          tenantId: tenant._id,
          tenantName: tenant.name,
          action: 'DATA_EXPORT_EVENTS',
          performedBy: {
            id: adminUser.sub || adminUser.id || 'admin',
            email: adminUser.email || 'admin@platform.local',
            name: adminUser.name || 'Admin',
            role: adminUser.role || 'admin',
          },
          details: {
            format: isExcel ? 'excel' : 'csv',
            eventId: event._id.toString(),
            eventTitle: event.title,
            recordCount: attendees.length,
            filename,
          },
          ipAddress,
          userAgent,
        })
        .catch(() => {});
    }

    return res.status(200).send(csvContent);
  }

  /**
   * Update event details (Admin)
   */
  async update(tenant: TenantDocument, id: string, dto: UpdateEventDto) {
    const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    if (dto.title !== undefined) event.title = dto.title.trim();
    if (dto.description !== undefined) event.description = dto.description;
    if (dto.category !== undefined) event.category = dto.category;
    if (dto.bannerUrl !== undefined) event.bannerUrl = dto.bannerUrl;
    if (dto.startDate !== undefined) event.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) event.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    if (dto.startTime !== undefined) event.startTime = dto.startTime;
    if (dto.endTime !== undefined) event.endTime = dto.endTime;
    if (dto.location !== undefined) event.location = dto.location;
    if (dto.mapLink !== undefined) event.mapLink = dto.mapLink;
    if (dto.areaId !== undefined) event.areaId = dto.areaId ? new Types.ObjectId(dto.areaId) : undefined;
    if (dto.images !== undefined) event.images = dto.images;
    if (dto.registrationRequired !== undefined) event.registrationRequired = dto.registrationRequired;
    if (dto.maximumParticipants !== undefined) event.maximumParticipants = dto.maximumParticipants;
    if (dto.status !== undefined) event.status = dto.status;
    if (dto.organizerName !== undefined) event.organizerName = dto.organizerName;
    if (dto.organizerPhone !== undefined) event.organizerPhone = dto.organizerPhone;
    if (dto.tags !== undefined) event.tags = dto.tags;
    if (dto.isPublished !== undefined) event.isPublished = dto.isPublished;
    if (dto.isActive !== undefined) event.isActive = dto.isActive;

    return event.save();
  }

  /**
   * Remove an event and associated RSVP records (Admin)
   */
  async remove(tenant: TenantDocument, id: string) {
    const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id });
    if (!event) throw new NotFoundException('Event not found');

    await Promise.all([
      this.eventModel.deleteOne({ _id: event._id }),
      this.rsvpModel.deleteMany({ eventId: event._id }),
    ]);

    return { message: `Event #${id} and all attendee records have been deleted.` };
  }
}

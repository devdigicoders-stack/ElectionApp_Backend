"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_schema_1 = require("./event.schema");
const event_rsvp_schema_1 = require("./event-rsvp.schema");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
const types_1 = require("../../shared/types");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const QRCode = __importStar(require("qrcode"));
let EventsService = EventsService_1 = class EventsService {
    constructor(eventModel, rsvpModel, userModel, areaModel, auditLogsService) {
        this.eventModel = eventModel;
        this.rsvpModel = rsvpModel;
        this.userModel = userModel;
        this.areaModel = areaModel;
        this.auditLogsService = auditLogsService;
        this.logger = new common_1.Logger(EventsService_1.name);
    }
    generateTicketNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(100000 + Math.random() * 900000);
        return `EVT-${year}-${random}`;
    }
    async seedDefaultEventsIfEmpty(tenant) {
        await this.eventModel.updateMany({ tenantId: tenant._id, isActive: { $exists: false } }, { $set: { isActive: true, isPublished: true, category: types_1.EventType.JAN_SABHA } });
        const count = await this.eventModel.countDocuments({ tenantId: tenant._id });
        if (count > 0)
            return;
        this.logger.log(`Seeding default events for tenant "${tenant.slug}"...`);
        const now = Date.now();
        const sampleEvents = [
            {
                tenantId: tenant._id,
                title: 'Vikas Jan Sabha: Constituency Infrastructure & Road Network Review',
                description: 'Join our honorable leader for an open public dialogue and review of ongoing road connectivity, flyovers, and drinking water pipeline projects in the constituency.',
                category: types_1.EventType.JAN_SABHA,
                startDate: new Date(now + 5 * 24 * 60 * 60 * 1000),
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
                status: types_1.EventStatus.UPCOMING,
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
                category: types_1.EventType.RALLY,
                startDate: new Date(now + 12 * 24 * 60 * 60 * 1000),
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
                status: types_1.EventStatus.UPCOMING,
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
                category: types_1.EventType.PUBLIC_MEETING,
                startDate: new Date(now + 20 * 24 * 60 * 60 * 1000),
                startTime: '11:00 AM',
                endTime: '01:30 PM',
                location: 'Krishi Upaj Mandi Complex, Gate No. 2',
                mapLink: 'https://maps.google.com/?q=Krishi+Mandi',
                registrationRequired: false,
                registeredCount: 0,
                checkedInCount: 0,
                interestedCount: 0,
                goingCount: 0,
                status: types_1.EventStatus.UPCOMING,
                organizerName: 'Kisan Morcha Cell',
                organizerPhone: '+91 98765 67890',
                tags: ['Farmers', 'Agriculture', 'Public Meeting', 'Welfare'],
                isPublished: true,
                isActive: true,
            },
        ];
        await this.eventModel.insertMany(sampleEvents);
    }
    async create(tenant, dto) {
        const startDate = new Date(dto.startDate);
        const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (endDate && endDate < startDate) {
            throw new common_1.BadRequestException('Event end date cannot be earlier than the start date');
        }
        const areaId = dto.areaId ? new mongoose_2.Types.ObjectId(dto.areaId) : undefined;
        const event = await this.eventModel.create({
            tenantId: tenant._id,
            title: dto.title.trim(),
            description: dto.description || '',
            category: dto.category || types_1.EventType.JAN_SABHA,
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
            status: dto.status || types_1.EventStatus.UPCOMING,
            organizerName: dto.organizerName || '',
            organizerPhone: dto.organizerPhone || '',
            tags: dto.tags || [],
            isPublished: dto.isPublished ?? true,
            isActive: true,
        });
        return event;
    }
    async findAll(tenant, queryDto, user, isAdmin = false) {
        await this.seedDefaultEventsIfEmpty(tenant);
        const filter = { tenantId: tenant._id };
        if (!isAdmin) {
            filter.isActive = { $ne: false };
            filter.isPublished = { $ne: false };
        }
        if (queryDto.category) {
            filter.category = queryDto.category;
        }
        if (queryDto.areaId) {
            filter.areaId = new mongoose_2.Types.ObjectId(queryDto.areaId);
        }
        if (queryDto.status && queryDto.status !== 'all') {
            filter.status = queryDto.status;
        }
        if (queryDto.upcoming === 'true') {
            filter.startDate = { $gte: new Date() };
        }
        else if (queryDto.upcoming === 'false') {
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
        let userRsvpMap = new Map();
        if (user?.sub) {
            const eventIds = events.map((e) => e._id);
            const userRsvps = await this.rsvpModel.find({
                tenantId: tenant._id,
                userId: new mongoose_2.Types.ObjectId(user.sub),
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
                createdAt: e.createdAt,
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
    async findOne(tenant, id, user) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Event not found for id: ${id}`);
        }
        const event = await this.eventModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate('areaId', 'name code');
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        let userRsvp = null;
        if (user?.sub) {
            const userObjectId = mongoose_2.Types.ObjectId.isValid(user.sub) ? new mongoose_2.Types.ObjectId(user.sub) : user.sub;
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
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    }
    async rsvp(tenant, eventId, userId, dto) {
        const event = await this.eventModel.findOne({
            _id: eventId,
            tenantId: tenant._id,
            isActive: true,
        });
        if (!event) {
            throw new common_1.NotFoundException('Event not found or inactive');
        }
        if (event.status === types_1.EventStatus.CANCELLED) {
            throw new common_1.BadRequestException('This event has been cancelled');
        }
        const user = await this.userModel.findOne({ _id: userId, tenantId: tenant._id });
        if (!user) {
            throw new common_1.NotFoundException('User record not found');
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
        if (newStatus === types_1.EventRsvpStatus.GOING && oldStatus !== types_1.EventRsvpStatus.GOING) {
            if (event.maximumParticipants && event.registeredCount >= event.maximumParticipants) {
                throw new common_1.BadRequestException(`Event registration is full. Maximum participant capacity (${event.maximumParticipants}) has been reached.`);
            }
        }
        if (oldStatus === types_1.EventRsvpStatus.GOING && newStatus !== types_1.EventRsvpStatus.GOING) {
            event.goingCount = Math.max(0, event.goingCount - 1);
            event.registeredCount = Math.max(0, event.registeredCount - 1);
        }
        else if (oldStatus === types_1.EventRsvpStatus.INTERESTED && newStatus !== types_1.EventRsvpStatus.INTERESTED) {
            event.interestedCount = Math.max(0, event.interestedCount - 1);
        }
        if (newStatus === types_1.EventRsvpStatus.GOING && oldStatus !== types_1.EventRsvpStatus.GOING) {
            event.goingCount += 1;
            event.registeredCount += 1;
        }
        else if (newStatus === types_1.EventRsvpStatus.INTERESTED && oldStatus !== types_1.EventRsvpStatus.INTERESTED) {
            event.interestedCount += 1;
        }
        await event.save();
        let ticketNumber = existing?.ticketNumber;
        let qrData = existing?.qrData;
        if (newStatus === types_1.EventRsvpStatus.GOING && !ticketNumber) {
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
            if (ticketNumber)
                existing.ticketNumber = ticketNumber;
            if (qrData)
                existing.qrData = qrData;
            if (dto.notes !== undefined)
                existing.notes = dto.notes;
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
    async getMyGoing(tenant, userId) {
        const userObjectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
        const rsvps = await this.rsvpModel
            .find({
            tenantId: tenant._id,
            $or: [{ userId: userObjectId }, { userId: userId.toString() }],
            status: types_1.EventRsvpStatus.GOING,
        })
            .populate('eventId')
            .exec();
        return rsvps.map((r) => r.eventId).filter(Boolean);
    }
    async deleteRsvp(tenant, eventId, userId) {
        const eventObjectId = mongoose_2.Types.ObjectId.isValid(eventId) ? new mongoose_2.Types.ObjectId(eventId) : eventId;
        const userObjectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
        const rsvp = await this.rsvpModel.findOne({
            tenantId: tenant._id,
            $or: [
                { eventId: eventObjectId, userId: userObjectId },
                { eventId: eventId, userId: userId },
                { eventId: eventObjectId, userId: userId },
                { eventId: eventId, userId: userObjectId },
            ],
        });
        if (rsvp) {
            const wasGoing = rsvp.status === types_1.EventRsvpStatus.GOING;
            const wasInterested = rsvp.status === types_1.EventRsvpStatus.INTERESTED;
            await this.rsvpModel.deleteOne({ _id: rsvp._id });
            if (wasGoing) {
                await this.eventModel.updateOne({ _id: eventObjectId }, { $inc: { goingCount: -1, registeredCount: -1 } });
            }
            else if (wasInterested) {
                await this.eventModel.updateOne({ _id: eventObjectId }, { $inc: { interestedCount: -1 } });
            }
        }
        return { message: 'RSVP removed successfully' };
    }
    async getUserRsvp(tenant, eventId, userId) {
        const eventObjectId = mongoose_2.Types.ObjectId.isValid(eventId) ? new mongoose_2.Types.ObjectId(eventId) : eventId;
        const userObjectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
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
            createdAt: rsvp.createdAt,
        };
    }
    async getEventTicket(tenant, eventId, userId, isAdmin = false) {
        if (!mongoose_2.Types.ObjectId.isValid(eventId)) {
            throw new common_1.BadRequestException('Invalid event ID format');
        }
        const event = await this.eventModel.findOne({
            _id: new mongoose_2.Types.ObjectId(eventId),
            tenantId: tenant._id,
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const userObjectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
        let rsvp = await this.rsvpModel
            .findOne({
            tenantId: tenant._id,
            $or: [
                { eventId: event._id, userId: userObjectId },
                { eventId: event._id.toString(), userId: userId },
                { eventId: event._id, userId: userId },
                { eventId: event._id.toString(), userId: userObjectId },
            ],
            status: types_1.EventRsvpStatus.GOING,
        })
            .populate('userId', 'name mobile email profilePhoto');
        if (!rsvp && isAdmin) {
            rsvp = await this.rsvpModel
                .findOne({
                tenantId: tenant._id,
                eventId: event._id,
                status: types_1.EventRsvpStatus.GOING,
            })
                .sort({ createdAt: -1 })
                .populate('userId', 'name mobile email profilePhoto');
        }
        if (!rsvp) {
            throw new common_1.NotFoundException('No confirmed registration / ticket found for this event. Please mark RSVP "Going" first.');
        }
        if (!rsvp.ticketNumber) {
            rsvp.ticketNumber = this.generateTicketNumber();
            rsvp.qrData = JSON.stringify({
                ticketNumber: rsvp.ticketNumber,
                eventId: event._id.toString(),
                userId: userId.toString(),
                tenantSlug: tenant.slug,
            });
            rsvp.eventId = event._id;
            rsvp.userId = userObjectId;
            await rsvp.save();
        }
        let attendeeUser = rsvp.userId;
        if (!attendeeUser || !attendeeUser._id || typeof attendeeUser === 'string') {
            attendeeUser = (await this.userModel.findById(userId).select('name mobile email profilePhoto')) || {};
        }
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
    async lookupTicket(tenant, eventId, ticketNumber) {
        const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const rsvp = await this.rsvpModel
            .findOne({
            tenantId: tenant._id,
            eventId: event._id,
            ticketNumber: ticketNumber.trim(),
        })
            .populate('userId', 'name mobile gender profilePhoto');
        if (!rsvp) {
            throw new common_1.NotFoundException(`Invalid ticket number "${ticketNumber}" for this event`);
        }
        const user = rsvp.userId || {};
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
    async checkInAttendee(tenant, eventId, dto, adminUser) {
        const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const rsvp = await this.rsvpModel
            .findOne({
            tenantId: tenant._id,
            eventId: event._id,
            ticketNumber: dto.ticketNumber.trim(),
        })
            .populate('userId', 'name mobile');
        if (!rsvp) {
            throw new common_1.NotFoundException(`Ticket "${dto.ticketNumber}" not found for this event`);
        }
        if (rsvp.isCheckedIn) {
            const timeStr = rsvp.checkedInAt ? new Date(rsvp.checkedInAt).toLocaleTimeString() : 'earlier';
            throw new common_1.ConflictException(`Attendee is already checked in at ${timeStr}. Ticket has already been used.`);
        }
        rsvp.isCheckedIn = true;
        rsvp.checkedInAt = new Date();
        if (adminUser?.sub) {
            rsvp.checkedInBy = new mongoose_2.Types.ObjectId(adminUser.sub);
        }
        if (dto.notes) {
            rsvp.notes = dto.notes;
        }
        await rsvp.save();
        await this.eventModel.updateOne({ _id: event._id }, { $inc: { checkedInCount: 1 } });
        const user = rsvp.userId || {};
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
    async getShareLink(tenant, id) {
        const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
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
    async getAnalytics(tenant, eventId) {
        const event = await this.eventModel
            .findOne({ _id: eventId, tenantId: tenant._id })
            .populate('areaId', 'name code');
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const totalInterested = event.interestedCount || 0;
        const totalGoing = event.goingCount || 0;
        const totalRegistered = event.registeredCount || 0;
        const checkedInCount = event.checkedInCount || 0;
        const capacity = event.maximumParticipants || 0;
        const capacityUtilization = capacity > 0 ? Math.round((totalRegistered / capacity) * 1000) / 10 : null;
        const turnoutRate = totalRegistered > 0 ? Math.round((checkedInCount / totalRegistered) * 1000) / 10 : 0;
        const timelineAgg = await this.rsvpModel.aggregate([
            { $match: { tenantId: tenant._id, eventId: event._id } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    total: { $sum: 1 },
                    going: { $sum: { $cond: [{ $eq: ['$status', types_1.EventRsvpStatus.GOING] }, 1, 0] } },
                    interested: { $sum: { $cond: [{ $eq: ['$status', types_1.EventRsvpStatus.INTERESTED] }, 1, 0] } },
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
    async exportAttendeesCsv(tenant, eventId, res, format = 'csv', adminUser, ipAddress, userAgent) {
        const event = await this.eventModel.findOne({ _id: eventId, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        const attendees = await this.rsvpModel
            .find({ tenantId: tenant._id, eventId: event._id })
            .populate('userId', 'name mobile gender areaId')
            .sort({ createdAt: -1 })
            .lean();
        const escapeCsv = (val) => {
            if (val === null || val === undefined)
                return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        };
        const maskMobile = (mobile) => {
            if (!mobile || mobile.length < 5)
                return 'N/A';
            return mobile.slice(0, 2) + '****' + mobile.slice(-4);
        };
        const lines = [];
        lines.push(escapeCsv('--- EVENT ATTENDEES REPORT (SRS SEC 18 & 58) ---'));
        lines.push(`${escapeCsv('Event Title')},${escapeCsv(event.title)}`);
        lines.push(`${escapeCsv('Category')},${escapeCsv(event.category)}`);
        lines.push(`${escapeCsv('Date & Time')},${escapeCsv(`${event.startDate.toISOString().split('T')[0]} ${event.startTime || ''}`)}`);
        lines.push(`${escapeCsv('Venue')},${escapeCsv(event.location || 'N/A')}`);
        lines.push(`${escapeCsv('Total Registered')},${escapeCsv(event.registeredCount)}`);
        lines.push(`${escapeCsv('Total Checked-In')},${escapeCsv(event.checkedInCount)}`);
        lines.push('');
        lines.push('Ticket Number,Attendee Name,Masked Mobile,Gender,RSVP Status,Registered At,Checked In,Checked In Time');
        attendees.forEach((a) => {
            const user = a.userId || {};
            const regTime = a.createdAt ? new Date(a.createdAt).toISOString() : 'N/A';
            const checkInTime = a.checkedInAt ? new Date(a.checkedInAt).toISOString() : 'N/A';
            lines.push([
                escapeCsv(a.ticketNumber || 'N/A'),
                escapeCsv(user.name || 'Citizen Attendee'),
                escapeCsv(maskMobile(user.mobile)),
                escapeCsv(user.gender || 'Unspecified'),
                escapeCsv(a.status),
                escapeCsv(regTime),
                escapeCsv(a.isCheckedIn ? 'YES' : 'NO'),
                escapeCsv(checkInTime),
            ].join(','));
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
                .catch(() => { });
        }
        return res.status(200).send(csvContent);
    }
    async update(tenant, id, dto) {
        const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (dto.title !== undefined)
            event.title = dto.title.trim();
        if (dto.description !== undefined)
            event.description = dto.description;
        if (dto.category !== undefined)
            event.category = dto.category;
        if (dto.bannerUrl !== undefined)
            event.bannerUrl = dto.bannerUrl;
        if (dto.startDate !== undefined)
            event.startDate = new Date(dto.startDate);
        if (dto.endDate !== undefined)
            event.endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (dto.startTime !== undefined)
            event.startTime = dto.startTime;
        if (dto.endTime !== undefined)
            event.endTime = dto.endTime;
        if (dto.location !== undefined)
            event.location = dto.location;
        if (dto.mapLink !== undefined)
            event.mapLink = dto.mapLink;
        if (dto.areaId !== undefined)
            event.areaId = dto.areaId ? new mongoose_2.Types.ObjectId(dto.areaId) : undefined;
        if (dto.images !== undefined)
            event.images = dto.images;
        if (dto.registrationRequired !== undefined)
            event.registrationRequired = dto.registrationRequired;
        if (dto.maximumParticipants !== undefined)
            event.maximumParticipants = dto.maximumParticipants;
        if (dto.status !== undefined)
            event.status = dto.status;
        if (dto.organizerName !== undefined)
            event.organizerName = dto.organizerName;
        if (dto.organizerPhone !== undefined)
            event.organizerPhone = dto.organizerPhone;
        if (dto.tags !== undefined)
            event.tags = dto.tags;
        if (dto.isPublished !== undefined)
            event.isPublished = dto.isPublished;
        if (dto.isActive !== undefined)
            event.isActive = dto.isActive;
        return event.save();
    }
    async remove(tenant, id) {
        const event = await this.eventModel.findOne({ _id: id, tenantId: tenant._id });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        await Promise.all([
            this.eventModel.deleteOne({ _id: event._id }),
            this.rsvpModel.deleteMany({ eventId: event._id }),
        ]);
        return { message: `Event #${id} and all attendee records have been deleted.` };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(1, (0, mongoose_1.InjectModel)(event_rsvp_schema_1.EventRsvp.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __param(4, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], EventsService);
//# sourceMappingURL=events.service.js.map
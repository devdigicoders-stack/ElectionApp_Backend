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
exports.CitizenDashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
const work_schema_1 = require("../works/work.schema");
const event_schema_1 = require("../events/event.schema");
const event_rsvp_schema_1 = require("../events/event-rsvp.schema");
const poll_schema_1 = require("../polls/poll.schema");
const news_schema_1 = require("../news/news.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const banner_schema_1 = require("../banners/banner.schema");
const notification_schema_1 = require("../notifications/notification.schema");
const types_1 = require("../../shared/types");
let CitizenDashboardService = class CitizenDashboardService {
    constructor(userModel, areaModel, areaLevelModel, workModel, eventModel, eventRsvpModel, pollModel, pollVoteModel, newsModel, complaintModel, membershipModel, volunteerModel, bannerModel, notificationModel, notificationReadModel) {
        this.userModel = userModel;
        this.areaModel = areaModel;
        this.areaLevelModel = areaLevelModel;
        this.workModel = workModel;
        this.eventModel = eventModel;
        this.eventRsvpModel = eventRsvpModel;
        this.pollModel = pollModel;
        this.pollVoteModel = pollVoteModel;
        this.newsModel = newsModel;
        this.complaintModel = complaintModel;
        this.membershipModel = membershipModel;
        this.volunteerModel = volunteerModel;
        this.bannerModel = bannerModel;
        this.notificationModel = notificationModel;
        this.notificationReadModel = notificationReadModel;
    }
    async getCitizenUser(tenant, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const user = await this.userModel.findOne({
            _id: new mongoose_2.Types.ObjectId(userId),
            tenantId: tenant._id,
        });
        if (!user) {
            throw new common_1.NotFoundException('Citizen account not found');
        }
        return user;
    }
    async resolveUserAreaHierarchy(tenant, areaId) {
        if (!areaId) {
            return {
                hasArea: false,
                primaryArea: null,
                breadcrumbs: [],
                breadcrumbText: 'No area registered yet',
                relevantAreaIds: [],
            };
        }
        const primaryArea = await this.areaModel
            .findOne({ _id: areaId, tenantId: tenant._id })
            .populate('levelId', 'name levelOrder')
            .lean();
        if (!primaryArea) {
            return {
                hasArea: false,
                primaryArea: null,
                breadcrumbs: [],
                breadcrumbText: 'Area not found',
                relevantAreaIds: [],
            };
        }
        const chain = [primaryArea];
        let curr = primaryArea;
        while (curr.parentId) {
            const parent = await this.areaModel
                .findOne({ _id: curr.parentId, tenantId: tenant._id })
                .populate('levelId', 'name levelOrder')
                .lean();
            if (!parent)
                break;
            chain.push(parent);
            curr = parent;
        }
        const breadcrumbs = chain.reverse().map((a) => ({
            _id: a._id,
            name: a.name,
            code: a.code || null,
            levelOrder: a.levelId?.levelOrder || null,
            levelName: a.levelId?.name || (a.type || 'Area'),
        }));
        const breadcrumbText = breadcrumbs.map((b) => b.name).join(' ➔ ');
        const relevantAreaIds = chain.map((a) => a._id);
        return {
            hasArea: true,
            primaryArea: {
                _id: primaryArea._id,
                name: primaryArea.name,
                code: primaryArea.code || null,
                levelName: primaryArea.levelId?.name || 'Area',
            },
            breadcrumbs,
            breadcrumbText,
            relevantAreaIds,
        };
    }
    async getMyAreaFeed(tenant, userId) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const relevantAreaIds = hierarchy.relevantAreaIds;
        const worksFilter = { tenantId: tenant._id, isPublished: true };
        const eventsFilter = { tenantId: tenant._id, isPublished: true };
        const newsFilter = { tenantId: tenant._id, status: types_1.NewsStatus.PUBLISHED };
        const pollsFilter = { tenantId: tenant._id, isActive: true };
        const coordinatorFilter = { tenantId: tenant._id, status: 'active' };
        const complaintsFilter = {
            tenantId: tenant._id,
            status: { $in: ['in_progress', 'resolved', 'closed'] },
        };
        if (relevantAreaIds.length > 0) {
            worksFilter.areaId = { $in: relevantAreaIds };
            eventsFilter.$or = [{ areaId: { $in: relevantAreaIds } }, { areaId: null }];
            newsFilter.$or = [{ areaId: { $in: relevantAreaIds } }, { areaId: null }];
            pollsFilter.$or = [{ targetAreaId: { $in: relevantAreaIds } }, { targetAreaId: null }];
            coordinatorFilter.assignedAreaId = { $in: relevantAreaIds };
            complaintsFilter.areaId = { $in: relevantAreaIds };
        }
        const [localWorks, localEvents, localNews, localPolls, coordinators, communityComplaints] = await Promise.all([
            this.workModel
                .find(worksFilter)
                .populate('areaId', 'name code')
                .sort({ createdAt: -1 })
                .limit(6)
                .lean(),
            this.eventModel
                .find(eventsFilter)
                .populate('areaId', 'name code')
                .sort({ startDate: 1 })
                .limit(6)
                .lean(),
            this.newsModel
                .find(newsFilter)
                .populate('areaId', 'name code')
                .sort({ publishDate: -1 })
                .limit(6)
                .lean(),
            this.pollModel
                .find(pollsFilter)
                .sort({ createdAt: -1 })
                .limit(4)
                .lean(),
            this.volunteerModel
                .find(coordinatorFilter)
                .populate('userId', 'name mobile profilePhoto')
                .populate('assignedAreaId', 'name code')
                .limit(3)
                .lean(),
            this.complaintModel
                .find(complaintsFilter)
                .populate('areaId', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
                .select('complaintNumber title category status priority createdAt')
                .lean(),
        ]);
        return {
            area: hierarchy,
            localWorks: {
                total: localWorks.length,
                items: localWorks,
            },
            localEvents: {
                total: localEvents.length,
                items: localEvents,
            },
            localNews: {
                total: localNews.length,
                items: localNews,
            },
            localPolls: {
                total: localPolls.length,
                items: localPolls,
            },
            coordinators: coordinators.map((c) => ({
                _id: c._id,
                role: c.role,
                area: c.assignedAreaId?.name || null,
                name: c.userId?.name || 'Area Coordinator',
                mobile: c.userId?.mobile || null,
                photo: c.userId?.profilePhoto || null,
            })),
            communityComplaints: {
                total: communityComplaints.length,
                items: communityComplaints,
            },
        };
    }
    async getMyAreaHierarchy(tenant, userId) {
        const user = await this.getCitizenUser(tenant, userId);
        return this.resolveUserAreaHierarchy(tenant, user.areaId);
    }
    async getMyAreaWorks(tenant, userId, query) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const { page = 1, limit = 10 } = query;
        const filter = { tenantId: tenant._id, isPublished: true };
        if (hierarchy.relevantAreaIds.length > 0) {
            filter.areaId = { $in: hierarchy.relevantAreaIds };
        }
        const [items, total] = await Promise.all([
            this.workModel
                .find(filter)
                .populate('areaId', 'name code')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            this.workModel.countDocuments(filter),
        ]);
        return {
            area: hierarchy.primaryArea,
            breadcrumb: hierarchy.breadcrumbText,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            works: items,
        };
    }
    async getMyAreaEvents(tenant, userId, query) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const { page = 1, limit = 10 } = query;
        const filter = { tenantId: tenant._id, isPublished: true };
        if (hierarchy.relevantAreaIds.length > 0) {
            filter.$or = [{ areaId: { $in: hierarchy.relevantAreaIds } }, { areaId: null }];
        }
        const [events, total] = await Promise.all([
            this.eventModel
                .find(filter)
                .populate('areaId', 'name code')
                .sort({ startDate: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            this.eventModel.countDocuments(filter),
        ]);
        const eventIds = events.map((e) => e._id);
        const userRsvps = await this.eventRsvpModel
            .find({
            tenantId: tenant._id,
            userId: user._id,
            eventId: { $in: eventIds },
        })
            .lean();
        const rsvpMap = new Map(userRsvps.map((r) => [r.eventId.toString(), r.status]));
        const enriched = events.map((e) => ({
            ...e,
            myRsvp: rsvpMap.get(e._id.toString()) || null,
        }));
        return {
            area: hierarchy.primaryArea,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            events: enriched,
        };
    }
    async getMyAreaNews(tenant, userId, query) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const { page = 1, limit = 10 } = query;
        const filter = { tenantId: tenant._id, status: types_1.NewsStatus.PUBLISHED };
        if (hierarchy.relevantAreaIds.length > 0) {
            filter.$or = [{ areaId: { $in: hierarchy.relevantAreaIds } }, { areaId: null }];
        }
        const [news, total] = await Promise.all([
            this.newsModel
                .find(filter)
                .populate('areaId', 'name code')
                .sort({ publishDate: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            this.newsModel.countDocuments(filter),
        ]);
        return {
            area: hierarchy.primaryArea,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            news,
        };
    }
    async getMyAreaPolls(tenant, userId) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const filter = { tenantId: tenant._id, isActive: true };
        if (hierarchy.relevantAreaIds.length > 0) {
            filter.$or = [{ targetAreaId: { $in: hierarchy.relevantAreaIds } }, { targetAreaId: null }];
        }
        const polls = await this.pollModel.find(filter).sort({ createdAt: -1 }).limit(10).lean();
        const pollIds = polls.map((p) => p._id);
        const userVotes = await this.pollVoteModel
            .find({
            tenantId: tenant._id,
            userId: user._id,
            pollId: { $in: pollIds },
        })
            .lean();
        const voteMap = new Map(userVotes.map((v) => [v.pollId.toString(), v.optionId]));
        const enriched = polls.map((p) => ({
            ...p,
            hasVoted: voteMap.has(p._id.toString()),
            votedOptionId: voteMap.get(p._id.toString()) || null,
        }));
        return {
            area: hierarchy.primaryArea,
            total: enriched.length,
            polls: enriched,
        };
    }
    async getMyAreaCoordinator(tenant, userId) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        if (hierarchy.relevantAreaIds.length === 0) {
            return {
                hasCoordinator: false,
                message: 'No area assigned. Please set your area in your profile.',
                coordinators: [],
            };
        }
        const coordinators = await this.volunteerModel
            .find({
            tenantId: tenant._id,
            assignedAreaId: { $in: hierarchy.relevantAreaIds },
            status: types_1.VolunteerStatus.ACTIVE,
        })
            .populate('userId', 'name mobile profilePhoto email')
            .populate('assignedAreaId', 'name code')
            .lean();
        return {
            area: hierarchy.primaryArea,
            breadcrumbs: hierarchy.breadcrumbs,
            hasCoordinator: coordinators.length > 0,
            coordinators: coordinators.map((c) => ({
                _id: c._id,
                role: c.role || 'Area Coordinator',
                area: c.assignedAreaId?.name || null,
                name: c.userId?.name || 'Coordinator',
                mobile: c.userId?.mobile || null,
                email: c.userId?.email || null,
                photo: c.userId?.profilePhoto || null,
                notes: c.notes || null,
            })),
        };
    }
    async getMyAreaComplaints(tenant, userId, query) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const { page = 1, limit = 10 } = query;
        const filter = {
            tenantId: tenant._id,
            status: { $in: ['in_progress', 'resolved', 'closed'] },
        };
        if (hierarchy.relevantAreaIds.length > 0) {
            filter.areaId = { $in: hierarchy.relevantAreaIds };
        }
        const [items, total] = await Promise.all([
            this.complaintModel
                .find(filter)
                .populate('areaId', 'name code')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('complaintNumber title category status priority createdAt areaId')
                .lean(),
            this.complaintModel.countDocuments(filter),
        ]);
        return {
            area: hierarchy.primaryArea,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            complaints: items,
        };
    }
    async getCitizenDashboard(tenant, userId) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const relevantAreaIds = hierarchy.relevantAreaIds;
        const [complaintsSummary, recentComplaints, upcomingEvents, activePoll, membership, volunteer, banners, latestNews, unreadNotificationsCount,] = await Promise.all([
            Promise.all([
                this.complaintModel.countDocuments({ tenantId: tenant._id, userId: user._id }),
                this.complaintModel.countDocuments({
                    tenantId: tenant._id,
                    userId: user._id,
                    status: { $in: [types_1.ComplaintStatus.SUBMITTED, types_1.ComplaintStatus.UNDER_REVIEW, types_1.ComplaintStatus.ASSIGNED] },
                }),
                this.complaintModel.countDocuments({
                    tenantId: tenant._id,
                    userId: user._id,
                    status: types_1.ComplaintStatus.IN_PROGRESS,
                }),
                this.complaintModel.countDocuments({
                    tenantId: tenant._id,
                    userId: user._id,
                    status: types_1.ComplaintStatus.RESOLVED,
                }),
            ]),
            this.complaintModel
                .find({ tenantId: tenant._id, userId: user._id })
                .sort({ createdAt: -1 })
                .limit(3)
                .select('complaintNumber title category status priority createdAt')
                .lean(),
            this.eventModel
                .find({
                tenantId: tenant._id,
                isPublished: true,
                startDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                ...(relevantAreaIds.length > 0
                    ? { $or: [{ areaId: { $in: relevantAreaIds } }, { areaId: null }] }
                    : {}),
            })
                .sort({ startDate: 1 })
                .limit(3)
                .populate('areaId', 'name')
                .lean(),
            this.pollModel
                .findOne({
                tenantId: tenant._id,
                isActive: true,
                ...(relevantAreaIds.length > 0
                    ? { $or: [{ targetAreaId: { $in: relevantAreaIds } }, { targetAreaId: null }] }
                    : {}),
            })
                .sort({ createdAt: -1 })
                .lean(),
            this.membershipModel.findOne({ tenantId: tenant._id, userId: user._id }).lean(),
            this.volunteerModel
                .findOne({ tenantId: tenant._id, userId: user._id, status: types_1.VolunteerStatus.ACTIVE })
                .populate('assignedAreaId', 'name code')
                .lean(),
            this.bannerModel
                .find({ tenantId: tenant._id, isActive: true })
                .sort({ sortOrder: 1 })
                .limit(5)
                .lean(),
            this.newsModel
                .find({
                tenantId: tenant._id,
                status: types_1.NewsStatus.PUBLISHED,
                ...(relevantAreaIds.length > 0
                    ? { $or: [{ areaId: { $in: relevantAreaIds } }, { areaId: null }] }
                    : {}),
            })
                .sort({ publishDate: -1 })
                .limit(3)
                .select('title slug shortDescription coverImageUrl category publishDate')
                .lean(),
            this.notificationModel.countDocuments({
                tenantId: tenant._id,
                isSent: true,
            }),
        ]);
        const eventIds = upcomingEvents.map((e) => e._id);
        const rsvps = await this.eventRsvpModel
            .find({
            tenantId: tenant._id,
            userId: user._id,
            eventId: { $in: eventIds },
        })
            .lean();
        const rsvpMap = new Map(rsvps.map((r) => [r.eventId.toString(), r.status]));
        const enrichedEvents = upcomingEvents.map((e) => ({
            ...e,
            myRsvp: rsvpMap.get(e._id.toString()) || null,
        }));
        let pollStatus = null;
        if (activePoll) {
            const userVote = await this.pollVoteModel.findOne({
                tenantId: tenant._id,
                userId: user._id,
                pollId: activePoll._id,
            });
            pollStatus = {
                ...activePoll,
                hasVoted: Boolean(userVote),
                votedOptionId: userVote ? userVote.optionId : null,
            };
        }
        const quickActions = [
            {
                id: 'complaint',
                label: 'जन समस्या दर्ज करें',
                labelEn: 'Lodge Complaint',
                icon: 'complaint',
                route: '/complaints/new',
            },
            {
                id: 'works',
                label: 'विकास कार्य देखें',
                labelEn: 'Our Works',
                icon: 'works',
                route: '/works',
            },
            {
                id: 'events',
                label: 'आगामी कार्यक्रम',
                labelEn: 'Upcoming Events',
                icon: 'event',
                route: '/events',
            },
            {
                id: 'membership',
                label: 'सदस्यता पहचान पत्र',
                labelEn: 'Membership Card',
                icon: 'card',
                route: '/membership',
            },
            {
                id: 'poster',
                label: 'सोशल मीडिया पोस्टर बनाएं',
                labelEn: 'Create Poster',
                icon: 'poster',
                route: '/poster-generator',
            },
            {
                id: 'volunteer',
                label: 'कार्यकर्ता बनें',
                labelEn: 'Join as Volunteer',
                icon: 'volunteer',
                route: '/volunteers/register',
            },
            {
                id: 'poll',
                label: 'जनमत सर्वेक्षण',
                labelEn: 'Opinion Polls',
                icon: 'poll',
                route: '/polls',
            },
            {
                id: 'my-area',
                label: 'मेरा क्षेत्र',
                labelEn: 'My Area Feed',
                icon: 'location',
                route: '/my-area',
            },
        ];
        return {
            welcome: {
                userId: user._id,
                name: user.name || 'Citizen',
                mobile: user.mobile,
                profilePhoto: user.profilePhoto || null,
                category: user.category || 'citizen',
                tags: user.tags || [],
                isProfileComplete: user.isProfileComplete || false,
            },
            area: hierarchy,
            quickActions,
            complaintsSummary: {
                total: complaintsSummary[0],
                pending: complaintsSummary[1],
                inProgress: complaintsSummary[2],
                resolved: complaintsSummary[3],
                recent: recentComplaints,
            },
            upcomingEvents: enrichedEvents,
            activePoll: pollStatus,
            membership: membership
                ? {
                    status: membership.status,
                    designation: membership.designation || 'Member',
                    membershipNumber: membership.membershipNumber || null,
                    hasCard: Boolean(membership.status === 'approved'),
                    cardUrl: membership.cardUrl || null,
                    cardDownloadUrl: `/membership/my/card/download`,
                }
                : {
                    status: 'none',
                    hasCard: false,
                    message: 'Apply now to receive your digital membership card with QR code',
                },
            volunteer: volunteer
                ? {
                    isVolunteer: true,
                    role: volunteer.role,
                    status: volunteer.status,
                    assignedArea: volunteer.assignedAreaId?.name || null,
                }
                : {
                    isVolunteer: false,
                },
            banners,
            latestNews,
            unreadNotificationsCount,
        };
    }
    async getCitizenProfile(tenant, userId) {
        const user = await this.getCitizenUser(tenant, userId);
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        const [membership, volunteer, complaints, rsvps, votes] = await Promise.all([
            this.membershipModel.findOne({ tenantId: tenant._id, userId: user._id }).lean(),
            this.volunteerModel
                .findOne({ tenantId: tenant._id, userId: user._id })
                .populate('assignedAreaId', 'name code')
                .lean(),
            this.complaintModel
                .find({ tenantId: tenant._id, userId: user._id })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('complaintNumber title category status priority createdAt')
                .lean(),
            this.eventRsvpModel
                .find({ tenantId: tenant._id, userId: user._id })
                .populate('eventId', 'title eventType startDate location')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            this.pollVoteModel
                .find({ tenantId: tenant._id, userId: user._id })
                .populate('pollId', 'question options')
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
        ]);
        return {
            profile: {
                _id: user._id,
                mobile: user.mobile,
                name: user.name,
                email: user.email || null,
                dob: user.dob || null,
                gender: user.gender || null,
                profilePhoto: user.profilePhoto || null,
                address: user.address || null,
                category: user.category || 'citizen',
                tags: user.tags || [],
                customFields: user.customFields || {},
                isProfileComplete: user.isProfileComplete,
                createdAt: user.createdAt,
            },
            area: hierarchy,
            membership: membership || null,
            volunteer: volunteer || null,
            activity: {
                complaints: {
                    total: complaints.length,
                    items: complaints,
                },
                eventRegistrations: {
                    total: rsvps.length,
                    items: rsvps.map((r) => ({
                        _id: r._id,
                        status: r.status,
                        event: r.eventId,
                    })),
                },
                pollParticipation: {
                    total: votes.length,
                    items: votes.map((v) => ({
                        _id: v._id,
                        optionId: v.optionId,
                        poll: v.pollId,
                    })),
                },
            },
        };
    }
    async updateCitizenProfile(tenant, userId, dto) {
        const user = await this.getCitizenUser(tenant, userId);
        if (dto.name !== undefined)
            user.name = dto.name.trim();
        if (dto.email !== undefined)
            user.email = dto.email.trim();
        if (dto.dob !== undefined)
            user.dob = dto.dob ? new Date(dto.dob) : undefined;
        if (dto.gender !== undefined)
            user.gender = dto.gender;
        if (dto.profilePhoto !== undefined)
            user.profilePhoto = dto.profilePhoto;
        if (dto.address !== undefined)
            user.address = dto.address;
        if (dto.areaId !== undefined) {
            if (dto.areaId && mongoose_2.Types.ObjectId.isValid(dto.areaId)) {
                const areaExists = await this.areaModel.findOne({
                    _id: new mongoose_2.Types.ObjectId(dto.areaId),
                    tenantId: tenant._id,
                });
                if (!areaExists) {
                    throw new common_1.NotFoundException('Selected area does not exist in this constituency');
                }
                user.areaId = new mongoose_2.Types.ObjectId(dto.areaId);
            }
            else {
                user.areaId = undefined;
            }
        }
        if (dto.customFields && typeof dto.customFields === 'object') {
            user.customFields = {
                ...(user.customFields || {}),
                ...dto.customFields,
            };
        }
        if (user.name && user.mobile) {
            user.isProfileComplete = true;
        }
        await user.save();
        const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
        return {
            message: 'Profile updated successfully',
            profile: user,
            area: hierarchy,
        };
    }
};
exports.CitizenDashboardService = CitizenDashboardService;
exports.CitizenDashboardService = CitizenDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __param(2, (0, mongoose_1.InjectModel)(area_schema_1.AreaLevel.name)),
    __param(3, (0, mongoose_1.InjectModel)(work_schema_1.Work.name)),
    __param(4, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(5, (0, mongoose_1.InjectModel)(event_rsvp_schema_1.EventRsvp.name)),
    __param(6, (0, mongoose_1.InjectModel)(poll_schema_1.Poll.name)),
    __param(7, (0, mongoose_1.InjectModel)(poll_schema_1.PollVote.name)),
    __param(8, (0, mongoose_1.InjectModel)(news_schema_1.News.name)),
    __param(9, (0, mongoose_1.InjectModel)(complaint_schema_1.Complaint.name)),
    __param(10, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(11, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(12, (0, mongoose_1.InjectModel)(banner_schema_1.Banner.name)),
    __param(13, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(14, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationRead.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CitizenDashboardService);
//# sourceMappingURL=citizen-dashboard.service.js.map
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import {
  Area,
  AreaDocument,
  AreaLevel,
  AreaLevelDocument,
} from '../areas/area.schema';
import { Work, WorkDocument } from '../works/work.schema';
import { Event, EventDocument } from '../events/event.schema';
import { EventRsvp, EventRsvpDocument } from '../events/event-rsvp.schema';
import {
  Poll,
  PollDocument,
  PollVote,
  PollVoteDocument,
} from '../polls/poll.schema';
import { News, NewsDocument } from '../news/news.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import {
  Membership,
  MembershipDocument,
} from '../membership/membership.schema';
import {
  Volunteer,
  VolunteerDocument,
} from '../volunteers/volunteer.schema';
import { Banner, BannerDocument } from '../banners/banner.schema';
import {
  Notification,
  NotificationDocument,
  NotificationRead,
  NotificationReadDocument,
} from '../notifications/notification.schema';
import { NewsStatus, VolunteerStatus, ComplaintStatus } from '../../shared/types';
import { UpdateCitizenProfileDto, QueryFeedDto } from './citizen-dashboard.dto';

@Injectable()
export class CitizenDashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(AreaLevel.name) private areaLevelModel: Model<AreaLevelDocument>,
    @InjectModel(Work.name) private workModel: Model<WorkDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventRsvp.name) private eventRsvpModel: Model<EventRsvpDocument>,
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(PollVote.name) private pollVoteModel: Model<PollVoteDocument>,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationRead.name) private notificationReadModel: Model<NotificationReadDocument>,
  ) {}

  /**
   * Helper: Get citizen user document or throw NotFoundException
   */
  private async getCitizenUser(tenant: TenantDocument, userId: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid citizen ID format');
    }
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
      tenantId: tenant._id,
    });
    if (!user) {
      throw new NotFoundException('Citizen account not found');
    }
    return user;
  }

  /**
   * Helper: Traverses parentId upwards to build full breadcrumb hierarchy & relevant area IDs
   * (e.g., Lok Sabha ➔ Vidhan Sabha ➔ Block ➔ Gram Panchayat ➔ Ward)
   */
  async resolveUserAreaHierarchy(tenant: TenantDocument, areaId?: Types.ObjectId | null) {
    if (!areaId) {
      return {
        hasArea: false,
        primaryArea: null,
        breadcrumbs: [],
        breadcrumbText: 'No area registered yet',
        relevantAreaIds: [] as Types.ObjectId[],
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
        relevantAreaIds: [] as Types.ObjectId[],
      };
    }

    const chain: any[] = [primaryArea];
    let curr: any = primaryArea;

    while (curr.parentId) {
      const parent: any = await this.areaModel
        .findOne({ _id: curr.parentId, tenantId: tenant._id })
        .populate('levelId', 'name levelOrder')
        .lean();
      if (!parent) break;
      chain.push(parent);
      curr = parent;
    }

    // Reverse so it's top-level first: [District/Lok Sabha, Vidhan Sabha, Block, Ward]
    const breadcrumbs = chain.reverse().map((a) => ({
      _id: a._id,
      name: a.name,
      code: a.code || null,
      levelOrder: a.levelId?.levelOrder || null,
      levelName: a.levelId?.name || (a.type || 'Area'),
    }));

    const breadcrumbText = breadcrumbs.map((b) => b.name).join(' ➔ ');
    const relevantAreaIds = chain.map((a) => a._id as Types.ObjectId);

    return {
      hasArea: true,
      primaryArea: {
        _id: primaryArea._id,
        name: primaryArea.name,
        code: primaryArea.code || null,
        levelName: (primaryArea.levelId as any)?.name || 'Area',
      },
      breadcrumbs,
      breadcrumbText,
      relevantAreaIds,
    };
  }

  // =========================================================================
  // 📍 1. "MY AREA" MODULE (SRS Sec 37)
  // =========================================================================

  /**
   * GET /my-area: Complete Personalized "My Area" Feed
   */
  async getMyAreaFeed(tenant: TenantDocument, userId: string) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
    const relevantAreaIds = hierarchy.relevantAreaIds;

    const worksFilter: any = { tenantId: tenant._id, isPublished: true };
    const eventsFilter: any = { tenantId: tenant._id, isPublished: true };
    const newsFilter: any = { tenantId: tenant._id, status: NewsStatus.PUBLISHED };
    const pollsFilter: any = { tenantId: tenant._id, isActive: true };
    const coordinatorFilter: any = { tenantId: tenant._id, status: 'active' };
    const complaintsFilter: any = {
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

    const [localWorks, localEvents, localNews, localPolls, coordinators, communityComplaints] =
      await Promise.all([
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
      coordinators: coordinators.map((c: any) => ({
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

  /**
   * GET /my-area/hierarchy: Just the Area Hierarchy Trail
   */
  async getMyAreaHierarchy(tenant: TenantDocument, userId: string) {
    const user = await this.getCitizenUser(tenant, userId);
    return this.resolveUserAreaHierarchy(tenant, user.areaId);
  }

  /**
   * GET /my-area/works: Local Development Works
   */
  async getMyAreaWorks(tenant: TenantDocument, userId: string, query: QueryFeedDto) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
    const { page = 1, limit = 10 } = query;

    const filter: any = { tenantId: tenant._id, isPublished: true };
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

  /**
   * GET /my-area/events: Local Events & Rallies with RSVP Status
   */
  async getMyAreaEvents(tenant: TenantDocument, userId: string, query: QueryFeedDto) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
    const { page = 1, limit = 10 } = query;

    const filter: any = { tenantId: tenant._id, isPublished: true };
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

    // Check user's RSVP status for these events
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

  /**
   * GET /my-area/news: Local News & Announcements
   */
  async getMyAreaNews(tenant: TenantDocument, userId: string, query: QueryFeedDto) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
    const { page = 1, limit = 10 } = query;

    const filter: any = { tenantId: tenant._id, status: NewsStatus.PUBLISHED };
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

  /**
   * GET /my-area/polls: Local Opinion Polls
   */
  async getMyAreaPolls(tenant: TenantDocument, userId: string) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);

    const filter: any = { tenantId: tenant._id, isActive: true };
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

  /**
   * GET /my-area/coordinator: Local Area Coordinator Contact Info
   */
  async getMyAreaCoordinator(tenant: TenantDocument, userId: string) {
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
        status: VolunteerStatus.ACTIVE,
      })
      .populate('userId', 'name mobile profilePhoto email')
      .populate('assignedAreaId', 'name code')
      .lean();

    return {
      area: hierarchy.primaryArea,
      breadcrumbs: hierarchy.breadcrumbs,
      hasCoordinator: coordinators.length > 0,
      coordinators: coordinators.map((c: any) => ({
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

  /**
   * GET /my-area/complaints: Local Community Complaints
   */
  async getMyAreaComplaints(tenant: TenantDocument, userId: string, query: QueryFeedDto) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
    const { page = 1, limit = 10 } = query;

    const filter: any = {
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

  // =========================================================================
  // 🌟 2. PERSONALIZED CITIZEN DASHBOARD (SRS Sec 38)
  // =========================================================================

  /**
   * GET /citizen/dashboard: 1-Click Consolidated Personalized Dashboard
   */
  async getCitizenDashboard(tenant: TenantDocument, userId: string) {
    const user = await this.getCitizenUser(tenant, userId);
    const hierarchy = await this.resolveUserAreaHierarchy(tenant, user.areaId);
    const relevantAreaIds = hierarchy.relevantAreaIds;

    // Parallel aggregation of all dashboard sections
    const [
      complaintsSummary,
      recentComplaints,
      upcomingEvents,
      activePoll,
      membership,
      volunteer,
      banners,
      latestNews,
      unreadNotificationsCount,
    ] = await Promise.all([
      // Complaints status counts
      Promise.all([
        this.complaintModel.countDocuments({ tenantId: tenant._id, userId: user._id }),
        this.complaintModel.countDocuments({
          tenantId: tenant._id,
          userId: user._id,
          status: { $in: [ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, ComplaintStatus.ASSIGNED] },
        }),
        this.complaintModel.countDocuments({
          tenantId: tenant._id,
          userId: user._id,
          status: ComplaintStatus.IN_PROGRESS,
        }),
        this.complaintModel.countDocuments({
          tenantId: tenant._id,
          userId: user._id,
          status: ComplaintStatus.RESOLVED,
        }),
      ]),

      // Recent 3 complaints
      this.complaintModel
        .find({ tenantId: tenant._id, userId: user._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('complaintNumber title category status priority createdAt')
        .lean(),

      // Upcoming 3 events (filtered to area or general)
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

      // Featured active poll
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

      // Membership card details
      this.membershipModel.findOne({ tenantId: tenant._id, userId: user._id }).lean(),

      // Volunteer role details
      this.volunteerModel
        .findOne({ tenantId: tenant._id, userId: user._id, status: VolunteerStatus.ACTIVE })
        .populate('assignedAreaId', 'name code')
        .lean(),

      // Active promotional banners
      this.bannerModel
        .find({ tenantId: tenant._id, isActive: true })
        .sort({ sortOrder: 1 })
        .limit(5)
        .lean(),

      // Top 3 latest published news
      this.newsModel
        .find({
          tenantId: tenant._id,
          status: NewsStatus.PUBLISHED,
          ...(relevantAreaIds.length > 0
            ? { $or: [{ areaId: { $in: relevantAreaIds } }, { areaId: null }] }
            : {}),
        })
        .sort({ publishDate: -1 })
        .limit(3)
        .select('title slug shortDescription coverImageUrl category publishDate')
        .lean(),

      // Unread notifications count
      this.notificationModel.countDocuments({
        tenantId: tenant._id,
        isSent: true,
      }),
    ]);

    // Check user's RSVP status for upcoming events
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

    // Check voting status for active poll
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

    // Standardized Quick Actions (SRS Sec 12 & 38)
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
            assignedArea: (volunteer.assignedAreaId as any)?.name || null,
          }
        : {
            isVolunteer: false,
          },
      banners,
      latestNews,
      unreadNotificationsCount,
    };
  }

  // =========================================================================
  // 👤 3. CITIZEN PROFILE & ACTIVITY 360 (SRS Sec 36)
  // =========================================================================

  /**
   * GET /citizen/profile: Comprehensive Public User Profile View with Activity History
   */
  async getCitizenProfile(tenant: TenantDocument, userId: string) {
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
        createdAt: (user as any).createdAt,
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
          items: rsvps.map((r: any) => ({
            _id: r._id,
            status: r.status,
            event: r.eventId,
          })),
        },
        pollParticipation: {
          total: votes.length,
          items: votes.map((v: any) => ({
            _id: v._id,
            optionId: v.optionId,
            poll: v.pollId,
          })),
        },
      },
    };
  }

  /**
   * PATCH /citizen/profile: Safe Citizen Profile Self-Update
   */
  async updateCitizenProfile(tenant: TenantDocument, userId: string, dto: UpdateCitizenProfileDto) {
    const user = await this.getCitizenUser(tenant, userId);

    if (dto.name !== undefined) user.name = dto.name.trim();
    if (dto.email !== undefined) user.email = dto.email.trim();
    if (dto.dob !== undefined) user.dob = dto.dob ? new Date(dto.dob) : undefined;
    if (dto.gender !== undefined) user.gender = dto.gender;
    if (dto.profilePhoto !== undefined) user.profilePhoto = dto.profilePhoto;
    if (dto.address !== undefined) user.address = dto.address;

    if (dto.areaId !== undefined) {
      if (dto.areaId && Types.ObjectId.isValid(dto.areaId)) {
        const areaExists = await this.areaModel.findOne({
          _id: new Types.ObjectId(dto.areaId),
          tenantId: tenant._id,
        });
        if (!areaExists) {
          throw new NotFoundException('Selected area does not exist in this constituency');
        }
        user.areaId = new Types.ObjectId(dto.areaId);
      } else {
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
}

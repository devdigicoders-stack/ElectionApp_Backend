import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationRead, NotificationReadDocument } from './notification.schema';
import { User, UserDocument } from '../users/user.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { AdminUser, AdminUserDocument } from '../admin-users/admin-user.schema';
import { PlatformBroadcast, PlatformBroadcastDocument, BroadcastTarget } from './platform-broadcast.schema';
import { SystemAlert, SystemAlertDocument, AlertType, AlertCategory } from './system-alert.schema';
import { FirebaseService } from './firebase.service';
import { NotificationTarget, MembershipStatus, VolunteerStatus } from '../../shared/types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationRead.name) private readModel: Model<NotificationReadDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(PlatformBroadcast.name) private broadcastModel: Model<PlatformBroadcastDocument>,
    @InjectModel(SystemAlert.name) private alertModel: Model<SystemAlertDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  // =========================================================================
  // TENANT NOTIFICATIONS (Citizens & Volunteers)
  // =========================================================================

  async create(tenant: TenantDocument, data: any) {
    const payload = {
      tenantId: tenant._id,
      ...data,
      body: data.body || data.message || '',
      target: data.target || data.targetAudience || NotificationTarget.ALL,
    };
    return this.notificationModel.create(payload);
  }

  async send(tenant: TenantDocument, id: string) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    const tenantObjectId = Types.ObjectId.isValid(tenant._id) ? new Types.ObjectId(tenant._id) : tenant._id;

    const notification = await this.notificationModel.findOne({
      _id: objectId,
      $or: [{ tenantId: tenantObjectId }, { tenantId: tenant._id.toString() }],
    });
    if (!notification) throw new NotFoundException('Notification not found');

    // Resolve target users
    let userIds: Types.ObjectId[] = [];
    const query: any = { tenantId: tenantObjectId, isActive: true };

    if (notification.target === NotificationTarget.ALL) {
      const users = await this.userModel.find(query).select('_id');
      userIds = users.map((u) => u._id as Types.ObjectId);
    } else if (notification.target === NotificationTarget.AREA && notification.targetAreaId) {
      const users = await this.userModel.find({ ...query, areaId: notification.targetAreaId }).select('_id');
      userIds = users.map((u) => u._id as Types.ObjectId);
    } else if (notification.target === NotificationTarget.SPECIFIC) {
      userIds = notification.targetUserIds || [];
    } else if (notification.target === NotificationTarget.MEMBERS) {
      const members = await this.membershipModel.find({ tenantId: tenantObjectId, status: MembershipStatus.APPROVED }).select('userId');
      userIds = members.map((m) => m.userId as Types.ObjectId);
    } else if (notification.target === NotificationTarget.VOLUNTEERS) {
      const volunteers = await this.volunteerModel.find({ tenantId: tenantObjectId, status: VolunteerStatus.ACTIVE }).select('userId');
      userIds = volunteers.map((v) => v.userId as Types.ObjectId);
    }

    // Create read records (unread) for all target users
    if (userIds.length > 0) {
      const readDocs = userIds.map((userId) => ({ notificationId: notification._id, userId, isRead: false }));
      await this.readModel.insertMany(readDocs, { ordered: false }).catch(() => {}); // ignore duplicates
    }

    // ── Dispatch Real FCM Push Notification ──
    const isPushChannel = !notification.channel || notification.channel === 'push' || notification.channel === 'both';
    let tokensPushed = 0;

    if (isPushChannel && this.firebaseService.isReady()) {
      try {
        const [usersWithTokens, adminsWithTokens] = await Promise.all([
          userIds.length > 0 ? this.userModel.find({ _id: { $in: userIds } }).select('fcmTokens') : [],
          this.adminUserModel.find({ tenantId: tenant._id }).select('fcmTokens'),
        ]);

        const fcmTokens: string[] = [];
        for (const u of [...usersWithTokens, ...adminsWithTokens]) {
          if (Array.isArray(u.fcmTokens)) {
            for (const tok of u.fcmTokens) {
              if (tok && typeof tok === 'string' && tok.length > 10 && !fcmTokens.includes(tok.trim())) {
                fcmTokens.push(tok.trim());
              }
            }
          }
        }

        if (fcmTokens.length > 0) {
          tokensPushed = fcmTokens.length;
          this.firebaseService
            .sendMulticastPush(fcmTokens, {
              title: notification.title,
              body: notification.body,
              imageUrl: notification.imageUrl || undefined,
              data: {
                notificationId: notification._id.toString(),
                tenantId: tenant._id.toString(),
                click_action: notification.linkUrl || '/notifications',
              },
            })
            .then((res) => {
              this.logger.log(`FCM Multicast push dispatched to ${res.successCount}/${fcmTokens.length} devices.`);
            })
            .catch((err) => {
              this.logger.error(`FCM Multicast error: ${err.message}`);
            });
        }
      } catch (fcmErr: any) {
        this.logger.warn(`Could not query FCM tokens: ${fcmErr.message}`);
      }
    }

    notification.isSent = true;
    notification.sentAt = new Date();
    await notification.save();

    return {
      message: 'Notification sent',
      recipientCount: userIds.length,
      pushTokensDispatched: tokensPushed,
    };
  }

  async findAll(tenant: TenantDocument, page = 1, limit = 20) {
    const tenantObjectId = Types.ObjectId.isValid(tenant._id) ? new Types.ObjectId(tenant._id) : tenant._id;
    const query = { $or: [{ tenantId: tenantObjectId }, { tenantId: tenant._id.toString() }] };
    const [data, total] = await Promise.all([
      this.notificationModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      this.notificationModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async getForUser(tenant: TenantDocument, userId: string, page = 1, limit = 20) {
    const readRecords = await this.readModel
      .find({ userId })
      .populate({ path: 'notificationId', match: { tenantId: tenant._id } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return readRecords.filter((r) => r.notificationId !== null);
  }

  async markRead(userId: string, notificationId: string) {
    return this.readModel.findOneAndUpdate({ userId, notificationId }, { isRead: true }, { new: true });
  }

  async getUnreadCount(userId: string) {
    return this.readModel.countDocuments({ userId, isRead: false });
  }

  async remove(tenant: TenantDocument, id: string) {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    const tenantObjectId = Types.ObjectId.isValid(tenant._id) ? new Types.ObjectId(tenant._id) : tenant._id;

    let deleted = await this.notificationModel.findOneAndDelete({
      _id: objectId,
      $or: [{ tenantId: tenantObjectId }, { tenantId: tenant._id.toString() }],
    });

    if (!deleted) {
      deleted = await this.notificationModel.findOneAndDelete({ _id: objectId });
    }

    await this.readModel.deleteMany({ notificationId: objectId }).catch(() => {});

    return { success: true, message: 'Notification deleted successfully', deletedId: id };
  }

  // =========================================================================
  // SUPER ADMIN SYSTEM ALERTS INBOX
  // =========================================================================

  async getSystemInbox(query: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    category?: string;
  }) {
    const page = Math.max(query.page || 1, 1);
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Seed default starter alerts if collection is brand new
    await this.seedDefaultAlertsIfEmpty();

    const filter: any = {};
    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { message: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [alerts, total, unreadCount] = await Promise.all([
      this.alertModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.alertModel.countDocuments(filter),
      this.alertModel.countDocuments({ isRead: false }),
    ]);

    return {
      data: alerts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        unreadCount,
      },
    };
  }

  async markAlertRead(alertId: string) {
    const updated = await this.alertModel.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Alert not found');
    return updated;
  }

  async markAllAlertsRead() {
    await this.alertModel.updateMany({ isRead: false }, { isRead: true });
    return { success: true, message: 'All alerts marked as read' };
  }

  async deleteAlert(alertId: string) {
    await this.alertModel.findByIdAndDelete(alertId);
    return { success: true, message: 'Alert deleted' };
  }

  async recordSystemAlert(dto: {
    title: string;
    message: string;
    type?: AlertType;
    category?: AlertCategory;
    actionUrl?: string;
    metadata?: Record<string, any>;
  }) {
    return this.alertModel.create({
      title: dto.title,
      message: dto.message,
      type: dto.type || AlertType.INFO,
      category: dto.category || AlertCategory.SYSTEM,
      actionUrl: dto.actionUrl || undefined,
      metadata: dto.metadata || {},
      isRead: false,
    });
  }

  private async seedDefaultAlertsIfEmpty() {
    const count = await this.alertModel.estimatedDocumentCount();
    if (count > 0) return;

    const initialAlerts = [
      {
        title: 'Platform Maintenance Notice',
        message: 'Scheduled core infrastructure update is planned for Sunday 02:00 AM IST. Downtime expected: < 15 mins.',
        type: AlertType.ALERT,
        category: AlertCategory.MAINTENANCE,
        isRead: false,
      },
      {
        title: 'New Client Onboarded',
        message: 'Tenant "Amit Sharma Campaign" has completed onboarding with Vidhan Sabha Pro plan.',
        type: AlertType.SUCCESS,
        category: AlertCategory.TENANT,
        isRead: false,
      },
      {
        title: 'Domain Verification Alert',
        message: 'Domain validation for "anitadesai.org" encountered DNS propagation delay. Check CNAME record.',
        type: AlertType.WARNING,
        category: AlertCategory.DOMAIN,
        isRead: false,
      },
      {
        title: 'Subscription Payment Processed',
        message: 'Auto-renewal successful for Tenant "Ravi Kumar Lok Sabha" (₹49,999). Invoice generated.',
        type: AlertType.INFO,
        category: AlertCategory.PAYMENT,
        isRead: true,
      },
    ];

    await this.alertModel.insertMany(initialAlerts);
  }

  // =========================================================================
  // SUPER ADMIN PLATFORM BROADCASTS
  // =========================================================================

  async getBroadcasts(page = 1, limit = 20) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(limit, 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      this.broadcastModel.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      this.broadcastModel.countDocuments(),
    ]);

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  async sendPlatformBroadcast(dto: any, adminUser: any) {
    const {
      title,
      message,
      type = 'announcement',
      priority = 'normal',
      targetAudience = BroadcastTarget.ALL_TENANTS,
      targetPlanId,
      targetStatus,
      targetTenantIds = [],
      channels = ['in_app'],
      actionUrl,
    } = dto;

    // 1. Resolve target tenant IDs
    let targetTenantsQuery: any = {};
    if (targetAudience === BroadcastTarget.ALL_TENANTS) {
      targetTenantsQuery = { status: { $ne: 'deleted' } };
    } else if (targetAudience === BroadcastTarget.BY_STATUS && targetStatus) {
      targetTenantsQuery = { status: targetStatus };
    } else if (targetAudience === BroadcastTarget.SPECIFIC_TENANTS && targetTenantIds.length > 0) {
      targetTenantsQuery = { _id: { $in: targetTenantIds } };
    }

    const matchedTenants = await this.tenantModel.find(targetTenantsQuery).select('_id name');
    const matchedTenantIds = matchedTenants.map((t) => t._id);

    // 2. Resolve admin users and FCM tokens
    let adminUsersQuery: any = {};
    if (targetAudience === BroadcastTarget.SYSTEM_STAFF) {
      adminUsersQuery = { isSuperAdmin: true };
    } else {
      adminUsersQuery = { tenantId: { $in: matchedTenantIds } };
    }

    const targetAdmins = await this.adminUserModel.find(adminUsersQuery).select('_id email fcmTokens');
    const recipientCount = targetAdmins.length || matchedTenants.length || 1;

    // Collect all FCM tokens
    const fcmTokens: string[] = [];
    for (const admin of targetAdmins) {
      if (Array.isArray(admin.fcmTokens)) {
        for (const tok of admin.fcmTokens) {
          if (tok && !fcmTokens.includes(tok)) {
            fcmTokens.push(tok);
          }
        }
      }
    }

    // 3. Dispatch Push Notifications via Firebase if requested
    let pushSuccess = 0;
    let pushFailure = 0;

    if (channels.includes('push') && fcmTokens.length > 0) {
      const pushResult = await this.firebaseService.sendMulticastPush(fcmTokens, {
        title: `📢 ${title}`,
        body: message,
        data: {
          type,
          priority,
          actionUrl: actionUrl || '/notifications',
          broadcast: 'true',
        },
      });
      pushSuccess = pushResult.successCount;
      pushFailure = pushResult.failureCount;
    }

    // 4. Create In-App Alert if requested
    if (channels.includes('in_app')) {
      await this.recordSystemAlert({
        title: `[Broadcast] ${title}`,
        message,
        type: priority === 'critical' ? AlertType.ALERT : AlertType.INFO,
        category: AlertCategory.SYSTEM,
        actionUrl,
        metadata: { targetAudience, type, priority },
      });
    }

    // 5. Save PlatformBroadcast record
    const broadcastRecord = await this.broadcastModel.create({
      title,
      message,
      type,
      priority,
      targetAudience,
      targetPlanId: targetPlanId || null,
      targetStatus: targetStatus || null,
      targetTenantIds: matchedTenantIds,
      channels,
      actionUrl: actionUrl || null,
      sentBy: adminUser?.sub || adminUser?._id,
      sentByName: adminUser?.name || 'Super Admin',
      recipientCount,
      pushSuccessCount: pushSuccess,
      pushFailureCount: pushFailure,
      isSent: true,
      sentAt: new Date(),
    });

    return {
      success: true,
      message: 'Platform broadcast sent successfully',
      broadcast: broadcastRecord,
      recipientCount,
      pushStats: {
        tokensTargeted: fcmTokens.length,
        success: pushSuccess,
        failure: pushFailure,
      },
    };
  }

  // =========================================================================
  // FCM DEVICE TOKEN MANAGEMENT
  // =========================================================================

  async registerFcmToken(userId: string, token: string) {
    if (!token || token.trim().length < 10) {
      return { success: false, message: 'Invalid FCM token' };
    }

    const cleanToken = token.trim();
    const objectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;

    await Promise.all([
      this.userModel.findByIdAndUpdate(objectId, { $addToSet: { fcmTokens: cleanToken } }),
      this.adminUserModel.findByIdAndUpdate(objectId, { $addToSet: { fcmTokens: cleanToken } }),
    ]);

    return { success: true, message: 'FCM push token registered successfully' };
  }

  async testFcm(targetToken?: string) {
    let tokenToUse = targetToken;

    if (!tokenToUse) {
      // Pick any registered super admin token
      const adminWithToken = await this.adminUserModel.findOne({
        fcmTokens: { $exists: true, $not: { $size: 0 } },
      });
      tokenToUse = adminWithToken?.fcmTokens?.[0];
    }

    if (!tokenToUse) {
      return {
        success: false,
        message: 'No registered device push token found. Please click "Enable Push Notifications" in your browser first.',
      };
    }

    const result = await this.firebaseService.sendToSingleToken(tokenToUse, {
      title: '🔔 Test Notification from Antigravity / SaaS Super Admin',
      body: 'Firebase Cloud Messaging (FCM) is properly connected and operating in real-time!',
      data: {
        test: 'true',
        timestamp: new Date().toISOString(),
      },
    });

    return result;
  }
}

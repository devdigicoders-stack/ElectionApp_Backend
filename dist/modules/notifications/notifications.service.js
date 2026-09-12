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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./notification.schema");
const user_schema_1 = require("../users/user.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const tenant_schema_1 = require("../tenants/tenant.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
const platform_broadcast_schema_1 = require("./platform-broadcast.schema");
const system_alert_schema_1 = require("./system-alert.schema");
const firebase_service_1 = require("./firebase.service");
const types_1 = require("../../shared/types");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(notificationModel, readModel, userModel, membershipModel, volunteerModel, broadcastModel, alertModel, adminUserModel, tenantModel, firebaseService) {
        this.notificationModel = notificationModel;
        this.readModel = readModel;
        this.userModel = userModel;
        this.membershipModel = membershipModel;
        this.volunteerModel = volunteerModel;
        this.broadcastModel = broadcastModel;
        this.alertModel = alertModel;
        this.adminUserModel = adminUserModel;
        this.tenantModel = tenantModel;
        this.firebaseService = firebaseService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async create(tenant, data) {
        const payload = {
            tenantId: tenant._id,
            ...data,
            body: data.body || data.message || '',
            target: data.target || data.targetAudience || types_1.NotificationTarget.ALL,
        };
        return this.notificationModel.create(payload);
    }
    async send(tenant, id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant._id;
        const notification = await this.notificationModel.findOne({
            _id: objectId,
            $or: [{ tenantId: tenantObjectId }, { tenantId: tenant._id.toString() }],
        });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        let userIds = [];
        const query = { tenantId: tenantObjectId, isActive: true };
        if (notification.target === types_1.NotificationTarget.ALL) {
            const users = await this.userModel.find(query).select('_id');
            userIds = users.map((u) => u._id);
        }
        else if (notification.target === types_1.NotificationTarget.AREA && notification.targetAreaId) {
            const users = await this.userModel.find({ ...query, areaId: notification.targetAreaId }).select('_id');
            userIds = users.map((u) => u._id);
        }
        else if (notification.target === types_1.NotificationTarget.SPECIFIC) {
            userIds = notification.targetUserIds || [];
        }
        else if (notification.target === types_1.NotificationTarget.MEMBERS) {
            const members = await this.membershipModel.find({ tenantId: tenantObjectId, status: types_1.MembershipStatus.APPROVED }).select('userId');
            userIds = members.map((m) => m.userId);
        }
        else if (notification.target === types_1.NotificationTarget.VOLUNTEERS) {
            const volunteers = await this.volunteerModel.find({ tenantId: tenantObjectId, status: types_1.VolunteerStatus.ACTIVE }).select('userId');
            userIds = volunteers.map((v) => v.userId);
        }
        if (userIds.length > 0) {
            const readDocs = userIds.map((userId) => ({ notificationId: notification._id, userId, isRead: false }));
            await this.readModel.insertMany(readDocs, { ordered: false }).catch(() => { });
        }
        const isPushChannel = !notification.channel || notification.channel === 'push' || notification.channel === 'both';
        let tokensPushed = 0;
        if (isPushChannel && this.firebaseService.isReady()) {
            try {
                const [usersWithTokens, adminsWithTokens] = await Promise.all([
                    userIds.length > 0 ? this.userModel.find({ _id: { $in: userIds } }).select('fcmTokens') : [],
                    this.adminUserModel.find({ tenantId: tenant._id }).select('fcmTokens'),
                ]);
                const fcmTokens = [];
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
            }
            catch (fcmErr) {
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
    async findAll(tenant, page = 1, limit = 20) {
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant._id;
        const query = { $or: [{ tenantId: tenantObjectId }, { tenantId: tenant._id.toString() }] };
        const [data, total] = await Promise.all([
            this.notificationModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            this.notificationModel.countDocuments(query),
        ]);
        return { data, total, page, limit };
    }
    async getForUser(tenant, userId, page = 1, limit = 20) {
        const readRecords = await this.readModel
            .find({ userId })
            .populate({ path: 'notificationId', match: { tenantId: tenant._id } })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return readRecords.filter((r) => r.notificationId !== null);
    }
    async markRead(userId, notificationId) {
        return this.readModel.findOneAndUpdate({ userId, notificationId }, { isRead: true }, { new: true });
    }
    async getUnreadCount(userId) {
        return this.readModel.countDocuments({ userId, isRead: false });
    }
    async remove(tenant, id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant._id;
        let deleted = await this.notificationModel.findOneAndDelete({
            _id: objectId,
            $or: [{ tenantId: tenantObjectId }, { tenantId: tenant._id.toString() }],
        });
        if (!deleted) {
            deleted = await this.notificationModel.findOneAndDelete({ _id: objectId });
        }
        await this.readModel.deleteMany({ notificationId: objectId }).catch(() => { });
        return { success: true, message: 'Notification deleted successfully', deletedId: id };
    }
    async getSystemInbox(query) {
        const page = Math.max(query.page || 1, 1);
        const limit = Math.min(query.limit || 20, 100);
        const skip = (page - 1) * limit;
        await this.seedDefaultAlertsIfEmpty();
        const filter = {};
        if (query.type)
            filter.type = query.type;
        if (query.category)
            filter.category = query.category;
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
    async markAlertRead(alertId) {
        const updated = await this.alertModel.findByIdAndUpdate(alertId, { isRead: true }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Alert not found');
        return updated;
    }
    async markAllAlertsRead() {
        await this.alertModel.updateMany({ isRead: false }, { isRead: true });
        return { success: true, message: 'All alerts marked as read' };
    }
    async deleteAlert(alertId) {
        await this.alertModel.findByIdAndDelete(alertId);
        return { success: true, message: 'Alert deleted' };
    }
    async recordSystemAlert(dto) {
        return this.alertModel.create({
            title: dto.title,
            message: dto.message,
            type: dto.type || system_alert_schema_1.AlertType.INFO,
            category: dto.category || system_alert_schema_1.AlertCategory.SYSTEM,
            actionUrl: dto.actionUrl || undefined,
            metadata: dto.metadata || {},
            isRead: false,
        });
    }
    async seedDefaultAlertsIfEmpty() {
        const count = await this.alertModel.estimatedDocumentCount();
        if (count > 0)
            return;
        const initialAlerts = [
            {
                title: 'Platform Maintenance Notice',
                message: 'Scheduled core infrastructure update is planned for Sunday 02:00 AM IST. Downtime expected: < 15 mins.',
                type: system_alert_schema_1.AlertType.ALERT,
                category: system_alert_schema_1.AlertCategory.MAINTENANCE,
                isRead: false,
            },
            {
                title: 'New Client Onboarded',
                message: 'Tenant "Amit Sharma Campaign" has completed onboarding with Vidhan Sabha Pro plan.',
                type: system_alert_schema_1.AlertType.SUCCESS,
                category: system_alert_schema_1.AlertCategory.TENANT,
                isRead: false,
            },
            {
                title: 'Domain Verification Alert',
                message: 'Domain validation for "anitadesai.org" encountered DNS propagation delay. Check CNAME record.',
                type: system_alert_schema_1.AlertType.WARNING,
                category: system_alert_schema_1.AlertCategory.DOMAIN,
                isRead: false,
            },
            {
                title: 'Subscription Payment Processed',
                message: 'Auto-renewal successful for Tenant "Ravi Kumar Lok Sabha" (₹49,999). Invoice generated.',
                type: system_alert_schema_1.AlertType.INFO,
                category: system_alert_schema_1.AlertCategory.PAYMENT,
                isRead: true,
            },
        ];
        await this.alertModel.insertMany(initialAlerts);
    }
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
    async sendPlatformBroadcast(dto, adminUser) {
        const { title, message, type = 'announcement', priority = 'normal', targetAudience = platform_broadcast_schema_1.BroadcastTarget.ALL_TENANTS, targetPlanId, targetStatus, targetTenantIds = [], channels = ['in_app'], actionUrl, } = dto;
        let targetTenantsQuery = {};
        if (targetAudience === platform_broadcast_schema_1.BroadcastTarget.ALL_TENANTS) {
            targetTenantsQuery = { status: { $ne: 'deleted' } };
        }
        else if (targetAudience === platform_broadcast_schema_1.BroadcastTarget.BY_STATUS && targetStatus) {
            targetTenantsQuery = { status: targetStatus };
        }
        else if (targetAudience === platform_broadcast_schema_1.BroadcastTarget.SPECIFIC_TENANTS && targetTenantIds.length > 0) {
            targetTenantsQuery = { _id: { $in: targetTenantIds } };
        }
        const matchedTenants = await this.tenantModel.find(targetTenantsQuery).select('_id name');
        const matchedTenantIds = matchedTenants.map((t) => t._id);
        let adminUsersQuery = {};
        if (targetAudience === platform_broadcast_schema_1.BroadcastTarget.SYSTEM_STAFF) {
            adminUsersQuery = { isSuperAdmin: true };
        }
        else {
            adminUsersQuery = { tenantId: { $in: matchedTenantIds } };
        }
        const targetAdmins = await this.adminUserModel.find(adminUsersQuery).select('_id email fcmTokens');
        const recipientCount = targetAdmins.length || matchedTenants.length || 1;
        const fcmTokens = [];
        for (const admin of targetAdmins) {
            if (Array.isArray(admin.fcmTokens)) {
                for (const tok of admin.fcmTokens) {
                    if (tok && !fcmTokens.includes(tok)) {
                        fcmTokens.push(tok);
                    }
                }
            }
        }
        let pushSuccess = 0;
        let pushFailure = 0;
        if (channels.includes('push')) {
            if (fcmTokens.length > 0) {
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
            else {
                this.logger.warn(`Platform broadcast requested push, but 0 FCM device tokens were registered for target tenants.`);
                pushFailure = recipientCount;
            }
        }
        if (channels.includes('in_app')) {
            await this.recordSystemAlert({
                title: `[Broadcast] ${title}`,
                message,
                type: priority === 'critical' ? system_alert_schema_1.AlertType.ALERT : system_alert_schema_1.AlertType.INFO,
                category: system_alert_schema_1.AlertCategory.SYSTEM,
                actionUrl,
                metadata: { targetAudience, type, priority },
            });
        }
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
    async getTenantPlatformBroadcasts(tenant, page = 1, limit = 20) {
        const safePage = Math.max(page, 1);
        const safeLimit = Math.min(limit, 50);
        const skip = (safePage - 1) * safeLimit;
        const tenantObjectId = mongoose_2.Types.ObjectId.isValid(tenant._id) ? new mongoose_2.Types.ObjectId(tenant._id) : tenant._id;
        const filter = {
            $or: [
                { targetAudience: platform_broadcast_schema_1.BroadcastTarget.ALL_TENANTS },
                { targetTenantIds: tenantObjectId },
                { targetTenantIds: tenant._id.toString() },
            ],
        };
        const [data, total] = await Promise.all([
            this.broadcastModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
            this.broadcastModel.countDocuments(filter),
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
    async registerFcmToken(userId, token) {
        if (!token || token.trim().length < 10) {
            return { success: false, message: 'Invalid FCM token' };
        }
        const cleanToken = token.trim();
        if (userId) {
            const objectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
            await Promise.all([
                this.userModel.findByIdAndUpdate(objectId, { $addToSet: { fcmTokens: cleanToken } }),
                this.adminUserModel.findByIdAndUpdate(objectId, { $addToSet: { fcmTokens: cleanToken } }),
            ]);
        }
        return { success: true, message: 'FCM push token registered successfully' };
    }
    async testFcm(targetToken) {
        let tokenToUse = targetToken;
        if (!tokenToUse) {
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
            title: 'Official Notification',
            body: 'Live push notifications are now active on your device.',
            data: {
                test: 'true',
                timestamp: new Date().toISOString(),
            },
        });
        return result;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationRead.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(4, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(5, (0, mongoose_1.InjectModel)(platform_broadcast_schema_1.PlatformBroadcast.name)),
    __param(6, (0, mongoose_1.InjectModel)(system_alert_schema_1.SystemAlert.name)),
    __param(7, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __param(8, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        firebase_service_1.FirebaseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./notification.schema");
const user_schema_1 = require("../users/user.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const types_1 = require("../../shared/types");
let NotificationsService = class NotificationsService {
    constructor(notificationModel, readModel, userModel, membershipModel, volunteerModel) {
        this.notificationModel = notificationModel;
        this.readModel = readModel;
        this.userModel = userModel;
        this.membershipModel = membershipModel;
        this.volunteerModel = volunteerModel;
    }
    async create(tenant, data) {
        return this.notificationModel.create({ tenantId: tenant._id, ...data });
    }
    async send(tenant, id) {
        const notification = await this.notificationModel.findOne({ _id: id, tenantId: tenant._id });
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        let userIds = [];
        const query = { tenantId: tenant._id, isActive: true };
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
            const members = await this.membershipModel.find({ tenantId: tenant._id, status: types_1.MembershipStatus.APPROVED }).select('userId');
            userIds = members.map((m) => m.userId);
        }
        else if (notification.target === types_1.NotificationTarget.VOLUNTEERS) {
            const volunteers = await this.volunteerModel.find({ tenantId: tenant._id, status: types_1.VolunteerStatus.ACTIVE }).select('userId');
            userIds = volunteers.map((v) => v.userId);
        }
        if (userIds.length > 0) {
            const readDocs = userIds.map((userId) => ({ notificationId: notification._id, userId, isRead: false }));
            await this.readModel.insertMany(readDocs, { ordered: false }).catch(() => { });
        }
        notification.isSent = true;
        notification.sentAt = new Date();
        await notification.save();
        return { message: 'Notification sent', recipientCount: userIds.length };
    }
    async findAll(tenant, page = 1, limit = 20) {
        const [data, total] = await Promise.all([
            this.notificationModel.find({ tenantId: tenant._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            this.notificationModel.countDocuments({ tenantId: tenant._id }),
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
        return this.notificationModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationRead.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(4, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
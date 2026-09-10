import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationRead, NotificationReadDocument } from './notification.schema';
import { User, UserDocument } from '../users/user.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { NotificationTarget, MembershipStatus, VolunteerStatus } from '../../shared/types';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationRead.name) private readModel: Model<NotificationReadDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
  ) {}

  async create(tenant: TenantDocument, data: any) {
    return this.notificationModel.create({ tenantId: tenant._id, ...data });
  }

  async send(tenant: TenantDocument, id: string) {
    const notification = await this.notificationModel.findOne({ _id: id, tenantId: tenant._id });
    if (!notification) throw new NotFoundException('Notification not found');

    // Resolve target users
    let userIds: Types.ObjectId[] = [];
    const query: any = { tenantId: tenant._id, isActive: true };

    if (notification.target === NotificationTarget.ALL) {
      const users = await this.userModel.find(query).select('_id');
      userIds = users.map((u) => u._id as Types.ObjectId);
    } else if (notification.target === NotificationTarget.AREA && notification.targetAreaId) {
      const users = await this.userModel.find({ ...query, areaId: notification.targetAreaId }).select('_id');
      userIds = users.map((u) => u._id as Types.ObjectId);
    } else if (notification.target === NotificationTarget.SPECIFIC) {
      userIds = notification.targetUserIds || [];
    } else if (notification.target === NotificationTarget.MEMBERS) {
      const members = await this.membershipModel.find({ tenantId: tenant._id, status: MembershipStatus.APPROVED }).select('userId');
      userIds = members.map((m) => m.userId as Types.ObjectId);
    } else if (notification.target === NotificationTarget.VOLUNTEERS) {
      const volunteers = await this.volunteerModel.find({ tenantId: tenant._id, status: VolunteerStatus.ACTIVE }).select('userId');
      userIds = volunteers.map((v) => v.userId as Types.ObjectId);
    }

    // Create read records (unread) for all target users
    if (userIds.length > 0) {
      const readDocs = userIds.map((userId) => ({ notificationId: notification._id, userId, isRead: false }));
      await this.readModel.insertMany(readDocs, { ordered: false }).catch(() => {}); // ignore duplicates
    }

    notification.isSent = true;
    notification.sentAt = new Date();
    await notification.save();

    return { message: 'Notification sent', recipientCount: userIds.length };
  }

  async findAll(tenant: TenantDocument, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.notificationModel.find({ tenantId: tenant._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      this.notificationModel.countDocuments({ tenantId: tenant._id }),
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
    return this.notificationModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }
}

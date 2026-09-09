import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { User, UserDocument } from './user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { Complaint, ComplaintDocument } from '../complaints/complaint.schema';
import { Area, AreaDocument } from '../areas/area.schema';
import {
  CitizenQueryDto,
  UpdateCitizenDto,
  UpdateCitizenStatusDto,
  CitizenStatus,
  PublicUserCategory,
  UpgradeCategoryDto,
  AssignMembershipDto,
  AssignVolunteerDto,
  PREDEFINED_CRM_TAGS,
} from './citizens.dto';
import { MembershipStatus, VolunteerStatus } from '../../shared/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(Complaint.name) private complaintModel: Model<ComplaintDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
  ) {}

  // ---------------------------------------------------------
  // Existing / Legacy Users methods (Kept 100% backward-compatible)
  // ---------------------------------------------------------

  async findAll(
    tenant: TenantDocument,
    filters: { areaId?: string; search?: string; page?: number; limit?: number },
  ) {
    const { areaId, search, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id };
    if (areaId) query.areaId = areaId;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { mobile: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        .populate('areaId', 'name type code')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.userModel.countDocuments(query),
    ]);
    return { data, total, page, limit };
  }

  async findOne(tenant: TenantDocument, id: string) {
    const user = await this.userModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('areaId', 'name type code');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(tenant: TenantDocument, userId: string, data: any) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId, tenantId: tenant._id },
      { $set: { ...data, isProfileComplete: true } },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleActive(tenant: TenantDocument, id: string, isActive: boolean) {
    const status = isActive ? CitizenStatus.ACTIVE : CitizenStatus.INACTIVE;
    return this.userModel.findOneAndUpdate(
      { _id: id, tenantId: tenant._id },
      { isActive, status },
      { new: true },
    );
  }

  async getStats(tenant: TenantDocument) {
    const [total, active, profileComplete] = await Promise.all([
      this.userModel.countDocuments({ tenantId: tenant._id }),
      this.userModel.countDocuments({ tenantId: tenant._id, isActive: true }),
      this.userModel.countDocuments({ tenantId: tenant._id, isProfileComplete: true }),
    ]);
    return { total, active, profileComplete };
  }

  async getAreaWiseCount(tenant: TenantDocument) {
    return this.userModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $group: { _id: '$areaId', count: { $sum: 1 } } },
      { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
      { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
      { $project: { areaName: '$area.name', count: 1 } },
      { $sort: { count: -1 } },
    ]);
  }

  // ---------------------------------------------------------
  // SRS Sec 40: Citizen Management & Search Engine
  // ---------------------------------------------------------

  /**
   * Builds the MongoDB query from CitizenQueryDto
   */
  private async buildCitizenFilterQuery(tenant: TenantDocument, q: CitizenQueryDto): Promise<any> {
    const query: any = { tenantId: tenant._id };

    // 1. Text Search across name, mobile, email
    if (q.search) {
      const regex = new RegExp(q.search.trim(), 'i');
      query.$or = [{ name: regex }, { mobile: regex }, { email: regex }];
    } else {
      if (q.name) query.name = new RegExp(q.name.trim(), 'i');
      if (q.mobile) query.mobile = new RegExp(q.mobile.trim(), 'i');
    }

    // 2. Area Filter
    if (q.areaId) {
      if (Types.ObjectId.isValid(q.areaId)) {
        query.areaId = new Types.ObjectId(q.areaId);
      } else {
        query.areaId = q.areaId;
      }
    }

    // 3. Gender Filter
    if (q.gender) {
      query.gender = new RegExp(`^${q.gender.trim()}$`, 'i');
    }

    // 4. Age and Age Group Filters
    let minAge = q.minAge;
    let maxAge = q.maxAge;

    if (q.ageGroup) {
      if (q.ageGroup.includes('-')) {
        const [low, high] = q.ageGroup.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(low)) minAge = low;
        if (!isNaN(high)) maxAge = high;
      } else if (q.ageGroup.includes('+')) {
        const low = parseInt(q.ageGroup.replace('+', '').trim(), 10);
        if (!isNaN(low)) minAge = low;
      } else if (q.ageGroup.startsWith('<')) {
        const high = parseInt(q.ageGroup.replace('<', '').trim(), 10);
        if (!isNaN(high)) maxAge = high;
      }
    }

    if (minAge !== undefined || maxAge !== undefined) {
      const now = new Date();
      query.dob = {};
      if (minAge !== undefined) {
        // Person must be born on or before (now - minAge years)
        const maxDob = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
        query.dob.$lte = maxDob;
      }
      if (maxAge !== undefined) {
        // Person must be born on or after (now - maxAge - 1 years)
        const minDob = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
        query.dob.$gte = minDob;
      }
    }

    // 5. CRM Tags Filter
    const tagList: string[] = [];
    if (q.tag) tagList.push(q.tag.trim());
    if (q.tags) {
      const splitTags = q.tags.split(',').map((t) => t.trim()).filter(Boolean);
      tagList.push(...splitTags);
    }
    if (tagList.length > 0) {
      query.tags = { $in: tagList };
    }

    // 6. Category Filter (citizen, supporter, member, volunteer)
    if (q.category) {
      query.category = q.category;
    }

    // 7. Status Filter (active, inactive, blocked)
    if (q.status) {
      query.status = q.status;
    }

    // 8. Registration Date Range
    if (q.startDate || q.endDate) {
      query.createdAt = {};
      if (q.startDate) query.createdAt.$gte = new Date(q.startDate);
      if (q.endDate) query.createdAt.$lte = new Date(q.endDate);
    }

    // 9. Membership Status Filter
    if (q.membershipStatus) {
      if (q.membershipStatus === 'none') {
        const memberUserIds = await this.membershipModel
          .find({ tenantId: tenant._id })
          .distinct('userId');
        query._id = { ...(query._id || {}), $nin: memberUserIds };
      } else {
        const memberUserIds = await this.membershipModel
          .find({ tenantId: tenant._id, status: q.membershipStatus as any })
          .distinct('userId');
        query._id = { ...(query._id || {}), $in: memberUserIds };
      }
    }

    // 10. Volunteer Status Filter
    if (q.volunteerStatus) {
      if (q.volunteerStatus === 'none') {
        const volUserIds = await this.volunteerModel
          .find({ tenantId: tenant._id })
          .distinct('userId');
        query._id = { ...(query._id || {}), $nin: volUserIds };
      } else {
        const volUserIds = await this.volunteerModel
          .find({ tenantId: tenant._id, status: q.volunteerStatus as any })
          .distinct('userId');
        query._id = { ...(query._id || {}), $in: volUserIds };
      }
    }

    return query;
  }

  /**
   * Helper: Calculate age from DOB
   */
  private calculateAge(dob?: Date | null): number | null {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  }

  /**
   * 1. Search & Filter Citizens with CRM Metadata & Pagination
   */
  async findCitizens(tenant: TenantDocument, queryDto: CitizenQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const mongoQuery = await this.buildCitizenFilterQuery(tenant, queryDto);
    const sortObj: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      this.userModel
        .find(mongoQuery)
        .populate('areaId', 'name type code')
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(mongoQuery),
    ]);

    // Batch enrich with membership and volunteer details
    const userIds = users.map((u) => u._id);
    const [memberships, volunteers] = await Promise.all([
      this.membershipModel
        .find({ tenantId: tenant._id, userId: { $in: userIds } })
        .select('userId status designation membershipNumber cardUrl approvedAt expiresAt')
        .lean(),
      this.volunteerModel
        .find({ tenantId: tenant._id, userId: { $in: userIds } })
        .select('userId role status assignedAreaId')
        .lean(),
    ]);

    const membershipMap = new Map(memberships.map((m) => [m.userId.toString(), m]));
    const volunteerMap = new Map(volunteers.map((v) => [v.userId.toString(), v]));

    const enriched = users.map((u) => {
      const uId = u._id.toString();
      const age = this.calculateAge(u.dob);
      const membership = membershipMap.get(uId);
      const volunteer = volunteerMap.get(uId);

      return {
        ...u,
        age,
        membership: membership
          ? {
              status: membership.status,
              designation: membership.designation,
              membershipNumber: membership.membershipNumber,
              cardUrl: membership.cardUrl,
              expiresAt: membership.expiresAt,
            }
          : null,
        volunteer: volunteer
          ? {
              role: volunteer.role,
              status: volunteer.status,
            }
          : null,
      };
    });

    return {
      data: enriched,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * 2. View Single Citizen (360-Degree Profile & Activity Stats)
   */
  async getCitizenDetails(tenant: TenantDocument, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id), tenantId: tenant._id })
      .populate('areaId', 'name type code parentAreaId')
      .lean();

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    const userId = user._id;

    // Fetch related CRM details: Membership, Volunteer, Complaints
    const [membership, volunteer, complaintsCount, recentComplaints] = await Promise.all([
      this.membershipModel.findOne({ tenantId: tenant._id, userId }).lean(),
      this.volunteerModel
        .findOne({ tenantId: tenant._id, userId })
        .populate('assignedAreaId', 'name type code')
        .lean(),
      this.complaintModel.countDocuments({ tenantId: tenant._id, userId }),
      this.complaintModel
        .find({ tenantId: tenant._id, userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('complaintNumber title category status priority createdAt')
        .lean(),
    ]);

    const age = this.calculateAge(user.dob);

    return {
      citizen: {
        ...user,
        age,
      },
      membership: membership || null,
      volunteer: volunteer || null,
      activity: {
        complaintsCount,
        recentComplaints,
      },
    };
  }

  /**
   * 3. Edit Permitted Information (Admin Action)
   */
  async updateCitizen(tenant: TenantDocument, id: string, dto: UpdateCitizenDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const updateDoc: any = {};
    if (dto.name !== undefined) updateDoc.name = dto.name;
    if (dto.email !== undefined) updateDoc.email = dto.email;
    if (dto.dob !== undefined) updateDoc.dob = dto.dob ? new Date(dto.dob) : null;
    if (dto.gender !== undefined) updateDoc.gender = dto.gender;
    if (dto.areaId !== undefined) {
      updateDoc.areaId =
        dto.areaId && Types.ObjectId.isValid(dto.areaId)
          ? new Types.ObjectId(dto.areaId)
          : null;
    }
    if (dto.profilePhoto !== undefined) updateDoc.profilePhoto = dto.profilePhoto;
    if (dto.address !== undefined) updateDoc.address = dto.address;
    if (dto.notes !== undefined) updateDoc.notes = dto.notes;

    if (dto.customFields && typeof dto.customFields === 'object') {
      for (const [k, v] of Object.entries(dto.customFields)) {
        updateDoc[`customFields.${k}`] = v;
      }
    }

    const updated = await this.userModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), tenantId: tenant._id },
        { $set: updateDoc },
        { new: true },
      )
      .populate('areaId', 'name type code');

    if (!updated) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    return {
      message: 'Citizen profile updated successfully',
      citizen: updated,
    };
  }

  /**
   * 4. Change Citizen Status (active / inactive / blocked)
   */
  async updateCitizenStatus(tenant: TenantDocument, id: string, dto: UpdateCitizenStatusDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const isActive = dto.status === CitizenStatus.ACTIVE;
    const updateDoc: any = {
      status: dto.status,
      isActive,
    };

    if (dto.reason) {
      updateDoc.notes = dto.reason;
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), tenantId: tenant._id },
      { $set: updateDoc },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    return {
      message: `Citizen status changed to "${dto.status}"`,
      citizen: user,
    };
  }

  // ---------------------------------------------------------
  // SRS Sec 41: User Tagging / CRM System
  // ---------------------------------------------------------

  /**
   * Get all unique tags and counts for this tenant + suggested default tags
   */
  async getAvailableTags(tenant: TenantDocument) {
    const tagAggregation = await this.userModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const tags = tagAggregation.map((item) => ({
      tag: item._id,
      count: item.count,
    }));

    return {
      tags,
      suggestedTags: PREDEFINED_CRM_TAGS,
      totalUniqueTags: tags.length,
    };
  }

  /**
   * Add one or multiple tags to a citizen
   */
  async addTags(tenant: TenantDocument, id: string, tags: string[]) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
    if (cleanTags.length === 0) {
      throw new BadRequestException('At least one non-empty tag must be provided');
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), tenantId: tenant._id },
      { $addToSet: { tags: { $each: cleanTags } } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    return {
      message: `Added tags [${cleanTags.join(', ')}] successfully`,
      tags: user.tags,
      citizen: user,
    };
  }

  /**
   * Remove a tag from a citizen
   */
  async removeTag(tenant: TenantDocument, id: string, tag: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const cleanTag = tag.trim();

    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), tenantId: tenant._id },
      { $pull: { tags: cleanTag } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    return {
      message: `Tag "${cleanTag}" removed successfully`,
      tags: user.tags,
      citizen: user,
    };
  }

  /**
   * Bulk Tag Multiple Citizens
   */
  async bulkAddTags(tenant: TenantDocument, userIds: string[], tags: string[]) {
    const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
    if (cleanTags.length === 0) {
      throw new BadRequestException('At least one non-empty tag must be provided');
    }

    const validIds = userIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (validIds.length === 0) {
      throw new BadRequestException('No valid citizen IDs provided');
    }

    const result = await this.userModel.updateMany(
      { tenantId: tenant._id, _id: { $in: validIds } },
      { $addToSet: { tags: { $each: cleanTags } } },
    );

    return {
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      tagsAdded: cleanTags,
      message: `Tags added to ${result.modifiedCount} citizens successfully`,
    };
  }

  /**
   * Bulk Remove Tag from Multiple Citizens
   */
  async bulkRemoveTag(tenant: TenantDocument, userIds: string[], tag: string) {
    const cleanTag = tag.trim();
    const validIds = userIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (validIds.length === 0) {
      throw new BadRequestException('No valid citizen IDs provided');
    }

    const result = await this.userModel.updateMany(
      { tenantId: tenant._id, _id: { $in: validIds } },
      { $pull: { tags: cleanTag } },
    );

    return {
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      tagRemoved: cleanTag,
      message: `Tag "${cleanTag}" removed from ${result.modifiedCount} citizens successfully`,
    };
  }

  // ---------------------------------------------------------
  // Role Upgrading & Public User Categories (SRS Sec 5.7 & Sec 40)
  // ---------------------------------------------------------

  /**
   * Upgrade / Change Citizen Public Category (citizen | supporter | member | volunteer)
   */
  async upgradeCategory(tenant: TenantDocument, id: string, dto: UpgradeCategoryDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const updateDoc: any = { category: dto.category };
    if (dto.notes) updateDoc.notes = dto.notes;

    // Automatically assign matching CRM tag
    let autoTag: string | null = null;
    if (dto.category === PublicUserCategory.SUPPORTER) autoTag = 'Supporter';
    if (dto.category === PublicUserCategory.MEMBER) autoTag = 'Member';
    if (dto.category === PublicUserCategory.VOLUNTEER) autoTag = 'Volunteer';

    const updateOps: any = { $set: updateDoc };
    if (autoTag) {
      updateOps.$addToSet = { tags: autoTag };
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), tenantId: tenant._id },
      updateOps,
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    return {
      message: `Citizen category upgraded to "${dto.category}" successfully`,
      citizen: user,
    };
  }

  /**
   * Upgrade Membership / Assign Member Role (SRS Sec 40)
   */
  async assignMembership(
    tenant: TenantDocument,
    id: string,
    dto: AssignMembershipDto,
    adminId?: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: tenant._id,
    });

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    const now = new Date();
    const defaultExp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const membershipNumber =
      dto.membershipNumber ||
      `MEM-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const status = dto.status || MembershipStatus.APPROVED;

    const membership = await this.membershipModel.findOneAndUpdate(
      { tenantId: tenant._id, userId: user._id },
      {
        $set: {
          status,
          designation: dto.designation || 'Active Member',
          membershipNumber,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : defaultExp,
          photoUrl: dto.photoUrl || user.profilePhoto,
          paymentInfo: dto.paymentInfo || {},
          approvedBy: adminId ? new Types.ObjectId(adminId) : undefined,
          approvedAt: now,
        },
      },
      { upsert: true, new: true },
    );

    // Sync user model category & CRM tags
    user.category = PublicUserCategory.MEMBER;
    if (!user.tags.includes('Active Member')) user.tags.push('Active Member');
    if (!user.tags.includes('Member')) user.tags.push('Member');
    if (dto.notes) user.notes = dto.notes;
    await user.save();

    return {
      message: 'Citizen successfully upgraded to Member',
      citizen: user,
      membership,
    };
  }

  /**
   * Assign Volunteer Role (SRS Sec 40)
   */
  async assignVolunteer(
    tenant: TenantDocument,
    id: string,
    dto: AssignVolunteerDto,
    adminId?: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid citizen ID format');
    }

    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: tenant._id,
    });

    if (!user) {
      throw new NotFoundException(`Citizen with ID "${id}" not found`);
    }

    const assignedAreaId =
      dto.assignedAreaId && Types.ObjectId.isValid(dto.assignedAreaId)
        ? new Types.ObjectId(dto.assignedAreaId)
        : user.areaId;

    const volunteer = await this.volunteerModel.findOneAndUpdate(
      { tenantId: tenant._id, userId: user._id },
      {
        $set: {
          role: dto.role,
          assignedAreaId,
          status: dto.status || VolunteerStatus.ACTIVE,
          tasks: dto.tasks || [],
          assignedBy: adminId ? new Types.ObjectId(adminId) : undefined,
          notes: dto.notes,
        },
      },
      { upsert: true, new: true },
    );

    // Sync user category & tags
    user.category = PublicUserCategory.VOLUNTEER;
    if (!user.tags.includes('Volunteer')) user.tags.push('Volunteer');
    await user.save();

    return {
      message: `Citizen assigned volunteer role "${dto.role}" successfully`,
      citizen: user,
      volunteer,
    };
  }

  // ---------------------------------------------------------
  // SRS Sec 40 & 58: Data Export System (CSV format)
  // ---------------------------------------------------------

  /**
   * Export filtered citizen records as CSV download
   */
  async exportCitizens(tenant: TenantDocument, queryDto: CitizenQueryDto, res: Response) {
    const mongoQuery = await this.buildCitizenFilterQuery(tenant, queryDto);

    const users = await this.userModel
      .find(mongoQuery)
      .populate('areaId', 'name type code')
      .sort({ createdAt: -1 })
      .limit(10000)
      .lean();

    const userIds = users.map((u) => u._id);
    const [memberships, volunteers] = await Promise.all([
      this.membershipModel
        .find({ tenantId: tenant._id, userId: { $in: userIds } })
        .select('userId status designation membershipNumber')
        .lean(),
      this.volunteerModel
        .find({ tenantId: tenant._id, userId: { $in: userIds } })
        .select('userId role status')
        .lean(),
    ]);

    const membershipMap = new Map(memberships.map((m) => [m.userId.toString(), m]));
    const volunteerMap = new Map(volunteers.map((v) => [v.userId.toString(), v]));

    // RFC-4180 CSV builder with escaping
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Citizen ID',
      'Full Name',
      'Mobile Number',
      'Email',
      'Gender',
      'Date of Birth',
      'Age',
      'Area',
      'Category',
      'Status',
      'CRM Tags',
      'Membership Status',
      'Membership Number',
      'Volunteer Role',
      'Profile Completed',
      'Registered Date',
    ];

    const rows = users.map((u: any) => {
      const uId = u._id.toString();
      const area = u.areaId as any;
      const mem = membershipMap.get(uId);
      const vol = volunteerMap.get(uId);
      const age = this.calculateAge(u.dob);

      return [
        escapeCsv(uId),
        escapeCsv(u.name || ''),
        escapeCsv(u.mobile || ''),
        escapeCsv(u.email || ''),
        escapeCsv(u.gender || ''),
        escapeCsv(u.dob ? new Date(u.dob).toISOString().split('T')[0] : ''),
        escapeCsv(age !== null ? age : ''),
        escapeCsv(area ? `${area.name} (${area.type || 'Area'})` : ''),
        escapeCsv(u.category || 'citizen'),
        escapeCsv(u.status || 'active'),
        escapeCsv((u.tags || []).join('; ')),
        escapeCsv(mem ? mem.status : 'None'),
        escapeCsv(mem ? mem.membershipNumber : ''),
        escapeCsv(vol ? `${vol.role} (${vol.status})` : 'None'),
        escapeCsv(u.isProfileComplete ? 'Yes' : 'No'),
        escapeCsv(u.createdAt ? new Date(u.createdAt).toISOString() : ''),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `citizens-${tenant.slug || 'export'}-${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    return res.status(200).send(csvContent);
  }

  // ---------------------------------------------------------
  // SRS Sec 44: CRM Analytics & Insights
  // ---------------------------------------------------------

  /**
   * High-Level CRM KPIs and Demographic Analytics
   */
  async getCrmAnalytics(tenant: TenantDocument) {
    const tenantId = tenant._id;
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCitizens,
      newToday,
      newThisWeek,
      newThisMonth,
      activeCount,
      inactiveCount,
      blockedCount,
      profileCompleteCount,
      categoryCounts,
      genderCounts,
      topTags,
      topAreas,
    ] = await Promise.all([
      this.userModel.countDocuments({ tenantId }),
      this.userModel.countDocuments({ tenantId, createdAt: { $gte: startOfToday } }),
      this.userModel.countDocuments({ tenantId, createdAt: { $gte: startOfWeek } }),
      this.userModel.countDocuments({ tenantId, createdAt: { $gte: startOfMonth } }),
      this.userModel.countDocuments({ tenantId, status: CitizenStatus.ACTIVE }),
      this.userModel.countDocuments({ tenantId, status: CitizenStatus.INACTIVE }),
      this.userModel.countDocuments({ tenantId, status: CitizenStatus.BLOCKED }),
      this.userModel.countDocuments({ tenantId, isProfileComplete: true }),

      // Category breakdown
      this.userModel.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),

      // Gender distribution
      this.userModel.aggregate([
        { $match: { tenantId } },
        { $group: { _id: { $ifNull: ['$gender', 'Unspecified'] }, count: { $sum: 1 } } },
      ]),

      // Top CRM Tags
      this.userModel.aggregate([
        { $match: { tenantId } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Top Areas
      this.userModel.aggregate([
        { $match: { tenantId, areaId: { $ne: null } } },
        { $group: { _id: '$areaId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
        { $unwind: '$area' },
        { $project: { areaId: '$_id', areaName: '$area.name', areaType: '$area.type', count: 1 } },
      ]),
    ]);

    // Format Category Map
    const categories: Record<string, number> = {
      citizen: 0,
      supporter: 0,
      member: 0,
      volunteer: 0,
    };
    categoryCounts.forEach((c) => {
      if (c._id) categories[c._id] = c.count;
    });

    // Format Gender Map
    const genders: Record<string, number> = {};
    genderCounts.forEach((g) => {
      genders[g._id] = g.count;
    });

    return {
      overview: {
        totalCitizens,
        newToday,
        newThisWeek,
        newThisMonth,
        active: activeCount,
        inactive: inactiveCount,
        blocked: blockedCount,
        profileComplete: profileCompleteCount,
        profileCompleteRate:
          totalCitizens > 0 ? `${Math.round((profileCompleteCount / totalCitizens) * 100)}%` : '0%',
      },
      categories,
      demographics: {
        gender: genders,
      },
      topTags: topTags.map((t) => ({ tag: t._id, count: t.count })),
      topAreas,
    };
  }
}

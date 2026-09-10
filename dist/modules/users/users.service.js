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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const complaint_schema_1 = require("../complaints/complaint.schema");
const area_schema_1 = require("../areas/area.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const citizens_dto_1 = require("./citizens.dto");
const types_1 = require("../../shared/types");
let UsersService = class UsersService {
    constructor(userModel, membershipModel, volunteerModel, complaintModel, areaModel, auditLogsService) {
        this.userModel = userModel;
        this.membershipModel = membershipModel;
        this.volunteerModel = volunteerModel;
        this.complaintModel = complaintModel;
        this.areaModel = areaModel;
        this.auditLogsService = auditLogsService;
    }
    async findAll(tenant, filters) {
        const { areaId, search, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id };
        if (areaId)
            query.areaId = areaId;
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
    async findOne(tenant, id) {
        const user = await this.userModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate('areaId', 'name type code');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(tenant, userId, data) {
        const user = await this.userModel.findOneAndUpdate({ _id: userId, tenantId: tenant._id }, { $set: { ...data, isProfileComplete: true } }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async toggleActive(tenant, id, isActive) {
        const status = isActive ? citizens_dto_1.CitizenStatus.ACTIVE : citizens_dto_1.CitizenStatus.INACTIVE;
        return this.userModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { isActive, status }, { new: true });
    }
    async getStats(tenant) {
        const [total, active, profileComplete] = await Promise.all([
            this.userModel.countDocuments({ tenantId: tenant._id }),
            this.userModel.countDocuments({ tenantId: tenant._id, isActive: true }),
            this.userModel.countDocuments({ tenantId: tenant._id, isProfileComplete: true }),
        ]);
        return { total, active, profileComplete };
    }
    async getAreaWiseCount(tenant) {
        return this.userModel.aggregate([
            { $match: { tenantId: tenant._id } },
            { $group: { _id: '$areaId', count: { $sum: 1 } } },
            { $lookup: { from: 'areas', localField: '_id', foreignField: '_id', as: 'area' } },
            { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
            { $project: { areaName: '$area.name', count: 1 } },
            { $sort: { count: -1 } },
        ]);
    }
    async buildCitizenFilterQuery(tenant, q) {
        const query = { tenantId: tenant._id };
        if (q.search) {
            const regex = new RegExp(q.search.trim(), 'i');
            query.$or = [{ name: regex }, { mobile: regex }, { email: regex }];
        }
        else {
            if (q.name)
                query.name = new RegExp(q.name.trim(), 'i');
            if (q.mobile)
                query.mobile = new RegExp(q.mobile.trim(), 'i');
        }
        if (q.areaId) {
            if (mongoose_2.Types.ObjectId.isValid(q.areaId)) {
                query.areaId = new mongoose_2.Types.ObjectId(q.areaId);
            }
            else {
                query.areaId = q.areaId;
            }
        }
        if (q.gender) {
            query.gender = new RegExp(`^${q.gender.trim()}$`, 'i');
        }
        let minAge = q.minAge;
        let maxAge = q.maxAge;
        if (q.ageGroup) {
            if (q.ageGroup.includes('-')) {
                const [low, high] = q.ageGroup.split('-').map((n) => parseInt(n.trim(), 10));
                if (!isNaN(low))
                    minAge = low;
                if (!isNaN(high))
                    maxAge = high;
            }
            else if (q.ageGroup.includes('+')) {
                const low = parseInt(q.ageGroup.replace('+', '').trim(), 10);
                if (!isNaN(low))
                    minAge = low;
            }
            else if (q.ageGroup.startsWith('<')) {
                const high = parseInt(q.ageGroup.replace('<', '').trim(), 10);
                if (!isNaN(high))
                    maxAge = high;
            }
        }
        if (minAge !== undefined || maxAge !== undefined) {
            const now = new Date();
            query.dob = {};
            if (minAge !== undefined) {
                const maxDob = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
                query.dob.$lte = maxDob;
            }
            if (maxAge !== undefined) {
                const minDob = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
                query.dob.$gte = minDob;
            }
        }
        const tagList = [];
        if (q.tag)
            tagList.push(q.tag.trim());
        if (q.tags) {
            const splitTags = q.tags.split(',').map((t) => t.trim()).filter(Boolean);
            tagList.push(...splitTags);
        }
        if (tagList.length > 0) {
            query.tags = { $in: tagList };
        }
        if (q.category) {
            query.category = q.category;
        }
        if (q.status) {
            query.status = q.status;
        }
        if (q.startDate || q.endDate) {
            query.createdAt = {};
            if (q.startDate)
                query.createdAt.$gte = new Date(q.startDate);
            if (q.endDate)
                query.createdAt.$lte = new Date(q.endDate);
        }
        if (q.membershipStatus) {
            if (q.membershipStatus === 'none') {
                const memberUserIds = await this.membershipModel
                    .find({ tenantId: tenant._id })
                    .distinct('userId');
                query._id = { ...(query._id || {}), $nin: memberUserIds };
            }
            else {
                const memberUserIds = await this.membershipModel
                    .find({ tenantId: tenant._id, status: q.membershipStatus })
                    .distinct('userId');
                query._id = { ...(query._id || {}), $in: memberUserIds };
            }
        }
        if (q.volunteerStatus) {
            if (q.volunteerStatus === 'none') {
                const volUserIds = await this.volunteerModel
                    .find({ tenantId: tenant._id })
                    .distinct('userId');
                query._id = { ...(query._id || {}), $nin: volUserIds };
            }
            else {
                const volUserIds = await this.volunteerModel
                    .find({ tenantId: tenant._id, status: q.volunteerStatus })
                    .distinct('userId');
                query._id = { ...(query._id || {}), $in: volUserIds };
            }
        }
        return query;
    }
    calculateAge(dob) {
        if (!dob)
            return null;
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime()))
            return null;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? age : null;
    }
    async findCitizens(tenant, queryDto) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', } = queryDto;
        const mongoQuery = await this.buildCitizenFilterQuery(tenant, queryDto);
        const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
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
    async getCitizenDetails(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const user = await this.userModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id })
            .populate('areaId', 'name type code parentAreaId')
            .lean();
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        const userId = user._id;
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
    async updateCitizen(tenant, id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const updateDoc = {};
        if (dto.name !== undefined)
            updateDoc.name = dto.name;
        if (dto.email !== undefined)
            updateDoc.email = dto.email;
        if (dto.dob !== undefined)
            updateDoc.dob = dto.dob ? new Date(dto.dob) : null;
        if (dto.gender !== undefined)
            updateDoc.gender = dto.gender;
        if (dto.areaId !== undefined) {
            updateDoc.areaId =
                dto.areaId && mongoose_2.Types.ObjectId.isValid(dto.areaId)
                    ? new mongoose_2.Types.ObjectId(dto.areaId)
                    : null;
        }
        if (dto.profilePhoto !== undefined)
            updateDoc.profilePhoto = dto.profilePhoto;
        if (dto.address !== undefined)
            updateDoc.address = dto.address;
        if (dto.notes !== undefined)
            updateDoc.notes = dto.notes;
        if (dto.customFields && typeof dto.customFields === 'object') {
            for (const [k, v] of Object.entries(dto.customFields)) {
                updateDoc[`customFields.${k}`] = v;
            }
        }
        const updated = await this.userModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id }, { $set: updateDoc }, { new: true })
            .populate('areaId', 'name type code');
        if (!updated) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        return {
            message: 'Citizen profile updated successfully',
            citizen: updated,
        };
    }
    async updateCitizenStatus(tenant, id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const isActive = dto.status === citizens_dto_1.CitizenStatus.ACTIVE;
        const updateDoc = {
            status: dto.status,
            isActive,
        };
        if (dto.reason) {
            updateDoc.notes = dto.reason;
        }
        const user = await this.userModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id }, { $set: updateDoc }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        return {
            message: `Citizen status changed to "${dto.status}"`,
            citizen: user,
        };
    }
    async getAvailableTags(tenant) {
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
            suggestedTags: citizens_dto_1.PREDEFINED_CRM_TAGS,
            totalUniqueTags: tags.length,
        };
    }
    async addTags(tenant, id, tags) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
        if (cleanTags.length === 0) {
            throw new common_1.BadRequestException('At least one non-empty tag must be provided');
        }
        const user = await this.userModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id }, { $addToSet: { tags: { $each: cleanTags } } }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        return {
            message: `Added tags [${cleanTags.join(', ')}] successfully`,
            tags: user.tags,
            citizen: user,
        };
    }
    async removeTag(tenant, id, tag) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const cleanTag = tag.trim();
        const user = await this.userModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id }, { $pull: { tags: cleanTag } }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        return {
            message: `Tag "${cleanTag}" removed successfully`,
            tags: user.tags,
            citizen: user,
        };
    }
    async bulkAddTags(tenant, userIds, tags) {
        const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
        if (cleanTags.length === 0) {
            throw new common_1.BadRequestException('At least one non-empty tag must be provided');
        }
        const validIds = userIds
            .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
            .map((id) => new mongoose_2.Types.ObjectId(id));
        if (validIds.length === 0) {
            throw new common_1.BadRequestException('No valid citizen IDs provided');
        }
        const result = await this.userModel.updateMany({ tenantId: tenant._id, _id: { $in: validIds } }, { $addToSet: { tags: { $each: cleanTags } } });
        return {
            success: true,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            tagsAdded: cleanTags,
            message: `Tags added to ${result.modifiedCount} citizens successfully`,
        };
    }
    async bulkRemoveTag(tenant, userIds, tag) {
        const cleanTag = tag.trim();
        const validIds = userIds
            .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
            .map((id) => new mongoose_2.Types.ObjectId(id));
        if (validIds.length === 0) {
            throw new common_1.BadRequestException('No valid citizen IDs provided');
        }
        const result = await this.userModel.updateMany({ tenantId: tenant._id, _id: { $in: validIds } }, { $pull: { tags: cleanTag } });
        return {
            success: true,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            tagRemoved: cleanTag,
            message: `Tag "${cleanTag}" removed from ${result.modifiedCount} citizens successfully`,
        };
    }
    async upgradeCategory(tenant, id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const updateDoc = { category: dto.category };
        if (dto.notes)
            updateDoc.notes = dto.notes;
        let autoTag = null;
        if (dto.category === citizens_dto_1.PublicUserCategory.SUPPORTER)
            autoTag = 'Supporter';
        if (dto.category === citizens_dto_1.PublicUserCategory.MEMBER)
            autoTag = 'Member';
        if (dto.category === citizens_dto_1.PublicUserCategory.VOLUNTEER)
            autoTag = 'Volunteer';
        const updateOps = { $set: updateDoc };
        if (autoTag) {
            updateOps.$addToSet = { tags: autoTag };
        }
        const user = await this.userModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id }, updateOps, { new: true });
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        return {
            message: `Citizen category upgraded to "${dto.category}" successfully`,
            citizen: user,
        };
    }
    async assignMembership(tenant, id, dto, adminId) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const user = await this.userModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            tenantId: tenant._id,
        });
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        const now = new Date();
        const defaultExp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        const membershipNumber = dto.membershipNumber ||
            `MEM-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const status = dto.status || types_1.MembershipStatus.APPROVED;
        const membership = await this.membershipModel.findOneAndUpdate({ tenantId: tenant._id, userId: user._id }, {
            $set: {
                status,
                designation: dto.designation || 'Active Member',
                membershipNumber,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : defaultExp,
                photoUrl: dto.photoUrl || user.profilePhoto,
                paymentInfo: dto.paymentInfo || {},
                approvedBy: adminId ? new mongoose_2.Types.ObjectId(adminId) : undefined,
                approvedAt: now,
            },
        }, { upsert: true, new: true });
        user.category = citizens_dto_1.PublicUserCategory.MEMBER;
        if (!user.tags.includes('Active Member'))
            user.tags.push('Active Member');
        if (!user.tags.includes('Member'))
            user.tags.push('Member');
        if (dto.notes)
            user.notes = dto.notes;
        await user.save();
        return {
            message: 'Citizen successfully upgraded to Member',
            citizen: user,
            membership,
        };
    }
    async assignVolunteer(tenant, id, dto, adminId) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid citizen ID format');
        }
        const user = await this.userModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            tenantId: tenant._id,
        });
        if (!user) {
            throw new common_1.NotFoundException(`Citizen with ID "${id}" not found`);
        }
        const assignedAreaId = dto.assignedAreaId && mongoose_2.Types.ObjectId.isValid(dto.assignedAreaId)
            ? new mongoose_2.Types.ObjectId(dto.assignedAreaId)
            : user.areaId;
        const volunteer = await this.volunteerModel.findOneAndUpdate({ tenantId: tenant._id, userId: user._id }, {
            $set: {
                role: dto.role,
                assignedAreaId,
                status: dto.status || types_1.VolunteerStatus.ACTIVE,
                tasks: dto.tasks || [],
                assignedBy: adminId ? new mongoose_2.Types.ObjectId(adminId) : undefined,
                notes: dto.notes,
            },
        }, { upsert: true, new: true });
        user.category = citizens_dto_1.PublicUserCategory.VOLUNTEER;
        if (!user.tags.includes('Volunteer'))
            user.tags.push('Volunteer');
        await user.save();
        return {
            message: `Citizen assigned volunteer role "${dto.role}" successfully`,
            citizen: user,
            volunteer,
        };
    }
    async exportCitizens(tenant, queryDto, res, adminUser, ipAddress, userAgent) {
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
        const escapeCsv = (val) => {
            if (val === null || val === undefined)
                return '""';
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
        const rows = users.map((u) => {
            const uId = u._id.toString();
            const area = u.areaId;
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
        const isExcel = (queryDto.format || '').toLowerCase() === 'excel' || (queryDto.format || '').toLowerCase() === 'xlsx';
        const bom = '\uFEFF';
        const csvContent = bom + [headers.join(','), ...rows].join('\r\n');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `citizens-${tenant.slug || 'export'}-${timestamp}.csv`;
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
                action: 'DATA_EXPORT_CITIZENS',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    format: isExcel ? 'excel' : 'csv',
                    recordCount: users.length,
                    filterQuery: queryDto,
                    filename,
                },
                ipAddress,
                userAgent,
            })
                .catch(() => { });
        }
        return res.status(200).send(csvContent);
    }
    async getCrmAnalytics(tenant) {
        const tenantId = tenant._id;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalCitizens, newToday, newThisWeek, newThisMonth, activeCount, inactiveCount, blockedCount, profileCompleteCount, categoryCounts, genderCounts, topTags, topAreas,] = await Promise.all([
            this.userModel.countDocuments({ tenantId }),
            this.userModel.countDocuments({ tenantId, createdAt: { $gte: startOfToday } }),
            this.userModel.countDocuments({ tenantId, createdAt: { $gte: startOfWeek } }),
            this.userModel.countDocuments({ tenantId, createdAt: { $gte: startOfMonth } }),
            this.userModel.countDocuments({ tenantId, status: citizens_dto_1.CitizenStatus.ACTIVE }),
            this.userModel.countDocuments({ tenantId, status: citizens_dto_1.CitizenStatus.INACTIVE }),
            this.userModel.countDocuments({ tenantId, status: citizens_dto_1.CitizenStatus.BLOCKED }),
            this.userModel.countDocuments({ tenantId, isProfileComplete: true }),
            this.userModel.aggregate([
                { $match: { tenantId } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
            ]),
            this.userModel.aggregate([
                { $match: { tenantId } },
                { $group: { _id: { $ifNull: ['$gender', 'Unspecified'] }, count: { $sum: 1 } } },
            ]),
            this.userModel.aggregate([
                { $match: { tenantId } },
                { $unwind: '$tags' },
                { $group: { _id: '$tags', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
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
        const categories = {
            citizen: 0,
            supporter: 0,
            member: 0,
            volunteer: 0,
        };
        categoryCounts.forEach((c) => {
            if (c._id)
                categories[c._id] = c.count;
        });
        const genders = {};
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
                profileCompleteRate: totalCitizens > 0 ? `${Math.round((profileCompleteCount / totalCitizens) * 100)}%` : '0%',
            },
            categories,
            demographics: {
                gender: genders,
            },
            topTags: topTags.map((t) => ({ tag: t._id, count: t.count })),
            topAreas,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(2, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(3, (0, mongoose_1.InjectModel)(complaint_schema_1.Complaint.name)),
    __param(4, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __param(5, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], UsersService);
//# sourceMappingURL=users.service.js.map
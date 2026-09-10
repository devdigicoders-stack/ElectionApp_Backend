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
var PollsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const poll_schema_1 = require("./poll.schema");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
const membership_schema_1 = require("../membership/membership.schema");
const volunteer_schema_1 = require("../volunteers/volunteer.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const types_1 = require("../../shared/types");
const uuid_1 = require("uuid");
let PollsService = PollsService_1 = class PollsService {
    constructor(pollModel, voteModel, userModel, areaModel, membershipModel, volunteerModel, auditLogsService) {
        this.pollModel = pollModel;
        this.voteModel = voteModel;
        this.userModel = userModel;
        this.areaModel = areaModel;
        this.membershipModel = membershipModel;
        this.volunteerModel = volunteerModel;
        this.auditLogsService = auditLogsService;
        this.logger = new common_1.Logger(PollsService_1.name);
    }
    async seedDefaultPollsIfEmpty(tenant) {
        const count = await this.pollModel.countDocuments({ tenantId: tenant._id });
        if (count > 0)
            return;
        this.logger.log(`Seeding default opinion polls for tenant "${tenant.slug}"...`);
        const samplePolls = [
            {
                tenantId: tenant._id,
                question: 'Which constituency development initiative should be prioritized this quarter?',
                description: 'Voice your priority for the upcoming infrastructure and welfare budget allocation.',
                category: 'Development',
                options: [
                    { optionId: (0, uuid_1.v4)(), text: 'Road widening & solar street lighting network', votes: 0 },
                    { optionId: (0, uuid_1.v4)(), text: 'Modernized primary health center & diagnostic lab', votes: 0 },
                    { optionId: (0, uuid_1.v4)(), text: 'Clean drinking water pipeline & RO water kiosks', votes: 0 },
                    { optionId: (0, uuid_1.v4)(), text: 'Youth sports complex & community digital library', votes: 0 },
                ],
                targetAudience: types_1.PollTargetAudience.ALL,
                resultVisibility: types_1.PollResultVisibility.AFTER_VOTE,
                allowRevote: false,
                isActive: true,
                startsAt: new Date(),
                endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                totalVotes: 0,
            },
            {
                tenantId: tenant._id,
                question: 'Are you satisfied with the recent agricultural electricity subsidy rollout?',
                description: 'Feedback for our policy working committee to assess grassroot welfare impact.',
                category: 'Public Policy',
                options: [
                    { optionId: (0, uuid_1.v4)(), text: 'Yes, highly beneficial and timely', votes: 0 },
                    { optionId: (0, uuid_1.v4)(), text: 'Somewhat satisfied, but needs faster disbursement', votes: 0 },
                    { optionId: (0, uuid_1.v4)(), text: 'Not satisfied, requires higher power quota', votes: 0 },
                ],
                targetAudience: types_1.PollTargetAudience.ALL,
                resultVisibility: types_1.PollResultVisibility.ALWAYS_PUBLIC,
                allowRevote: true,
                isActive: true,
                startsAt: new Date(),
                endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                totalVotes: 0,
            },
        ];
        await this.pollModel.insertMany(samplePolls);
    }
    async create(tenant, dto) {
        if (!dto.options || dto.options.length < 2) {
            throw new common_1.BadRequestException('A poll must contain at least 2 options');
        }
        const uniqueOptions = Array.from(new Set(dto.options.map((o) => o.trim()))).filter(Boolean);
        if (uniqueOptions.length < 2) {
            throw new common_1.BadRequestException('Options must be unique and non-empty');
        }
        const formattedOptions = uniqueOptions.map((text) => ({
            optionId: (0, uuid_1.v4)(),
            text,
            votes: 0,
        }));
        const startsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();
        const endsAt = dto.endsAt ? new Date(dto.endsAt) : undefined;
        if (endsAt && endsAt <= startsAt) {
            throw new common_1.BadRequestException('End date must be after the start date');
        }
        const targetAreaId = dto.targetAreaId ? new mongoose_2.Types.ObjectId(dto.targetAreaId) : undefined;
        const poll = await this.pollModel.create({
            tenantId: tenant._id,
            question: dto.question.trim(),
            description: dto.description || '',
            category: dto.category || 'General',
            options: formattedOptions,
            startsAt,
            endsAt,
            targetAudience: dto.targetAudience || types_1.PollTargetAudience.ALL,
            targetAreaId,
            targetGender: dto.targetGender || undefined,
            targetMinAge: dto.targetMinAge !== undefined ? dto.targetMinAge : undefined,
            targetMaxAge: dto.targetMaxAge !== undefined ? dto.targetMaxAge : undefined,
            resultVisibility: dto.resultVisibility || types_1.PollResultVisibility.AFTER_VOTE,
            allowRevote: dto.allowRevote ?? false,
            isActive: dto.isActive ?? true,
            totalVotes: 0,
        });
        return poll;
    }
    async findAll(tenant, queryDto, user, isAdmin = false) {
        await this.seedDefaultPollsIfEmpty(tenant);
        const filter = { tenantId: tenant._id };
        if (!isAdmin) {
            filter.isActive = true;
        }
        if (queryDto.category) {
            filter.category = queryDto.category;
        }
        if (queryDto.areaId) {
            filter.$or = [{ targetAreaId: null }, { targetAreaId: new mongoose_2.Types.ObjectId(queryDto.areaId) }];
        }
        const now = new Date();
        if (queryDto.status === 'active') {
            filter.isActive = true;
            filter.$or = [{ endsAt: null }, { endsAt: { $gt: now } }];
        }
        else if (queryDto.status === 'ended') {
            filter.$or = [{ isActive: false }, { endsAt: { $lte: now } }];
        }
        const page = Math.max(1, Number(queryDto.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(queryDto.limit) || 20));
        const skip = (page - 1) * limit;
        const [polls, total] = await Promise.all([
            this.pollModel
                .find(filter)
                .populate('targetAreaId', 'name code')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.pollModel.countDocuments(filter),
        ]);
        let userVoteMap = new Map();
        if (user?.sub) {
            const pollIds = polls.map((p) => p._id);
            const userVotes = await this.voteModel.find({
                tenantId: tenant._id,
                userId: new mongoose_2.Types.ObjectId(user.sub),
                pollId: { $in: pollIds },
            });
            userVotes.forEach((v) => userVoteMap.set(v.pollId.toString(), v.optionId));
        }
        const items = polls.map((p) => {
            const myOptionId = userVoteMap.get(p._id.toString());
            const hasVoted = Boolean(myOptionId);
            const isEnded = Boolean((p.endsAt && p.endsAt <= now) || !p.isActive);
            const canViewResults = isAdmin ||
                p.resultVisibility === types_1.PollResultVisibility.ALWAYS_PUBLIC ||
                (p.resultVisibility === types_1.PollResultVisibility.AFTER_VOTE && hasVoted) ||
                (p.resultVisibility === types_1.PollResultVisibility.AFTER_END && isEnded);
            const totalVotes = p.totalVotes || 0;
            const options = p.options.map((opt) => {
                if (canViewResults) {
                    const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 1000) / 10 : 0;
                    return {
                        optionId: opt.optionId,
                        text: opt.text,
                        votes: opt.votes,
                        percentage,
                    };
                }
                return {
                    optionId: opt.optionId,
                    text: opt.text,
                };
            });
            return {
                _id: p._id,
                question: p.question,
                description: p.description,
                category: p.category,
                options,
                totalVotes: canViewResults ? totalVotes : undefined,
                targetAudience: p.targetAudience,
                targetArea: p.targetAreaId,
                startsAt: p.startsAt,
                endsAt: p.endsAt,
                isActive: p.isActive,
                isEnded,
                allowRevote: p.allowRevote,
                resultVisibility: p.resultVisibility,
                hasVoted,
                myOptionId: myOptionId || null,
                canViewResults,
                createdAt: p.createdAt,
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
    async findOne(tenant, id, user, isAdmin = false) {
        const poll = await this.pollModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate('targetAreaId', 'name code');
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        let userVote = null;
        if (user?.sub) {
            userVote = await this.voteModel.findOne({
                tenantId: tenant._id,
                pollId: poll._id,
                userId: new mongoose_2.Types.ObjectId(user.sub),
            });
        }
        const now = new Date();
        const hasVoted = Boolean(userVote);
        const isEnded = Boolean((poll.endsAt && poll.endsAt <= now) || !poll.isActive);
        const canViewResults = isAdmin ||
            poll.resultVisibility === types_1.PollResultVisibility.ALWAYS_PUBLIC ||
            (poll.resultVisibility === types_1.PollResultVisibility.AFTER_VOTE && hasVoted) ||
            (poll.resultVisibility === types_1.PollResultVisibility.AFTER_END && isEnded);
        const totalVotes = poll.totalVotes || 0;
        const options = poll.options.map((opt) => {
            if (canViewResults) {
                const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 1000) / 10 : 0;
                return {
                    optionId: opt.optionId,
                    text: opt.text,
                    votes: opt.votes,
                    percentage,
                };
            }
            return {
                optionId: opt.optionId,
                text: opt.text,
            };
        });
        return {
            _id: poll._id,
            question: poll.question,
            description: poll.description,
            category: poll.category,
            options,
            totalVotes: canViewResults ? totalVotes : undefined,
            targetAudience: poll.targetAudience,
            targetArea: poll.targetAreaId,
            targetGender: poll.targetGender,
            targetMinAge: poll.targetMinAge,
            targetMaxAge: poll.targetMaxAge,
            startsAt: poll.startsAt,
            endsAt: poll.endsAt,
            isActive: poll.isActive,
            isEnded,
            allowRevote: poll.allowRevote,
            resultVisibility: poll.resultVisibility,
            hasVoted,
            myOptionId: userVote?.optionId || null,
            votedAt: userVote?.createdAt || null,
            canViewResults,
            createdAt: poll.createdAt,
            updatedAt: poll.updatedAt,
        };
    }
    async vote(tenant, pollId, userId, optionId) {
        const poll = await this.pollModel.findOne({
            _id: pollId,
            tenantId: tenant._id,
            isActive: true,
        });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found or inactive');
        }
        const now = new Date();
        if (poll.startsAt && poll.startsAt > now) {
            throw new common_1.BadRequestException('This opinion poll has not started yet');
        }
        if (poll.endsAt && poll.endsAt <= now) {
            throw new common_1.BadRequestException('This opinion poll has already ended');
        }
        const targetOption = poll.options.find((o) => o.optionId === optionId);
        if (!targetOption) {
            throw new common_1.BadRequestException('Invalid option selected');
        }
        const existingVote = await this.voteModel.findOne({
            pollId: poll._id,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (existingVote) {
            if (!poll.allowRevote) {
                throw new common_1.BadRequestException('You have already voted in this poll. Multiple votes are not permitted.');
            }
            if (existingVote.optionId === optionId) {
                return {
                    message: 'You have already voted for this option',
                    hasVoted: true,
                    optionId,
                    totalVotes: poll.totalVotes,
                };
            }
            await this.pollModel.updateOne({ _id: pollId, 'options.optionId': existingVote.optionId }, { $inc: { 'options.$.votes': -1 } });
            await this.pollModel.updateOne({ _id: pollId, 'options.optionId': optionId }, { $inc: { 'options.$.votes': 1 } });
            existingVote.optionId = optionId;
            await existingVote.save();
            return {
                message: 'Your vote has been updated successfully',
                hasVoted: true,
                optionId,
            };
        }
        const user = await this.userModel.findOne({ _id: userId, tenantId: tenant._id });
        if (!user) {
            throw new common_1.NotFoundException('User record not found');
        }
        if (poll.targetAudience === types_1.PollTargetAudience.SPECIFIC_AREA && poll.targetAreaId) {
            if (!user.areaId || user.areaId.toString() !== poll.targetAreaId.toString()) {
                throw new common_1.ForbiddenException('This poll is restricted to residents of the targeted constituency/area');
            }
        }
        if (poll.targetAudience === types_1.PollTargetAudience.MEMBERS_ONLY) {
            const isMemberCategory = user.category === 'member';
            const approvedMembership = await this.membershipModel.findOne({
                tenantId: tenant._id,
                userId: user._id,
                status: types_1.MembershipStatus.APPROVED,
            });
            if (!isMemberCategory && !approvedMembership) {
                throw new common_1.ForbiddenException('This poll is restricted to verified Party Members only');
            }
        }
        if (poll.targetAudience === types_1.PollTargetAudience.VOLUNTEERS_ONLY) {
            const isVolunteerCategory = user.category === 'volunteer';
            const activeVolunteer = await this.volunteerModel.findOne({
                tenantId: tenant._id,
                userId: user._id,
                status: types_1.VolunteerStatus.ACTIVE,
            });
            if (!isVolunteerCategory && !activeVolunteer) {
                throw new common_1.ForbiddenException('This poll is restricted to active registered Volunteers only');
            }
        }
        if (poll.targetAudience === types_1.PollTargetAudience.GENDER && poll.targetGender) {
            const targetGender = poll.targetGender.trim().toLowerCase();
            const userGender = (user.gender || '').trim().toLowerCase();
            if (!userGender || userGender !== targetGender) {
                throw new common_1.ForbiddenException(`This poll is restricted to ${poll.targetGender} participants only`);
            }
        }
        if (poll.targetAudience === types_1.PollTargetAudience.AGE_GROUP) {
            if (!user.dob) {
                throw new common_1.BadRequestException('Please complete your Date of Birth in your profile to participate in age-targeted polls');
            }
            const diffMs = Date.now() - new Date(user.dob).getTime();
            const userAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
            if (poll.targetMinAge !== undefined && userAge < poll.targetMinAge) {
                throw new common_1.ForbiddenException(`This poll requires a minimum age of ${poll.targetMinAge} years (your age: ${userAge})`);
            }
            if (poll.targetMaxAge !== undefined && userAge > poll.targetMaxAge) {
                throw new common_1.ForbiddenException(`This poll requires a maximum age of ${poll.targetMaxAge} years (your age: ${userAge})`);
            }
        }
        let snapshotAge;
        if (user.dob) {
            const diffMs = Date.now() - new Date(user.dob).getTime();
            snapshotAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
        }
        await this.voteModel.create({
            tenantId: tenant._id,
            pollId: poll._id,
            userId: user._id,
            optionId,
            areaId: user.areaId || undefined,
            gender: user.gender || undefined,
            age: snapshotAge,
        });
        await this.pollModel.updateOne({ _id: pollId, 'options.optionId': optionId }, { $inc: { 'options.$.votes': 1, totalVotes: 1 } });
        return {
            message: 'Vote recorded successfully',
            hasVoted: true,
            optionId,
        };
    }
    async getUserVote(tenant, pollId, userId) {
        const vote = await this.voteModel.findOne({
            tenantId: tenant._id,
            pollId: new mongoose_2.Types.ObjectId(pollId),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!vote) {
            return { hasVoted: false, optionId: null };
        }
        return {
            hasVoted: true,
            optionId: vote.optionId,
            votedAt: vote.createdAt,
        };
    }
    async getAnalytics(tenant, pollId) {
        const poll = await this.pollModel
            .findOne({ _id: pollId, tenantId: tenant._id })
            .populate('targetAreaId', 'name code');
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        const totalVotes = poll.totalVotes || 0;
        const totalUsers = await this.userModel.countDocuments({
            tenantId: tenant._id,
            isActive: true,
        });
        const participationRate = totalUsers > 0 ? Math.round((totalVotes / totalUsers) * 1000) / 10 : 0;
        const optionsBreakdown = poll.options.map((opt) => ({
            optionId: opt.optionId,
            text: opt.text,
            votes: opt.votes,
            percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 1000) / 10 : 0,
        }));
        const areaAgg = await this.voteModel.aggregate([
            { $match: { tenantId: tenant._id, pollId: poll._id, areaId: { $ne: null } } },
            { $group: { _id: '$areaId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        const areaIds = areaAgg.map((a) => a._id);
        const areas = await this.areaModel
            .find({ _id: { $in: areaIds } })
            .select('name code')
            .lean();
        const areaMap = new Map();
        areas.forEach((a) => areaMap.set(a._id.toString(), a.name));
        const areaBreakdown = areaAgg.map((a) => ({
            areaId: a._id,
            areaName: areaMap.get(a._id.toString()) || 'Unknown Area',
            votes: a.count,
            percentage: totalVotes > 0 ? Math.round((a.count / totalVotes) * 1000) / 10 : 0,
        }));
        const genderAgg = await this.voteModel.aggregate([
            { $match: { tenantId: tenant._id, pollId: poll._id } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $or: [{ $eq: ['$gender', null] }, { $eq: ['$gender', ''] }] },
                            'Unspecified',
                            { $toLower: '$gender' },
                        ],
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);
        const genderBreakdown = genderAgg.map((g) => ({
            gender: g._id.charAt(0).toUpperCase() + g._id.slice(1),
            votes: g.count,
            percentage: totalVotes > 0 ? Math.round((g.count / totalVotes) * 1000) / 10 : 0,
        }));
        const ageAgg = await this.voteModel.aggregate([
            { $match: { tenantId: tenant._id, pollId: poll._id, age: { $ne: null } } },
            {
                $bucket: {
                    groupBy: '$age',
                    boundaries: [18, 26, 36, 51, 100],
                    default: 'Under 18 / Other',
                    output: { count: { $sum: 1 } },
                },
            },
        ]);
        const ageLabelMap = {
            18: '18-25 years',
            26: '26-35 years',
            36: '36-50 years',
            51: '51+ years',
        };
        const ageGroupBreakdown = ageAgg.map((bucket) => ({
            group: ageLabelMap[bucket._id] || String(bucket._id),
            votes: bucket.count,
            percentage: totalVotes > 0 ? Math.round((bucket.count / totalVotes) * 1000) / 10 : 0,
        }));
        const timelineAgg = await this.voteModel.aggregate([
            { $match: { tenantId: tenant._id, pollId: poll._id } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    votes: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const timeline = timelineAgg.map((t) => ({
            date: t._id,
            votes: t.votes,
        }));
        return {
            poll: {
                _id: poll._id,
                question: poll.question,
                category: poll.category,
                targetAudience: poll.targetAudience,
                targetArea: poll.targetAreaId,
                startsAt: poll.startsAt,
                endsAt: poll.endsAt,
                isActive: poll.isActive,
            },
            summary: {
                totalVotes,
                totalEligibleUsers: totalUsers,
                participationRate,
            },
            options: optionsBreakdown,
            areaBreakdown,
            genderBreakdown,
            ageGroupBreakdown,
            timeline,
        };
    }
    async exportPollCsv(tenant, pollId, res, format = 'csv', adminUser, ipAddress, userAgent) {
        const poll = await this.pollModel.findOne({ _id: pollId, tenantId: tenant._id });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        const votes = await this.voteModel
            .find({ tenantId: tenant._id, pollId: poll._id })
            .populate('userId', 'name mobile gender dob')
            .populate('areaId', 'name code')
            .sort({ createdAt: -1 })
            .lean();
        const optionMap = new Map();
        poll.options.forEach((o) => optionMap.set(o.optionId, o.text));
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
        lines.push(escapeCsv('--- OPINION POLL SUMMARY (SRS SEC 19) ---'));
        lines.push(`${escapeCsv('Question')},${escapeCsv(poll.question)}`);
        lines.push(`${escapeCsv('Category')},${escapeCsv(poll.category || 'General')}`);
        lines.push(`${escapeCsv('Total Votes')},${escapeCsv(poll.totalVotes)}`);
        lines.push(`${escapeCsv('Target Audience')},${escapeCsv(poll.targetAudience)}`);
        lines.push(`${escapeCsv('Start Date')},${escapeCsv(poll.startsAt ? poll.startsAt.toISOString() : 'N/A')}`);
        lines.push(`${escapeCsv('End Date')},${escapeCsv(poll.endsAt ? poll.endsAt.toISOString() : 'No Expiry')}`);
        lines.push('');
        lines.push(escapeCsv('--- OPTION BREAKDOWN ---'));
        lines.push('Option Text,Vote Count,Percentage');
        poll.options.forEach((opt) => {
            const pct = poll.totalVotes > 0 ? ((opt.votes / poll.totalVotes) * 100).toFixed(1) + '%' : '0.0%';
            lines.push(`${escapeCsv(opt.text)},${escapeCsv(opt.votes)},${escapeCsv(pct)}`);
        });
        lines.push('');
        lines.push(escapeCsv('--- DETAILED VOTER AUDIT TRAIL ---'));
        lines.push('Vote Timestamp,Voter Name,Masked Mobile,Gender,Age,Area / Constituency,Selected Option');
        votes.forEach((v) => {
            const user = v.userId || {};
            const area = v.areaId || {};
            const optionText = optionMap.get(v.optionId) || v.optionId;
            const votedAt = v.createdAt ? new Date(v.createdAt).toISOString() : 'N/A';
            lines.push([
                escapeCsv(votedAt),
                escapeCsv(user.name || 'Citizen Voter'),
                escapeCsv(maskMobile(user.mobile)),
                escapeCsv(v.gender || user.gender || 'Unspecified'),
                escapeCsv(v.age !== undefined ? v.age : 'N/A'),
                escapeCsv(area.name || 'General'),
                escapeCsv(optionText),
            ].join(','));
        });
        const isExcel = (format || '').toLowerCase() === 'excel' || (format || '').toLowerCase() === 'xlsx';
        const bom = '\uFEFF';
        const csvContent = bom + lines.join('\r\n');
        const filename = `poll_${poll._id}_results.csv`;
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
                action: 'DATA_EXPORT_POLLS',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    format: isExcel ? 'excel' : 'csv',
                    pollId: poll._id.toString(),
                    pollQuestion: poll.question,
                    recordCount: votes.length,
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
        const poll = await this.pollModel.findOne({ _id: id, tenantId: tenant._id });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (dto.question !== undefined)
            poll.question = dto.question.trim();
        if (dto.description !== undefined)
            poll.description = dto.description;
        if (dto.category !== undefined)
            poll.category = dto.category;
        if (dto.isActive !== undefined)
            poll.isActive = dto.isActive;
        if (dto.allowRevote !== undefined)
            poll.allowRevote = dto.allowRevote;
        if (dto.targetAudience !== undefined)
            poll.targetAudience = dto.targetAudience;
        if (dto.resultVisibility !== undefined)
            poll.resultVisibility = dto.resultVisibility;
        if (dto.targetGender !== undefined)
            poll.targetGender = dto.targetGender;
        if (dto.targetMinAge !== undefined)
            poll.targetMinAge = dto.targetMinAge;
        if (dto.targetMaxAge !== undefined)
            poll.targetMaxAge = dto.targetMaxAge;
        if (dto.targetAreaId !== undefined) {
            poll.targetAreaId = dto.targetAreaId ? new mongoose_2.Types.ObjectId(dto.targetAreaId) : undefined;
        }
        if (dto.startsAt !== undefined) {
            poll.startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
        }
        if (dto.endsAt !== undefined) {
            poll.endsAt = dto.endsAt ? new Date(dto.endsAt) : undefined;
        }
        if (dto.options && dto.options.length >= 2) {
            if (poll.totalVotes > 0) {
                throw new common_1.BadRequestException('Cannot replace options after votes have already been recorded');
            }
            poll.options = dto.options.map((text) => ({
                optionId: (0, uuid_1.v4)(),
                text: text.trim(),
                votes: 0,
            }));
        }
        return poll.save();
    }
    async remove(tenant, id) {
        const poll = await this.pollModel.findOne({ _id: id, tenantId: tenant._id });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        await Promise.all([
            this.pollModel.deleteOne({ _id: poll._id }),
            this.voteModel.deleteMany({ pollId: poll._id }),
        ]);
        return { message: `Poll #${id} and all associated votes have been successfully deleted.` };
    }
};
exports.PollsService = PollsService;
exports.PollsService = PollsService = PollsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(poll_schema_1.Poll.name)),
    __param(1, (0, mongoose_1.InjectModel)(poll_schema_1.PollVote.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __param(4, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(5, (0, mongoose_1.InjectModel)(volunteer_schema_1.Volunteer.name)),
    __param(6, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], PollsService);
//# sourceMappingURL=polls.service.js.map
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Poll, PollDocument, PollVote, PollVoteDocument } from './poll.schema';
import { User, UserDocument } from '../users/user.schema';
import { Area, AreaDocument } from '../areas/area.schema';
import { Membership, MembershipDocument } from '../membership/membership.schema';
import { Volunteer, VolunteerDocument } from '../volunteers/volunteer.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import {
  PollTargetAudience,
  PollResultVisibility,
  PollStatus,
  MembershipStatus,
  VolunteerStatus,
} from '../../shared/types';
import { CreatePollDto, UpdatePollDto, QueryPollsDto, VotePollDto } from './polls.dto';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

export function getPollComputedState(
  poll: PollDocument | any,
  now: Date = new Date(),
  isAdmin: boolean = false,
  hasVoted: boolean = false,
) {
  const startsAt = poll.startsAt ? new Date(poll.startsAt) : null;
  const endsAt = poll.endsAt ? new Date(poll.endsAt) : null;
  const resultDeclaredAt = poll.resultDeclaredAt ? new Date(poll.resultDeclaredAt) : null;

  // 1. Dynamic Status
  let status: PollStatus = PollStatus.ACTIVE;
  if (startsAt && now < startsAt) {
    status = PollStatus.UPCOMING;
  } else if (!poll.isActive || (endsAt && now >= endsAt)) {
    status = PollStatus.CLOSED;
  } else {
    status = PollStatus.ACTIVE;
  }

  const isEnded = status === PollStatus.CLOSED;
  const isUpcoming = status === PollStatus.UPCOMING;
  const isOpenForVoting = status === PollStatus.ACTIVE;

  // 2. Result Declaration timing
  let isResultDeclared = false;
  let effectiveResultDeclaredAt: Date | null = resultDeclaredAt;

  if (poll.resultVisibility === PollResultVisibility.ADMIN_ONLY) {
    isResultDeclared = false;
  } else if (poll.resultVisibility === PollResultVisibility.SCHEDULED_DATE) {
    isResultDeclared = Boolean(resultDeclaredAt && now >= resultDeclaredAt);
  } else if (poll.resultVisibility === PollResultVisibility.AFTER_END) {
    const threshold = resultDeclaredAt || endsAt;
    effectiveResultDeclaredAt = threshold;
    isResultDeclared = Boolean(threshold && now >= threshold) || (!endsAt && !poll.isActive);
  } else if (poll.resultVisibility === PollResultVisibility.AFTER_VOTE) {
    // If a future declaration date was set, hide results until that date arrives
    if (resultDeclaredAt && now < resultDeclaredAt) {
      isResultDeclared = false;
    } else {
      isResultDeclared = hasVoted;
    }
  } else if (poll.resultVisibility === PollResultVisibility.ALWAYS_PUBLIC) {
    if (resultDeclaredAt && now < resultDeclaredAt) {
      isResultDeclared = false;
    } else {
      isResultDeclared = true;
    }
  }

  const canViewResults = isAdmin || isResultDeclared;

  let resultStatus: 'DECLARED' | 'SCHEDULED' | 'PENDING' | 'ADMIN_ONLY' = 'PENDING';
  let resultMessage = '';

  if (isResultDeclared) {
    resultStatus = 'DECLARED';
    resultMessage = 'Poll results have been declared.';
  } else if (poll.resultVisibility === PollResultVisibility.ADMIN_ONLY) {
    resultStatus = 'ADMIN_ONLY';
    resultMessage = 'Poll results are restricted to Campaign Admin only.';
  } else if (effectiveResultDeclaredAt && now < effectiveResultDeclaredAt) {
    resultStatus = 'SCHEDULED';
    resultMessage = `Results will be declared on ${effectiveResultDeclaredAt.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })}.`;
  } else if (poll.resultVisibility === PollResultVisibility.AFTER_END) {
    resultStatus = 'SCHEDULED';
    resultMessage = endsAt
      ? `Results will be declared after the poll ends on ${endsAt.toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}.`
      : 'Results will be declared once the poll is closed.';
  } else if (poll.resultVisibility === PollResultVisibility.AFTER_VOTE) {
    resultStatus = 'PENDING';
    resultMessage = 'Results will be revealed after you cast your vote.';
  } else {
    resultStatus = 'PENDING';
    resultMessage = 'Results declaration is pending.';
  }

  return {
    status,
    isEnded,
    isUpcoming,
    isOpenForVoting,
    isResultDeclared,
    canViewResults,
    resultDeclaredAt: effectiveResultDeclaredAt,
    resultStatus,
    resultMessage,
  };
}

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);

  constructor(
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(PollVote.name) private voteModel: Model<PollVoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(Volunteer.name) private volunteerModel: Model<VolunteerDocument>,
    @Optional() private auditLogsService?: AuditLogsService,
  ) {}

  /**
   * Auto-seed default opinion polls for a tenant if none exist.
   * Ensures new or demo tenants have immediate, realistic data per SRS Sec 19.
   */
  async seedDefaultPollsIfEmpty(tenant: TenantDocument) {
    const count = await this.pollModel.countDocuments({ tenantId: tenant._id });
    if (count > 0) return;

    this.logger.log(`Seeding default opinion polls for tenant "${tenant.slug}"...`);

    const samplePolls = [
      {
        tenantId: tenant._id,
        question: 'Which constituency development initiative should be prioritized this quarter?',
        description: 'Voice your priority for the upcoming infrastructure and welfare budget allocation.',
        category: 'Development',
        options: [
          { optionId: uuidv4(), text: 'Road widening & solar street lighting network', votes: 0 },
          { optionId: uuidv4(), text: 'Modernized primary health center & diagnostic lab', votes: 0 },
          { optionId: uuidv4(), text: 'Clean drinking water pipeline & RO water kiosks', votes: 0 },
          { optionId: uuidv4(), text: 'Youth sports complex & community digital library', votes: 0 },
        ],
        targetAudience: PollTargetAudience.ALL,
        resultVisibility: PollResultVisibility.AFTER_VOTE,
        allowRevote: false,
        isActive: true,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        totalVotes: 0,
      },
      {
        tenantId: tenant._id,
        question: 'Are you satisfied with the recent agricultural electricity subsidy rollout?',
        description: 'Feedback for our policy working committee to assess grassroot welfare impact.',
        category: 'Public Policy',
        options: [
          { optionId: uuidv4(), text: 'Yes, highly beneficial and timely', votes: 0 },
          { optionId: uuidv4(), text: 'Somewhat satisfied, but needs faster disbursement', votes: 0 },
          { optionId: uuidv4(), text: 'Not satisfied, requires higher power quota', votes: 0 },
        ],
        targetAudience: PollTargetAudience.ALL,
        resultVisibility: PollResultVisibility.ALWAYS_PUBLIC,
        allowRevote: true,
        isActive: true,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        totalVotes: 0,
      },
    ];

    await this.pollModel.insertMany(samplePolls);
  }

  /**
   * Create a new poll (Admin / Leader / Content Manager)
   * Supports custom startsAt, endsAt, durationHours, durationDays, and scheduled resultDeclaredAt
   */
  async create(tenant: TenantDocument, dto: CreatePollDto) {
    if (!dto.options || dto.options.length < 2) {
      throw new BadRequestException('A poll must contain at least 2 options');
    }

    const uniqueOptions = Array.from(new Set(dto.options.map((o) => o.trim()))).filter(Boolean);
    if (uniqueOptions.length < 2) {
      throw new BadRequestException('Options must be unique and non-empty');
    }

    const formattedOptions = uniqueOptions.map((text) => ({
      optionId: uuidv4(),
      text,
      votes: 0,
    }));

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : new Date();
    let endsAt: Date | undefined = undefined;

    if (dto.endsAt) {
      endsAt = new Date(dto.endsAt);
    } else if (dto.durationHours) {
      endsAt = new Date(startsAt.getTime() + dto.durationHours * 3600 * 1000);
    } else if (dto.durationDays) {
      endsAt = new Date(startsAt.getTime() + dto.durationDays * 86400 * 1000);
    }

    if (endsAt && endsAt <= startsAt) {
      throw new BadRequestException('End date must be after the start date');
    }

    const durationHours = endsAt
      ? Math.round(((endsAt.getTime() - startsAt.getTime()) / (3600 * 1000)) * 10) / 10
      : (dto.durationHours || (dto.durationDays ? dto.durationDays * 24 : undefined));

    // Result Declaration scheduling
    let resultDeclaredAt: Date | undefined = undefined;
    let resultVisibility = dto.resultVisibility || PollResultVisibility.AFTER_END;

    if (dto.resultDeclaredAt) {
      resultDeclaredAt = new Date(dto.resultDeclaredAt);
      if (resultDeclaredAt < startsAt) {
        throw new BadRequestException('Result declaration date cannot be earlier than poll start date');
      }
      if (!dto.resultVisibility) {
        resultVisibility = PollResultVisibility.SCHEDULED_DATE;
      }
    } else if (resultVisibility === PollResultVisibility.AFTER_END && endsAt) {
      resultDeclaredAt = endsAt;
    } else if (resultVisibility === PollResultVisibility.SCHEDULED_DATE) {
      resultDeclaredAt = endsAt || new Date(startsAt.getTime() + 24 * 3600 * 1000);
    }

    const targetAreaId = dto.targetAreaId ? new Types.ObjectId(dto.targetAreaId) : undefined;

    const allowMultipleChoices = Boolean(dto.allowMultipleChoices);
    const maxChoices = allowMultipleChoices
      ? (dto.maxChoices && dto.maxChoices > 0 ? Math.min(dto.maxChoices, formattedOptions.length) : formattedOptions.length)
      : 1;

    const poll = await this.pollModel.create({
      tenantId: tenant._id,
      question: dto.question.trim(),
      description: dto.description || '',
      category: dto.category || 'General',
      options: formattedOptions,
      startsAt,
      endsAt,
      durationHours,
      resultDeclaredAt,
      targetAudience: dto.targetAudience || PollTargetAudience.ALL,
      targetAreaId,
      targetGender: dto.targetGender || undefined,
      targetMinAge: dto.targetMinAge !== undefined ? dto.targetMinAge : undefined,
      targetMaxAge: dto.targetMaxAge !== undefined ? dto.targetMaxAge : undefined,
      resultVisibility,
      allowRevote: dto.allowRevote ?? false,
      allowMultipleChoices,
      maxChoices,
      isActive: dto.isActive ?? true,
      totalVotes: 0,
    });

    const state = getPollComputedState(poll, new Date(), true);

    return {
      ...poll.toObject(),
      status: state.status,
      isOpenForVoting: state.isOpenForVoting,
      isEnded: state.isEnded,
      isUpcoming: state.isUpcoming,
      isResultDeclared: state.isResultDeclared,
      resultStatus: state.resultStatus,
      resultMessage: state.resultMessage,
    };
  }

  /**
   * List polls for citizens and admins with dynamic status and result masking
   */
  async findAll(tenant: TenantDocument, queryDto: QueryPollsDto, user?: any, isAdmin: boolean = false) {
    await this.seedDefaultPollsIfEmpty(tenant);

    const filter: any = { tenantId: tenant._id };

    if (!isAdmin) {
      filter.isActive = true;
    }

    if (queryDto.category) {
      filter.category = queryDto.category;
    }

    if (queryDto.areaId) {
      filter.$or = [{ targetAreaId: null }, { targetAreaId: new Types.ObjectId(queryDto.areaId) }];
    }

    const now = new Date();
    if (queryDto.status === 'active') {
      filter.isActive = true;
      filter.$and = [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gt: now } }] },
      ];
    } else if (queryDto.status === 'upcoming') {
      filter.isActive = true;
      filter.startsAt = { $gt: now };
    } else if (queryDto.status === 'ended' || queryDto.status === 'closed') {
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

    // Fetch user votes if user is authenticated
    const userVoteMap = new Map<string, { optionId: string | null; optionIds: string[] }>();
    if (user?.sub) {
      const pollIds = polls.map((p) => p._id);
      const userVotes = await this.voteModel.find({
        tenantId: tenant._id,
        userId: new Types.ObjectId(user.sub),
        pollId: { $in: pollIds },
      });
      userVotes.forEach((v) => {
        const optionIds = v.optionIds?.length ? v.optionIds : (v.optionId ? [v.optionId] : []);
        userVoteMap.set(v.pollId.toString(), {
          optionId: v.optionId || optionIds[0] || null,
          optionIds,
        });
      });
    }

    const items = polls.map((p) => {
      const voteInfo = userVoteMap.get(p._id.toString());
      const hasVoted = Boolean(voteInfo);
      const myOptionId = voteInfo?.optionId || null;
      const myOptionIds = voteInfo?.optionIds || (myOptionId ? [myOptionId] : []);

      const state = getPollComputedState(p, now, isAdmin, hasVoted);
      const totalVotes = p.totalVotes || 0;

      let winnerOption: any = null;
      const options = p.options.map((opt: any) => {
        if (state.canViewResults) {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 1000) / 10 : 0;
          return {
            optionId: opt.optionId,
            text: opt.text,
            votes: opt.votes,
            percentage,
          };
        }
        // Result hidden until configured declaration time
        return {
          optionId: opt.optionId,
          text: opt.text,
        };
      });

      if (state.canViewResults && totalVotes > 0) {
        const sorted = [...options].sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0));
        winnerOption = sorted[0];
      }

      return {
        _id: p._id,
        question: p.question,
        description: p.description,
        category: p.category,
        options,
        winnerOption,
        totalVotes: state.canViewResults ? totalVotes : undefined,
        targetAudience: p.targetAudience,
        targetArea: p.targetAreaId,
        startsAt: p.startsAt,
        endsAt: p.endsAt,
        durationHours: p.durationHours,
        isActive: p.isActive,
        status: state.status,
        isOpenForVoting: state.isOpenForVoting,
        isEnded: state.isEnded,
        isUpcoming: state.isUpcoming,
        allowRevote: p.allowRevote,
        allowMultipleChoices: p.allowMultipleChoices ?? false,
        maxChoices: p.maxChoices || 1,
        resultVisibility: p.resultVisibility,
        resultDeclaredAt: state.resultDeclaredAt,
        isResultDeclared: state.isResultDeclared,
        resultStatus: state.resultStatus,
        resultMessage: state.resultMessage,
        hasVoted,
        myOptionId,
        myOptionIds,
        canViewResults: state.canViewResults,
        createdAt: (p as any).createdAt,
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

  /**
   * Get single poll details with eligibility, dynamic status, and result masking
   */
  async findOne(tenant: TenantDocument, id: string, user?: any, isAdmin: boolean = false) {
    const poll = await this.pollModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('targetAreaId', 'name code');

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    let userVote: PollVoteDocument | null = null;
    if (user?.sub) {
      userVote = await this.voteModel.findOne({
        tenantId: tenant._id,
        pollId: poll._id,
        userId: new Types.ObjectId(user.sub),
      });
    }

    const now = new Date();
    const hasVoted = Boolean(userVote);

    const state = getPollComputedState(poll, now, isAdmin, hasVoted);
    const totalVotes = poll.totalVotes || 0;

    let winnerOption: any = null;
    const options = poll.options.map((opt: any) => {
      if (state.canViewResults) {
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

    if (state.canViewResults && totalVotes > 0) {
      const sorted = [...options].sort((a: any, b: any) => (b.votes || 0) - (a.votes || 0));
      winnerOption = sorted[0];
    }

    return {
      _id: poll._id,
      question: poll.question,
      description: poll.description,
      category: poll.category,
      options,
      winnerOption,
      totalVotes: state.canViewResults ? totalVotes : undefined,
      targetAudience: poll.targetAudience,
      targetArea: poll.targetAreaId,
      targetGender: poll.targetGender,
      targetMinAge: poll.targetMinAge,
      targetMaxAge: poll.targetMaxAge,
      startsAt: poll.startsAt,
      endsAt: poll.endsAt,
      durationHours: poll.durationHours,
      isActive: poll.isActive,
      status: state.status,
      isOpenForVoting: state.isOpenForVoting,
      isEnded: state.isEnded,
      isUpcoming: state.isUpcoming,
      allowRevote: poll.allowRevote,
      allowMultipleChoices: poll.allowMultipleChoices ?? false,
      maxChoices: poll.maxChoices || 1,
      resultVisibility: poll.resultVisibility,
      resultDeclaredAt: state.resultDeclaredAt,
      isResultDeclared: state.isResultDeclared,
      resultStatus: state.resultStatus,
      resultMessage: state.resultMessage,
      hasVoted,
      myOptionId: userVote?.optionId || (userVote?.optionIds?.[0] || null),
      myOptionIds: userVote?.optionIds?.length ? userVote.optionIds : (userVote?.optionId ? [userVote.optionId] : []),
      votedAt: userVote?.createdAt || null,
      canViewResults: state.canViewResults,
      createdAt: (poll as any).createdAt,
      updatedAt: (poll as any).updatedAt,
    };
  }

  /**
   * Cast or change a vote in an opinion poll with strict time duration, single/multiple choice rules, and eligibility enforcement
   */
  async vote(tenant: TenantDocument, pollId: string, userId: string, dto: VotePollDto | string) {
    const poll = await this.pollModel.findOne({
      _id: pollId,
      tenantId: tenant._id,
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const now = new Date();

    // 1. Time Duration: Check if poll has not started yet
    if (poll.startsAt && poll.startsAt > now) {
      throw new BadRequestException(
        `Voting has not started yet. This opinion poll will open on ${poll.startsAt.toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}.`,
      );
    }

    // 2. Time Duration: Check if poll has ended / auto-closed
    if ((poll.endsAt && poll.endsAt <= now) || !poll.isActive) {
      throw new BadRequestException(
        `This opinion poll has ended and is now closed. Voting is no longer accepted.${
          poll.endsAt ? ` (Ended on: ${poll.endsAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })})` : ''
        }`,
      );
    }

    // 3. Extract and sanitize selected options
    const voteDto: VotePollDto = typeof dto === 'string' ? { optionId: dto } : dto;
    let selectedOptionIds: string[] = [];

    if (voteDto.optionIds && Array.isArray(voteDto.optionIds) && voteDto.optionIds.length > 0) {
      selectedOptionIds = Array.from(
        new Set(voteDto.optionIds.map((id) => String(id).trim()).filter(Boolean)),
      );
    } else if (voteDto.optionId) {
      selectedOptionIds = [String(voteDto.optionId).trim()];
    }

    if (selectedOptionIds.length === 0) {
      throw new BadRequestException('Please select at least one option to cast your vote.');
    }

    // 4. Single vs Multiple Choices Validation
    if (!poll.allowMultipleChoices && selectedOptionIds.length > 1) {
      throw new BadRequestException(
        'This poll only allows choosing 1 single option. Please select only one option.',
      );
    }

    const maxAllowed = poll.allowMultipleChoices
      ? (poll.maxChoices && poll.maxChoices > 0 ? poll.maxChoices : poll.options.length)
      : 1;

    if (selectedOptionIds.length > maxAllowed) {
      throw new BadRequestException(
        `This poll allows selecting at most ${maxAllowed} option(s). You selected ${selectedOptionIds.length}.`,
      );
    }

    // 5. Verify that all chosen options exist in the poll
    const validOptionMap = new Map<string, string>();
    poll.options.forEach((o) => validOptionMap.set(o.optionId, o.text));

    for (const optId of selectedOptionIds) {
      if (!validOptionMap.has(optId)) {
        throw new BadRequestException(`Invalid option selected: "${optId}" does not exist in this poll.`);
      }
    }

    const existingVote = await this.voteModel.findOne({
      pollId: poll._id,
      userId: new Types.ObjectId(userId),
    });

    // Handle revote logic
    if (existingVote) {
      if (!poll.allowRevote) {
        throw new BadRequestException('You have already voted in this poll. Multiple votes are not permitted.');
      }

      const prevOptionIds: string[] = (existingVote.optionIds && existingVote.optionIds.length > 0)
        ? existingVote.optionIds
        : (existingVote.optionId ? [existingVote.optionId] : []);

      const isIdentical =
        prevOptionIds.length === selectedOptionIds.length &&
        prevOptionIds.every((id) => selectedOptionIds.includes(id));

      const state = getPollComputedState(poll, now, false, true);

      if (isIdentical) {
        return {
          message: state.isResultDeclared
            ? 'You have already voted for this selection.'
            : `You have already voted for this selection. ${state.resultMessage}`,
          hasVoted: true,
          optionId: selectedOptionIds[0],
          optionIds: selectedOptionIds,
          status: state.status,
          isResultDeclared: state.isResultDeclared,
          resultDeclaredAt: state.resultDeclaredAt,
          resultStatus: state.resultStatus,
          resultMessage: state.resultMessage,
          totalVotes: state.canViewResults ? poll.totalVotes : undefined,
        };
      }

      // Decrement prior options
      for (const prevId of prevOptionIds) {
        await this.pollModel.updateOne(
          { _id: pollId, 'options.optionId': prevId },
          { $inc: { 'options.$.votes': -1 } },
        );
      }

      // Increment new options
      for (const newId of selectedOptionIds) {
        await this.pollModel.updateOne(
          { _id: pollId, 'options.optionId': newId },
          { $inc: { 'options.$.votes': 1 } },
        );
      }

      existingVote.optionId = selectedOptionIds[0];
      existingVote.optionIds = selectedOptionIds;
      await existingVote.save();

      return {
        message: state.isResultDeclared
          ? 'Your vote has been updated successfully.'
          : `Your vote has been updated successfully! ${state.resultMessage}`,
        hasVoted: true,
        optionId: selectedOptionIds[0],
        optionIds: selectedOptionIds,
        status: state.status,
        isResultDeclared: state.isResultDeclared,
        resultDeclaredAt: state.resultDeclaredAt,
        resultStatus: state.resultStatus,
        resultMessage: state.resultMessage,
        totalVotes: state.canViewResults ? poll.totalVotes : undefined,
      };
    }

    // New vote: enforce target audience eligibility criteria (SRS Sec 19)
    const user = await this.userModel.findOne({ _id: userId, tenantId: tenant._id });
    if (!user) {
      throw new NotFoundException('User record not found');
    }

    // 1. SPECIFIC_AREA
    if (poll.targetAudience === PollTargetAudience.SPECIFIC_AREA && poll.targetAreaId) {
      if (!user.areaId || user.areaId.toString() !== poll.targetAreaId.toString()) {
        throw new ForbiddenException('This poll is restricted to residents of the targeted constituency/area');
      }
    }

    // 2. MEMBERS_ONLY
    if (poll.targetAudience === PollTargetAudience.MEMBERS_ONLY) {
      const isMemberCategory = user.category === 'member';
      const approvedMembership = await this.membershipModel.findOne({
        tenantId: tenant._id,
        userId: user._id,
        status: MembershipStatus.APPROVED,
      });

      if (!isMemberCategory && !approvedMembership) {
        throw new ForbiddenException('This poll is restricted to verified Party Members only');
      }
    }

    // 3. VOLUNTEERS_ONLY
    if (poll.targetAudience === PollTargetAudience.VOLUNTEERS_ONLY) {
      const isVolunteerCategory = user.category === 'volunteer';
      const activeVolunteer = await this.volunteerModel.findOne({
        tenantId: tenant._id,
        userId: user._id,
        status: VolunteerStatus.ACTIVE,
      });

      if (!isVolunteerCategory && !activeVolunteer) {
        throw new ForbiddenException('This poll is restricted to active registered Volunteers only');
      }
    }

    // 4. GENDER
    if (poll.targetAudience === PollTargetAudience.GENDER && poll.targetGender) {
      const targetGender = poll.targetGender.trim().toLowerCase();
      const userGender = (user.gender || '').trim().toLowerCase();
      if (!userGender || userGender !== targetGender) {
        throw new ForbiddenException(`This poll is restricted to ${poll.targetGender} participants only`);
      }
    }

    // 5. AGE_GROUP
    if (poll.targetAudience === PollTargetAudience.AGE_GROUP) {
      if (!user.dob) {
        throw new BadRequestException('Please complete your Date of Birth in your profile to participate in age-targeted polls');
      }

      const diffMs = Date.now() - new Date(user.dob).getTime();
      const userAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));

      if (poll.targetMinAge !== undefined && userAge < poll.targetMinAge) {
        throw new ForbiddenException(`This poll requires a minimum age of ${poll.targetMinAge} years (your age: ${userAge})`);
      }

      if (poll.targetMaxAge !== undefined && userAge > poll.targetMaxAge) {
        throw new ForbiddenException(`This poll requires a maximum age of ${poll.targetMaxAge} years (your age: ${userAge})`);
      }
    }

    // Calculate demographic snapshot for analytics
    let snapshotAge: number | undefined;
    if (user.dob) {
      const diffMs = Date.now() - new Date(user.dob).getTime();
      snapshotAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
    }

    // Create immutable vote audit record
    await this.voteModel.create({
      tenantId: tenant._id,
      pollId: poll._id,
      userId: user._id,
      optionId: selectedOptionIds[0],
      optionIds: selectedOptionIds,
      areaId: user.areaId || undefined,
      gender: user.gender || undefined,
      age: snapshotAge,
    });

    // Increment vote counts for each selected option atomically
    for (const optId of selectedOptionIds) {
      await this.pollModel.updateOne(
        { _id: pollId, 'options.optionId': optId },
        { $inc: { 'options.$.votes': 1 } },
      );
    }

    // Increment overall total voter count
    await this.pollModel.updateOne(
      { _id: pollId },
      { $inc: { totalVotes: 1 } },
    );

    const updatedPoll = await this.pollModel.findById(pollId);
    const state = getPollComputedState(updatedPoll || poll, now, false, true);

    return {
      message: state.isResultDeclared
        ? 'Your vote has been recorded successfully.'
        : `Your vote has been recorded successfully! ${state.resultMessage}`,
      hasVoted: true,
      optionId: selectedOptionIds[0],
      optionIds: selectedOptionIds,
      status: state.status,
      isResultDeclared: state.isResultDeclared,
      resultDeclaredAt: state.resultDeclaredAt,
      resultStatus: state.resultStatus,
      resultMessage: state.resultMessage,
      totalVotes: state.canViewResults ? (updatedPoll?.totalVotes || poll.totalVotes + 1) : undefined,
    };
  }

  /**
   * Get user's current vote for a poll
   */
  async getUserVote(tenant: TenantDocument, pollId: string, userId: string) {
    const vote = await this.voteModel.findOne({
      tenantId: tenant._id,
      pollId: new Types.ObjectId(pollId),
      userId: new Types.ObjectId(userId),
    });

    if (!vote) {
      return { hasVoted: false, optionId: null, optionIds: [] };
    }

    const optionIds = vote.optionIds?.length ? vote.optionIds : (vote.optionId ? [vote.optionId] : []);

    return {
      hasVoted: true,
      optionId: vote.optionId || optionIds[0] || null,
      optionIds,
      votedAt: vote.createdAt,
    };
  }

  /**
   * Comprehensive Poll Analytics Dashboard (SRS Sec 19)
   * Calculates participation rate, option distribution, area breakdown, gender, age buckets, & timeline.
   */
  async getAnalytics(tenant: TenantDocument, pollId: string) {
    const poll = await this.pollModel
      .findOne({ _id: pollId, tenantId: tenant._id })
      .populate('targetAreaId', 'name code');

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const totalVotes = poll.totalVotes || 0;

    // Total active users in tenant for participation rate
    const totalUsers = await this.userModel.countDocuments({
      tenantId: tenant._id,
      isActive: true,
    });

    const participationRate =
      totalUsers > 0 ? Math.round((totalVotes / totalUsers) * 1000) / 10 : 0;

    // Option distribution with percentages
    const optionsBreakdown = poll.options.map((opt) => ({
      optionId: opt.optionId,
      text: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 1000) / 10 : 0,
    }));

    // Area breakdown aggregation
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
    const areaMap = new Map<string, string>();
    areas.forEach((a) => areaMap.set(a._id.toString(), a.name));

    const areaBreakdown = areaAgg.map((a) => ({
      areaId: a._id,
      areaName: areaMap.get(a._id.toString()) || 'Unknown Area',
      votes: a.count,
      percentage: totalVotes > 0 ? Math.round((a.count / totalVotes) * 1000) / 10 : 0,
    }));

    // Gender breakdown aggregation
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

    // Age groups breakdown aggregation
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

    const ageLabelMap: Record<string, string> = {
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

    // Daily voting trend timeline
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

  /**
   * Export poll results and voter audit log to CSV or Excel (SRS Sec 19 & Sec 58)
   */
  async exportPollCsv(
    tenant: TenantDocument,
    pollId: string,
    res: Response,
    format: string = 'csv',
    adminUser?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const poll = await this.pollModel.findOne({ _id: pollId, tenantId: tenant._id });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    const votes = await this.voteModel
      .find({ tenantId: tenant._id, pollId: poll._id })
      .populate('userId', 'name mobile gender dob')
      .populate('areaId', 'name code')
      .sort({ createdAt: -1 })
      .lean();

    const optionMap = new Map<string, string>();
    poll.options.forEach((o) => optionMap.set(o.optionId, o.text));

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const maskMobile = (mobile?: string) => {
      if (!mobile || mobile.length < 5) return 'N/A';
      return mobile.slice(0, 2) + '****' + mobile.slice(-4);
    };

    const lines: string[] = [];

    // Header summary section
    lines.push(escapeCsv('--- OPINION POLL SUMMARY (SRS SEC 19) ---'));
    lines.push(`${escapeCsv('Question')},${escapeCsv(poll.question)}`);
    lines.push(`${escapeCsv('Category')},${escapeCsv(poll.category || 'General')}`);
    lines.push(`${escapeCsv('Total Votes')},${escapeCsv(poll.totalVotes)}`);
    lines.push(`${escapeCsv('Target Audience')},${escapeCsv(poll.targetAudience)}`);
    lines.push(`${escapeCsv('Start Date')},${escapeCsv(poll.startsAt ? poll.startsAt.toISOString() : 'N/A')}`);
    lines.push(`${escapeCsv('End Date')},${escapeCsv(poll.endsAt ? poll.endsAt.toISOString() : 'No Expiry')}`);
    lines.push('');

    // Option distribution summary
    lines.push(escapeCsv('--- OPTION BREAKDOWN ---'));
    lines.push('Option Text,Vote Count,Percentage');
    poll.options.forEach((opt) => {
      const pct = poll.totalVotes > 0 ? ((opt.votes / poll.totalVotes) * 100).toFixed(1) + '%' : '0.0%';
      lines.push(`${escapeCsv(opt.text)},${escapeCsv(opt.votes)},${escapeCsv(pct)}`);
    });
    lines.push('');

    // Detailed voter log
    lines.push(escapeCsv('--- DETAILED VOTER AUDIT TRAIL ---'));
    lines.push('Vote Timestamp,Voter Name,Masked Mobile,Gender,Age,Area / Constituency,Selected Option');

    votes.forEach((v: any) => {
      const user = v.userId || {};
      const area = v.areaId || {};
      const vOptionIds: string[] = v.optionIds?.length ? v.optionIds : (v.optionId ? [v.optionId] : []);
      const optionText = vOptionIds.map((id) => optionMap.get(id) || id).join('; ');
      const votedAt = v.createdAt ? new Date(v.createdAt).toISOString() : 'N/A';

      lines.push(
        [
          escapeCsv(votedAt),
          escapeCsv(user.name || 'Citizen Voter'),
          escapeCsv(maskMobile(user.mobile)),
          escapeCsv(v.gender || user.gender || 'Unspecified'),
          escapeCsv(v.age !== undefined ? v.age : 'N/A'),
          escapeCsv(area.name || 'General'),
          escapeCsv(optionText),
        ].join(','),
      );
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

    // Audit log (SRS Sec 58 & 59)
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
        .catch(() => {});
    }

    return res.status(200).send(csvContent);
  }

  /**
   * Update poll metadata, time duration, or result declaration settings (Admin)
   */
  async update(tenant: TenantDocument, id: string, dto: UpdatePollDto) {
    const poll = await this.pollModel.findOne({ _id: id, tenantId: tenant._id });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (dto.question !== undefined) poll.question = dto.question.trim();
    if (dto.description !== undefined) poll.description = dto.description;
    if (dto.category !== undefined) poll.category = dto.category;
    if (dto.isActive !== undefined) poll.isActive = dto.isActive;
    if (dto.allowRevote !== undefined) poll.allowRevote = dto.allowRevote;
    if (dto.allowMultipleChoices !== undefined) poll.allowMultipleChoices = dto.allowMultipleChoices;
    if (dto.maxChoices !== undefined) {
      poll.maxChoices = poll.allowMultipleChoices ? Math.max(1, dto.maxChoices) : 1;
    } else if (dto.allowMultipleChoices === false) {
      poll.maxChoices = 1;
    }
    if (dto.targetAudience !== undefined) poll.targetAudience = dto.targetAudience;
    if (dto.resultVisibility !== undefined) poll.resultVisibility = dto.resultVisibility;
    if (dto.targetGender !== undefined) poll.targetGender = dto.targetGender;
    if (dto.targetMinAge !== undefined) poll.targetMinAge = dto.targetMinAge;
    if (dto.targetMaxAge !== undefined) poll.targetMaxAge = dto.targetMaxAge;

    if (dto.targetAreaId !== undefined) {
      poll.targetAreaId = dto.targetAreaId ? new Types.ObjectId(dto.targetAreaId) : undefined;
    }

    if (dto.startsAt !== undefined) {
      poll.startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
    }

    if (dto.endsAt !== undefined) {
      poll.endsAt = dto.endsAt ? new Date(dto.endsAt) : undefined;
    } else if (dto.durationHours) {
      const baseStart = poll.startsAt || new Date();
      poll.endsAt = new Date(baseStart.getTime() + dto.durationHours * 3600 * 1000);
      poll.durationHours = dto.durationHours;
    } else if (dto.durationDays) {
      const baseStart = poll.startsAt || new Date();
      poll.endsAt = new Date(baseStart.getTime() + dto.durationDays * 86400 * 1000);
      poll.durationHours = dto.durationDays * 24;
    }

    if (poll.endsAt && poll.startsAt && poll.endsAt <= poll.startsAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (poll.endsAt && poll.startsAt) {
      poll.durationHours = Math.round(((poll.endsAt.getTime() - poll.startsAt.getTime()) / (3600 * 1000)) * 10) / 10;
    }

    if (dto.resultDeclaredAt !== undefined) {
      poll.resultDeclaredAt = dto.resultDeclaredAt ? new Date(dto.resultDeclaredAt) : undefined;
    }

    // If options are updated and poll has 0 votes, allow rewriting options
    if (dto.options && dto.options.length >= 2) {
      if (poll.totalVotes > 0) {
        throw new BadRequestException('Cannot replace options after votes have already been recorded');
      }
      poll.options = dto.options.map((text) => ({
        optionId: uuidv4(),
        text: text.trim(),
        votes: 0,
      }));
    }

    await poll.save();
    const state = getPollComputedState(poll, new Date(), true);

    return {
      ...poll.toObject(),
      status: state.status,
      isOpenForVoting: state.isOpenForVoting,
      isEnded: state.isEnded,
      isUpcoming: state.isUpcoming,
      isResultDeclared: state.isResultDeclared,
      resultStatus: state.resultStatus,
      resultMessage: state.resultMessage,
    };
  }

  /**
   * Manually declare results immediately (Admin / Leader)
   * POST /polls/:id/declare-result
   */
  async declareResult(tenant: TenantDocument, pollId: string) {
    const poll = await this.pollModel.findOne({ _id: pollId, tenantId: tenant._id });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    poll.resultDeclaredAt = new Date();
    poll.resultVisibility = PollResultVisibility.ALWAYS_PUBLIC;
    await poll.save();

    const state = getPollComputedState(poll, new Date(), true);

    return {
      message: `Poll results for "${poll.question}" have been declared successfully.`,
      pollId: poll._id,
      isResultDeclared: true,
      resultDeclaredAt: poll.resultDeclaredAt,
      resultVisibility: poll.resultVisibility,
      resultStatus: state.resultStatus,
      totalVotes: poll.totalVotes,
      options: poll.options,
    };
  }

  /**
   * Manually close poll immediately (Admin / Leader)
   * POST /polls/:id/close
   */
  async closePoll(tenant: TenantDocument, pollId: string) {
    const poll = await this.pollModel.findOne({ _id: pollId, tenantId: tenant._id });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    poll.isActive = false;
    poll.endsAt = new Date();
    await poll.save();

    const state = getPollComputedState(poll, new Date(), true);

    return {
      message: `Poll "${poll.question}" has been closed successfully. Further votes will be rejected.`,
      pollId: poll._id,
      status: state.status,
      isActive: poll.isActive,
      endsAt: poll.endsAt,
      isResultDeclared: state.isResultDeclared,
      resultDeclaredAt: state.resultDeclaredAt,
    };
  }

  /**
   * Remove a poll and all corresponding votes (Admin)
   */
  async remove(tenant: TenantDocument, id: string) {
    const poll = await this.pollModel.findOne({ _id: id, tenantId: tenant._id });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    await Promise.all([
      this.pollModel.deleteOne({ _id: poll._id }),
      this.voteModel.deleteMany({ pollId: poll._id }),
    ]);

    return { message: `Poll #${id} and all associated votes have been successfully deleted.` };
  }
}

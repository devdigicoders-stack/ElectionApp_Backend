import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Poll, PollDocument, PollVote, PollVoteDocument } from './poll.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(PollVote.name) private voteModel: Model<PollVoteDocument>,
  ) { }

  async create(tenant: TenantDocument, data: { question: string; options: string[]; targetAreaId?: string; endsAt?: Date }) {
    const options = data.options.map((text) => ({ optionId: uuidv4(), text, votes: 0 }));
    return this.pollModel.create({ tenantId: tenant._id, ...data, options });
  }

  async findAll(tenant: TenantDocument, userAreaId?: string) {
    const query: any = { tenantId: tenant._id, isActive: true };
    if (userAreaId) {
      query.$or = [{ targetAreaId: null }, { targetAreaId: new Types.ObjectId(userAreaId) }];
    }
    return this.pollModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(tenant: TenantDocument, id: string) {
    const poll = await this.pollModel.findOne({ _id: id, tenantId: tenant._id });
    if (!poll) throw new NotFoundException('Poll not found');
    return poll;
  }

  async vote(tenant: TenantDocument, pollId: string, userId: string, optionId: string) {
    const poll = await this.pollModel.findOne({ _id: pollId, tenantId: tenant._id, isActive: true });
    if (!poll) throw new NotFoundException('Poll not found or inactive');
    if (poll.endsAt && poll.endsAt < new Date()) throw new BadRequestException('Poll has ended');

    const option = poll.options.find((o) => o.optionId === optionId);
    if (!option) throw new BadRequestException('Invalid option');

    const existing = await this.voteModel.findOne({ pollId, userId });
    if (existing) throw new BadRequestException('You have already voted');

    await this.voteModel.create({ tenantId: tenant._id, pollId, userId, optionId });

    // Increment vote count atomically
    await this.pollModel.updateOne(
      { _id: pollId, 'options.optionId': optionId },
      { $inc: { 'options.$.votes': 1, totalVotes: 1 } },
    );

    return { message: 'Vote recorded' };
  }

  async getUserVote(pollId: string, userId: string) {
    return this.voteModel.findOne({ pollId, userId });
  }

  async update(tenant: TenantDocument, id: string, data: any) {
    return this.pollModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
  }

  async remove(tenant: TenantDocument, id: string) {
    return this.pollModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }
}

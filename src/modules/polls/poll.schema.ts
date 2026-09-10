import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PollTargetAudience, PollResultVisibility } from '../../shared/types';

export type PollDocument = Poll & Document;
export type PollVoteDocument = PollVote & Document;

@Schema({ timestamps: true })
export class Poll {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  question: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: 'General' })
  category?: string;

  @Prop({
    type: [{ optionId: String, text: String, votes: { type: Number, default: 0 } }],
    required: true,
  })
  options: { optionId: string; text: string; votes: number }[];

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  targetAreaId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(PollTargetAudience),
    default: PollTargetAudience.ALL,
  })
  targetAudience: PollTargetAudience;

  @Prop({ default: null })
  targetGender?: string;

  @Prop({ default: null })
  targetMinAge?: number;

  @Prop({ default: null })
  targetMaxAge?: number;

  @Prop({
    type: String,
    enum: Object.values(PollResultVisibility),
    default: PollResultVisibility.AFTER_VOTE,
  })
  resultVisibility: PollResultVisibility;

  @Prop({ default: false })
  allowRevote: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  startsAt?: Date;

  @Prop({ default: null })
  endsAt?: Date;

  @Prop({ default: 0 })
  totalVotes: number;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
PollSchema.index({ tenantId: 1, isActive: 1 });
PollSchema.index({ tenantId: 1, category: 1 });
PollSchema.index({ tenantId: 1, targetAreaId: 1 });

@Schema({ timestamps: true })
export class PollVote {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Poll', required: true, index: true })
  pollId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  optionId: string;

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  areaId?: Types.ObjectId;

  @Prop({ default: null })
  gender?: string;

  @Prop({ default: null })
  age?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PollVoteSchema = SchemaFactory.createForClass(PollVote);
PollVoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });
PollVoteSchema.index({ pollId: 1, optionId: 1 });
PollVoteSchema.index({ pollId: 1, areaId: 1 });

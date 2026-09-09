import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PollDocument = Poll & Document;
export type PollVoteDocument = PollVote & Document;

@Schema({ timestamps: true })
export class Poll {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop({
    type: [{ optionId: String, text: String, votes: { type: Number, default: 0 } }],
    required: true,
  })
  options: { optionId: string; text: string; votes: number }[];

  @Prop({ type: Types.ObjectId, ref: 'Area', default: null })
  targetAreaId?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  endsAt?: Date;

  @Prop({ default: 0 })
  totalVotes: number;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
PollSchema.index({ tenantId: 1, isActive: 1 });

@Schema({ timestamps: true })
export class PollVote {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Poll', required: true })
  pollId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  optionId: string;
}

export const PollVoteSchema = SchemaFactory.createForClass(PollVote);
PollVoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

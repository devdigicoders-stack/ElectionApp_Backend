import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { Poll, PollSchema, PollVote, PollVoteSchema } from './poll.schema';
import { TenantFeature, TenantFeatureSchema } from '../features/tenant-feature.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: PollVote.name, schema: PollVoteSchema },
      { name: TenantFeature.name, schema: TenantFeatureSchema },
    ]),
  ],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}

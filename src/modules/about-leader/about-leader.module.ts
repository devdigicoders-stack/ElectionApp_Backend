import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AboutLeaderService } from './about-leader.service';
import { AboutLeaderController } from './about-leader.controller';
import { AboutLeader, AboutLeaderSchema } from './about-leader.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: AboutLeader.name, schema: AboutLeaderSchema }])],
  controllers: [AboutLeaderController],
  providers: [AboutLeaderService],
})
export class AboutLeaderModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AreaLevel, AreaLevelSchema, Area, AreaSchema } from './area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AreaLevel.name, schema: AreaLevelSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService, MongooseModule],
})
export class AreasModule {}

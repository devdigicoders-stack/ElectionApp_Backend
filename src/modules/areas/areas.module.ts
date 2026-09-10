import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reflector } from '@nestjs/core';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AreaLevel, AreaLevelSchema, Area, AreaSchema } from './area.schema';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AreaLevel.name, schema: AreaLevelSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService, RolesGuard, Reflector],
  exports: [AreasService, MongooseModule],
})
export class AreasModule {}

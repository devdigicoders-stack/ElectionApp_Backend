import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reflector } from '@nestjs/core';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MasterAreasService } from './master-areas.service';
import { MasterAreasController } from './master-areas.controller';
import { AreaLevel, AreaLevelSchema, Area, AreaSchema } from './area.schema';
import { MasterArea, MasterAreaSchema } from './master-area.schema';
import { Tenant, TenantSchema } from '../tenants/tenant.schema';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AreaLevel.name, schema: AreaLevelSchema },
      { name: Area.name, schema: AreaSchema },
      { name: MasterArea.name, schema: MasterAreaSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
  ],
  controllers: [AreasController, MasterAreasController],
  providers: [AreasService, MasterAreasService, RolesGuard, Reflector],
  exports: [AreasService, MasterAreasService, MongooseModule],
})
export class AreasModule {}


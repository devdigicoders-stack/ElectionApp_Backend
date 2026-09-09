import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, EventRsvpStatus } from '../../shared/types';

@Controller('events')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.EVENTS)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.eventsService.create(req.tenant, body);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('upcoming') upcoming?: string,
    @Query('areaId') areaId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.eventsService.findAll(req.tenant, { upcoming: upcoming === 'true', areaId, page, limit });
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.eventsService.findOne(req.tenant, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.eventsService.update(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.eventsService.remove(req.tenant, id);
  }

  @Post(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  rsvp(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body('status') status: EventRsvpStatus,
  ) {
    return this.eventsService.rsvp(req.tenant, id, req.user.sub, status);
  }

  @Get(':id/my-rsvp')
  @UseGuards(JwtAuthGuard)
  getMyRsvp(@Req() req: any, @Param('id') id: string) {
    return this.eventsService.getUserRsvp(id, req.user.sub);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PollsService } from './polls.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey } from '../../shared/types';

@Controller('polls')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.POLLS)
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.pollsService.create(req.tenant, body);
  }

  @Get()
  findAll(@Req() req: TenantRequest & { user?: any }, @Query('areaId') areaId?: string) {
    return this.pollsService.findAll(req.tenant, areaId);
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.pollsService.findOne(req.tenant, id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  vote(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body('optionId') optionId: string,
  ) {
    return this.pollsService.vote(req.tenant, id, req.user.sub, optionId);
  }

  @Get(':id/my-vote')
  @UseGuards(JwtAuthGuard)
  getMyVote(@Req() req: any, @Param('id') id: string) {
    return this.pollsService.getUserVote(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.pollsService.update(req.tenant, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.pollsService.remove(req.tenant, id);
  }
}

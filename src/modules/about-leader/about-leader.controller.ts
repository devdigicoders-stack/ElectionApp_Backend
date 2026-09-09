import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { AboutLeaderService } from './about-leader.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('about-leader')
export class AboutLeaderController {
  constructor(private aboutLeaderService: AboutLeaderService) {}

  @Get()
  get(@Req() req: TenantRequest) {
    return this.aboutLeaderService.get(req.tenant);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  upsert(@Req() req: TenantRequest, @Body() body: any) {
    return this.aboutLeaderService.upsert(req.tenant, body);
  }
}

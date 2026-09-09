import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CitizenDashboardService } from './citizen-dashboard.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { QueryFeedDto } from './citizen-dashboard.dto';

@Controller('my-area')
@UseGuards(JwtAuthGuard)
export class MyAreaController {
  constructor(private readonly dashboardService: CitizenDashboardService) {}

  /**
   * 1. [Citizen] Get Complete Personalized "My Area" Feed (SRS Sec 37)
   * GET /my-area
   */
  @Get()
  getMyAreaFeed(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getMyAreaFeed(req.tenant, req.user.sub);
  }

  /**
   * 2. [Citizen] Get Area Hierarchy Breadcrumb Trail
   * GET /my-area/hierarchy
   */
  @Get('hierarchy')
  getMyAreaHierarchy(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getMyAreaHierarchy(req.tenant, req.user.sub);
  }

  /**
   * 3. [Citizen] Get Local Development Works in My Area
   * GET /my-area/works
   */
  @Get('works')
  getMyAreaWorks(
    @Req() req: TenantRequest & { user: any },
    @Query() query: QueryFeedDto,
  ) {
    return this.dashboardService.getMyAreaWorks(req.tenant, req.user.sub, query);
  }

  /**
   * 4. [Citizen] Get Local Events & Rallies in My Area
   * GET /my-area/events
   */
  @Get('events')
  getMyAreaEvents(
    @Req() req: TenantRequest & { user: any },
    @Query() query: QueryFeedDto,
  ) {
    return this.dashboardService.getMyAreaEvents(req.tenant, req.user.sub, query);
  }

  /**
   * 5. [Citizen] Get Local News & Announcements in My Area
   * GET /my-area/news
   */
  @Get('news')
  getMyAreaNews(
    @Req() req: TenantRequest & { user: any },
    @Query() query: QueryFeedDto,
  ) {
    return this.dashboardService.getMyAreaNews(req.tenant, req.user.sub, query);
  }

  /**
   * 6. [Citizen] Get Local Opinion Polls in My Area
   * GET /my-area/polls
   */
  @Get('polls')
  getMyAreaPolls(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getMyAreaPolls(req.tenant, req.user.sub);
  }

  /**
   * 7. [Citizen] Get Local Area Coordinator / Representative Contact
   * GET /my-area/coordinator
   */
  @Get('coordinator')
  getMyAreaCoordinator(@Req() req: TenantRequest & { user: any }) {
    return this.dashboardService.getMyAreaCoordinator(req.tenant, req.user.sub);
  }

  /**
   * 8. [Citizen] Get Local Community Complaints in My Locality
   * GET /my-area/complaints
   */
  @Get('complaints')
  getMyAreaComplaints(
    @Req() req: TenantRequest & { user: any },
    @Query() query: QueryFeedDto,
  ) {
    return this.dashboardService.getMyAreaComplaints(req.tenant, req.user.sub, query);
  }
}

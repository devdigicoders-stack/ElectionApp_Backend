import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CreateNewsDto,
  UpdateNewsDto,
  UpdateNewsStatusDto,
  QueryNewsDto,
} from './news.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  /**
   * 1. [Admin] Create News / Article / Press Release
   * POST /news
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest & { user: any }, @Body() dto: CreateNewsDto) {
    return this.newsService.create(req.tenant, dto, req.user);
  }

  /**
   * 2. [Public] Get Published News & Updates
   * GET /news
   */
  @Get()
  findAllPublished(@Req() req: TenantRequest, @Query() query: QueryNewsDto) {
    return this.newsService.findAllPublished(req.tenant, query);
  }

  /**
   * 3. [Admin] Get All News (Drafts, Scheduled, Published, Archived)
   * GET /news/admin
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  findAllAdmin(@Req() req: TenantRequest, @Query() query: QueryNewsDto) {
    return this.newsService.findAllAdmin(req.tenant, query);
  }

  /**
   * 4. [Public/Admin] Get News Categories with Counts
   * GET /news/categories
   */
  @Get('categories')
  getCategories(@Req() req: TenantRequest) {
    return this.newsService.getCategories(req.tenant);
  }

  /**
   * 5. [Admin] Get News Module Stats
   * GET /news/stats
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Req() req: TenantRequest) {
    return this.newsService.getStats(req.tenant);
  }

  /**
   * 6. [Public] Get Single News Article by ID or Slug
   * GET /news/:id
   */
  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.newsService.findOne(req.tenant, id, true);
  }

  /**
   * 7. [Admin] Update News Article
   * PATCH /news/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
  ) {
    return this.newsService.update(req.tenant, id, dto);
  }

  /**
   * 8. [Admin] Quick Status Update (Publish / Unpublish / Schedule / Archive)
   * PATCH /news/:id/status
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateNewsStatusDto,
  ) {
    return this.newsService.updateStatus(req.tenant, id, dto);
  }

  /**
   * 9. [Admin] Delete News Article
   * DELETE /news/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.newsService.remove(req.tenant, id);
  }
}

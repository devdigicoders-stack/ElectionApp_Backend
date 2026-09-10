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
  Res,
  Ip,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { VolunteerTasksService } from './volunteer-tasks.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import {
  CreateVolunteerTaskDto,
  UpdateVolunteerTaskDto,
  SubmitVolunteerTaskDto,
  ReviewVolunteerTaskDto,
  QueryVolunteerTaskDto,
} from './volunteer-task.dto';
import { VolunteerTaskStatus, UserRole } from '../../shared/types';

@Controller('volunteers/tasks')
@UseGuards(JwtAuthGuard)
export class VolunteerTasksController {
  constructor(private tasksService: VolunteerTasksService) {}

  /**
   * 1. [Admin] Create & Assign Volunteer Task
   * POST /volunteers/tasks
   */
  @Post()
  create(
    @Req() req: TenantRequest & { user: any },
    @Body() dto: CreateVolunteerTaskDto,
  ) {
    return this.tasksService.create(req.tenant, dto, req.user);
  }

  /**
   * 2. [Admin] List All Volunteer Tasks with Filters
   * GET /volunteers/tasks
   */
  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query() query: QueryVolunteerTaskDto,
  ) {
    return this.tasksService.findAll(req.tenant, query);
  }

  /**
   * 3. [Volunteer] List My Assigned Tasks
   * GET /volunteers/tasks/my
   */
  @Get('my')
  findMyTasks(
    @Req() req: TenantRequest & { user: any },
    @Query('status') status?: VolunteerTaskStatus,
  ) {
    return this.tasksService.findMyTasks(req.tenant, req.user.sub, { status });
  }

  /**
   * [Admin] Export Volunteer Tasks to CSV or Excel (SRS Sec 58)
   * GET /volunteers/tasks/export
   */
  @Get('export')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN)
  exportTasks(
    @Req() req: TenantRequest & { user: any },
    @Res() res: Response,
    @Query() query: any,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.tasksService.exportVolunteerTasks(
      req.tenant,
      query,
      res,
      query?.format || 'csv',
      req.user,
      ipAddress,
      userAgent,
    );
  }

  /**
   * 4. [Admin] Get Task Metrics & Overdue Stats
   * GET /volunteers/tasks/stats
   */
  @Get('stats')
  getStats(@Req() req: TenantRequest) {
    return this.tasksService.getStats(req.tenant);
  }

  /**
   * 5. [Admin / Volunteer] Get Single Task Details
   * GET /volunteers/tasks/:id
   */
  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.tasksService.findOne(req.tenant, id);
  }

  /**
   * 6. [Admin] Update Task Details (Due Date, Priority, Assignment)
   * PATCH /volunteers/tasks/:id
   */
  @Patch(':id')
  update(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() dto: UpdateVolunteerTaskDto,
  ) {
    return this.tasksService.update(req.tenant, id, dto);
  }

  /**
   * 7. [Volunteer] Accept Task / Mark In Progress
   * PATCH /volunteers/tasks/:id/accept
   */
  @Patch(':id/accept')
  acceptTask(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
  ) {
    return this.tasksService.acceptTask(req.tenant, id, req.user);
  }

  /**
   * 8. [Volunteer / Admin] Submit Completion Report & Proof
   * POST /volunteers/tasks/:id/submit
   */
  @Post(':id/submit')
  submitTask(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: SubmitVolunteerTaskDto,
  ) {
    return this.tasksService.submitTask(req.tenant, id, dto, req.user);
  }

  /**
   * 9. [Admin] Review Volunteer Submission (Approve / Reject)
   * PATCH /volunteers/tasks/:id/review
   */
  @Patch(':id/review')
  reviewTask(
    @Req() req: TenantRequest & { user: any },
    @Param('id') id: string,
    @Body() dto: ReviewVolunteerTaskDto,
  ) {
    return this.tasksService.reviewTask(req.tenant, id, dto, req.user);
  }

  /**
   * 10. [Admin] Delete Task
   * DELETE /volunteers/tasks/:id
   */
  @Delete(':id')
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.tasksService.remove(req.tenant, id);
  }
}

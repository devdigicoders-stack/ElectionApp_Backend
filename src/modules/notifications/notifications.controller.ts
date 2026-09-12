import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, SetMetadata } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature, FEATURE_KEY } from '../../common/decorators/feature.decorator';
import { FeatureKey } from '../../shared/types';

@Controller('notifications')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.NOTIFICATIONS)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // Admin: create notification
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: TenantRequest, @Body() body: any) {
    return this.notificationsService.create(req.tenant, body);
  }

  // Admin: send notification to targets
  @Post(':id/send')
  @UseGuards(JwtAuthGuard)
  send(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.notificationsService.send(req.tenant, id);
  }

  // Admin: list all notifications
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: TenantRequest, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.findAll(req.tenant, page, limit);
  }

  // Admin / Tenant: get platform broadcasts sent by Super Admin
  @Get('platform-broadcasts')
  @UseGuards(JwtAuthGuard)
  getPlatformBroadcasts(@Req() req: TenantRequest, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.getTenantPlatformBroadcasts(req.tenant, page, limit);
  }

  // Public: get my notifications
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyNotifications(
    @Req() req: TenantRequest & { user: any },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notificationsService.getForUser(req.tenant, req.user.sub, page, limit);
  }

  // Public: unread count
  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.user.sub);
  }

  // Public: mark as read
  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markRead(req.user.sub, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.notificationsService.remove(req.tenant, id);
  }

  // Register FCM Token for logged-in Citizen / User / Admin
  // NOTE: @SetMetadata overrides class-level FeatureGuard — FCM token registration must never be feature-gated
  @Post('register-token')
  @UseGuards(JwtAuthGuard)
  @SetMetadata(FEATURE_KEY, null)
  registerToken(@Req() req: any, @Body('token') token: string) {
    return this.notificationsService.registerFcmToken(req.user.sub, token);
  }

  // Test FCM Push notification directly to this device or registered tokens
  // NOTE: @SetMetadata overrides class-level FeatureGuard — FCM token test must never be feature-gated
  @Post('test-push')
  @UseGuards(JwtAuthGuard)
  @SetMetadata(FEATURE_KEY, null)
  testPush(@Req() req: any, @Body('token') token?: string) {
    return this.notificationsService.testFcm(token);
  }
}

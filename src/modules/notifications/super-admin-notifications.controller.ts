import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FirebaseService } from './firebase.service';

@Controller('super-admin/notifications')
@UseGuards(JwtAuthGuard)
export class SuperAdminNotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('inbox')
  async getInbox(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return this.notificationsService.getSystemInbox({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      type,
      category,
    });
  }

  @Patch('inbox/:id/read')
  async markRead(@Param('id') id: string) {
    return this.notificationsService.markAlertRead(id);
  }

  @Patch('inbox/read-all')
  async markAllRead() {
    return this.notificationsService.markAllAlertsRead();
  }

  @Delete('inbox/:id')
  async deleteAlert(@Param('id') id: string) {
    return this.notificationsService.deleteAlert(id);
  }

  @Get('broadcasts')
  async getBroadcasts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getBroadcasts(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post('broadcast')
  async sendBroadcast(@Body() body: any, @Req() req: any) {
    const adminUser = req.user;
    return this.notificationsService.sendPlatformBroadcast(body, adminUser);
  }

  @Post('register-fcm-token')
  async registerFcmToken(@Body() body: { token: string }, @Req() req: any) {
    const userId = req.user?.sub || req.user?._id;
    return this.notificationsService.registerFcmToken(userId, body.token);
  }

  @Post('test-fcm')
  async testFcm(@Body() body: { token?: string }) {
    return this.notificationsService.testFcm(body.token);
  }

  @Get('firebase-status')
  async getFirebaseStatus() {
    return this.firebaseService.testFcmConnection();
  }
}

import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Req,
  Ip,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin System & Third-Party Settings Controller
 * SRS Reference: Section 2.1 (Manage system-level settings) & Section 73 (Third-Party Services)
 */
@Controller('super-admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  /**
   * Get all system settings with masked secret keys
   * GET /super-admin/settings
   */
  @Get()
  getSettings() {
    return this.settingsService.getMaskedSettings();
  }

  /**
   * Update a specific settings category
   * PUT /super-admin/settings/:category
   */
  @Put(':category')
  updateCategory(
    @Param('category') category: string,
    @Body() body: any,
    @Req() req: any,
    @Ip() ipAddress?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.settingsService.updateCategory(
      category,
      body,
      req.user,
      ipAddress,
      userAgent,
    );
  }

  /**
   * Test connection to a third-party service provider
   * POST /super-admin/settings/test-connection
   */
  @Post('test-connection')
  testConnection(@Body() body: { provider: string; credentials: any }) {
    return this.settingsService.testConnection(body.provider, body.credentials);
  }
}

import { Controller, Get, Req } from '@nestjs/common';
import { PublicConfigService } from './public-config.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

@Controller('config')
export class PublicConfigController {
  constructor(private publicConfigService: PublicConfigService) {}

  /**
   * GET /config
   * Called by frontend on app load — returns branding, enabled features,
   * registration form config, area levels for this tenant/domain.
   * This is the white-label bootstrap endpoint.
   */
  @Get()
  getConfig(@Req() req: TenantRequest) {
    return this.publicConfigService.getConfig(req.tenant);
  }
}

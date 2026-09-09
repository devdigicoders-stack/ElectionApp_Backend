import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogsDto } from './audit-logs.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin Audit Logs Controller
 * SRS Reference: Section 59 (Audit Log System) & Section 45.2 (Impersonation Logging)
 * Base route: /super-admin/audit-logs
 */
@Controller('super-admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * Query platform-wide audit trail
   * Filter by action, tenantId, search keyword, page, limit
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll(@Query() query: QueryAuditLogsDto) {
    return this.auditLogsService.findAll(query);
  }
}

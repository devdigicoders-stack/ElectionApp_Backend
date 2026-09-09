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
import { AdminUsersService } from './admin-users.service';
import {
  CreateSuperAdminStaffDto,
  UpdateSuperAdminStaffDto,
  ResetStaffPasswordDto,
  QueryStaffDto,
  PlatformStaffRole,
  DEFAULT_PLATFORM_PERMISSIONS,
  PLATFORM_ROLES_METADATA,
  AVAILABLE_PERMISSIONS_BY_CATEGORY,
} from './super-admin-staff.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '../../shared/types';

/**
 * Super Admin Staff & Internal Team Management Controller
 * SRS Reference: Section 4.1 (Platform-Level Roles & Super Admin Staff)
 * Base route: /super-admin/staff
 */
@Controller('super-admin/staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperAdminStaffController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  /**
   * Create a new platform staff member (Sales, Support, Tech, Finance)
   * POST /super-admin/staff
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  createStaff(@Body() dto: CreateSuperAdminStaffDto) {
    return this.adminUsersService.createStaff(dto);
  }

  /**
   * List all platform staff with role and status filters
   * GET /super-admin/staff
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAllStaff(@Query() query: QueryStaffDto) {
    return this.adminUsersService.findAllStaff(query);
  }

  /**
   * List available platform roles and default permissions (SRS Sec 4.1)
   * GET /super-admin/staff/roles
   */
  @Get('roles')
  @Roles(UserRole.SUPER_ADMIN)
  getAvailableRoles() {
    return {
      roles: PLATFORM_ROLES_METADATA,
      roleKeys: Object.values(PlatformStaffRole),
      defaultPermissions: DEFAULT_PLATFORM_PERMISSIONS,
      availablePermissionsByCategory: AVAILABLE_PERMISSIONS_BY_CATEGORY,
    };
  }

  /**
   * Get single staff member details
   * GET /super-admin/staff/:id
   */
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  findOneStaff(@Param('id') id: string) {
    return this.adminUsersService.findOneStaff(id);
  }

  /**
   * Update staff member details (name, phone, role, permissions)
   * PATCH /super-admin/staff/:id
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  updateStaff(@Param('id') id: string, @Body() dto: UpdateSuperAdminStaffDto) {
    return this.adminUsersService.updateStaff(id, dto);
  }

  /**
   * Toggle staff active status (activate/deactivate)
   * PATCH /super-admin/staff/:id/status
   */
  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  toggleStaffStatus(@Param('id') id: string, @Req() req: any) {
    const requesterId = req.user?.sub || req.user?.id;
    return this.adminUsersService.toggleStaffStatus(id, requesterId);
  }

  /**
   * Reset staff member's password
   * PATCH /super-admin/staff/:id/reset-password
   */
  @Patch(':id/reset-password')
  @Roles(UserRole.SUPER_ADMIN)
  resetStaffPassword(@Param('id') id: string, @Body() dto: ResetStaffPasswordDto) {
    return this.adminUsersService.resetStaffPassword(id, dto.newPassword);
  }

  /**
   * Delete platform staff member
   * DELETE /super-admin/staff/:id
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  removeStaff(@Param('id') id: string, @Req() req: any) {
    const requesterId = req.user?.sub || req.user?.id;
    return this.adminUsersService.removeStaff(id, requesterId);
  }
}

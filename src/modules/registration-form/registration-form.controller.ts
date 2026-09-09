import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistrationFormService } from './registration-form.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  BulkUpdateRegistrationFieldsDto,
  CreateRegistrationFieldDto,
  UpdateRegistrationFieldDto,
  CompleteCitizenProfileDto,
} from './registration-form.dto';

@Controller('registration-form')
export class RegistrationFormController {
  constructor(private registrationFormService: RegistrationFormService) {}

  /**
   * 1. [Public] Get Active Registration Form Schema & Cascading Area Levels
   * GET /registration-form/public
   */
  @Get('public')
  getPublicForm(@Req() req: TenantRequest) {
    return this.registrationFormService.getPublicForm(req.tenant);
  }

  /**
   * 2. [Admin] Get Full Form Builder Schema & Stats
   * GET /registration-form
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  getAdminForm(@Req() req: TenantRequest) {
    return this.registrationFormService.getAdminForm(req.tenant);
  }

  /**
   * 3. [Admin] Bulk Update & Reorder Form Fields
   * PUT /registration-form/fields
   */
  @Put('fields')
  @UseGuards(JwtAuthGuard)
  bulkUpdateFields(
    @Req() req: TenantRequest,
    @Body() dto: BulkUpdateRegistrationFieldsDto,
  ) {
    return this.registrationFormService.bulkUpdateFields(req.tenant, dto);
  }

  /**
   * 4. [Admin] Add Single Custom Field
   * POST /registration-form/fields
   */
  @Post('fields')
  @UseGuards(JwtAuthGuard)
  addField(
    @Req() req: TenantRequest,
    @Body() dto: CreateRegistrationFieldDto,
  ) {
    return this.registrationFormService.addField(req.tenant, dto);
  }

  /**
   * 5. [Admin] Update Field Configuration
   * PATCH /registration-form/fields/:key
   */
  @Patch('fields/:key')
  @UseGuards(JwtAuthGuard)
  updateField(
    @Req() req: TenantRequest,
    @Param('key') key: string,
    @Body() dto: UpdateRegistrationFieldDto,
  ) {
    return this.registrationFormService.updateField(req.tenant, key, dto);
  }

  /**
   * 6. [Admin] Delete Custom Field
   * DELETE /registration-form/fields/:key
   */
  @Delete('fields/:key')
  @UseGuards(JwtAuthGuard)
  deleteField(
    @Req() req: TenantRequest,
    @Param('key') key: string,
  ) {
    return this.registrationFormService.deleteField(req.tenant, key);
  }

  /**
   * 7. [Admin] Reset Form to Platform Default Template
   * POST /registration-form/reset-default
   */
  @Post('reset-default')
  @UseGuards(JwtAuthGuard)
  resetToDefault(@Req() req: TenantRequest) {
    return this.registrationFormService.resetToDefault(req.tenant);
  }

  /**
   * 8. [Citizen] Complete Profile with Dynamic Form Fields
   * POST /registration-form/complete-profile
   */
  @Post('complete-profile')
  @UseGuards(JwtAuthGuard)
  completeProfile(
    @Req() req: TenantRequest & { user: any },
    @Body() body: CompleteCitizenProfileDto & Record<string, any>,
  ) {
    return this.registrationFormService.completeCitizenProfile(
      req.tenant,
      req.user.sub,
      body,
    );
  }
}

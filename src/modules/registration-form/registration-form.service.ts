import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from '../tenants/tenant.schema';
import { User, UserDocument } from '../users/user.schema';
import { AreaLevel, AreaLevelDocument } from '../areas/area.schema';
import {
  DEFAULT_REGISTRATION_FIELDS,
  IRegistrationField,
  RegistrationFieldType,
} from './registration-form.types';
import {
  BulkUpdateRegistrationFieldsDto,
  CreateRegistrationFieldDto,
  UpdateRegistrationFieldDto,
} from './registration-form.dto';

@Injectable()
export class RegistrationFormService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AreaLevel.name) private areaLevelModel: Model<AreaLevelDocument>,
  ) {}

  /**
   * Helper: Get current fields from tenant settings, or fallback to default
   */
  private getTenantFields(tenant: TenantDocument): IRegistrationField[] {
    const fields = tenant.settings?.registrationFields;
    if (Array.isArray(fields) && fields.length > 0) {
      return JSON.parse(JSON.stringify(fields));
    }
    return JSON.parse(JSON.stringify(DEFAULT_REGISTRATION_FIELDS));
  }

  /**
   * 1. Public Endpoint: Get active registration form fields & area levels for citizens
   */
  async getPublicForm(tenant: TenantDocument) {
    const rawFields = this.getTenantFields(tenant);

    const activeFields = rawFields
      .filter((f) => f.isActive !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    const areaLevels = await this.areaLevelModel
      .find({ tenantId: tenant._id })
      .sort({ levelOrder: 1 })
      .select('levelOrder name isRequired');

    return {
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        branding: tenant.branding,
      },
      fields: activeFields,
      areaLevels,
      totalFields: activeFields.length,
    };
  }

  /**
   * 2. Admin Endpoint: Get full form builder schema (including inactive & system fields)
   */
  async getAdminForm(tenant: TenantDocument) {
    const fields = this.getTenantFields(tenant).sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    );

    const activeFieldsCount = fields.filter((f) => f.isActive !== false).length;
    const customFieldsCount = fields.filter((f) => !f.isSystem).length;

    return {
      fields,
      supportedFieldTypes: Object.values(RegistrationFieldType),
      stats: {
        totalFields: fields.length,
        activeFieldsCount,
        customFieldsCount,
      },
    };
  }

  /**
   * 3. Admin: Bulk save / re-order all registration fields
   */
  async bulkUpdateFields(tenant: TenantDocument, dto: BulkUpdateRegistrationFieldsDto) {
    // Ensure unique keys
    const keys = new Set<string>();
    for (const f of dto.fields) {
      if (keys.has(f.key)) {
        throw new BadRequestException(`Duplicate field key: "${f.key}" is not allowed.`);
      }
      keys.add(f.key);
    }

    // Ensure vital system fields are not completely missing
    if (!keys.has('mobile')) {
      throw new BadRequestException('The "mobile" field is required by the platform and cannot be removed.');
    }

    const currentFields = this.getTenantFields(tenant);
    const systemMap = new Map(currentFields.map((f) => [f.key, f.isSystem]));

    const fieldsToSave: IRegistrationField[] = dto.fields.map((f, index) => ({
      key: f.key,
      label: f.label,
      type: f.type,
      required: !!f.required,
      options: f.options || [],
      placeholder: f.placeholder || '',
      helpText: f.helpText || '',
      sortOrder: f.sortOrder ?? index + 1,
      isActive: f.isActive !== false,
      isSystem: systemMap.get(f.key) ?? false,
    }));

    await this.tenantModel.updateOne(
      { _id: tenant._id },
      {
        $set: {
          'settings.registrationFields': fieldsToSave,
          updatedAt: new Date(),
        },
      },
    );

    return {
      message: 'Registration form fields updated successfully',
      fields: fieldsToSave,
    };
  }

  /**
   * 4. Admin: Add a single custom field
   */
  async addField(tenant: TenantDocument, dto: CreateRegistrationFieldDto) {
    const fields = this.getTenantFields(tenant);

    const exists = fields.some((f) => f.key.toLowerCase() === dto.key.toLowerCase());
    if (exists) {
      throw new ConflictException(`A registration field with key "${dto.key}" already exists.`);
    }

    const newField: IRegistrationField = {
      key: dto.key.trim(),
      label: dto.label,
      type: dto.type,
      required: !!dto.required,
      options: dto.options || [],
      placeholder: dto.placeholder || '',
      helpText: dto.helpText || '',
      sortOrder: dto.sortOrder ?? fields.length + 1,
      isActive: dto.isActive !== false,
      isSystem: false,
    };

    fields.push(newField);
    fields.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    await this.tenantModel.updateOne(
      { _id: tenant._id },
      {
        $set: {
          'settings.registrationFields': fields,
          updatedAt: new Date(),
        },
      },
    );

    return {
      message: `Field "${newField.label}" added successfully`,
      field: newField,
      totalFields: fields.length,
    };
  }

  /**
   * 5. Admin: Update a field's configuration
   */
  async updateField(tenant: TenantDocument, key: string, dto: UpdateRegistrationFieldDto) {
    const fields = this.getTenantFields(tenant);
    const fieldIndex = fields.findIndex((f) => f.key.toLowerCase() === key.toLowerCase());

    if (fieldIndex === -1) {
      throw new NotFoundException(`Field with key "${key}" not found in registration form.`);
    }

    const current = fields[fieldIndex];

    if (current.key === 'mobile' && dto.required === false) {
      throw new BadRequestException('The "mobile" field must remain mandatory for authentication.');
    }

    if (dto.label !== undefined) current.label = dto.label;
    if (dto.type !== undefined) current.type = dto.type;
    if (dto.required !== undefined) current.required = dto.required;
    if (dto.options !== undefined) current.options = dto.options;
    if (dto.placeholder !== undefined) current.placeholder = dto.placeholder;
    if (dto.helpText !== undefined) current.helpText = dto.helpText;
    if (dto.sortOrder !== undefined) current.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) current.isActive = dto.isActive;

    fields.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    await this.tenantModel.updateOne(
      { _id: tenant._id },
      {
        $set: {
          'settings.registrationFields': fields,
          updatedAt: new Date(),
        },
      },
    );

    return {
      message: `Field "${key}" updated successfully`,
      field: current,
    };
  }

  /**
   * 6. Admin: Delete a custom field
   */
  async deleteField(tenant: TenantDocument, key: string) {
    const fields = this.getTenantFields(tenant);
    const field = fields.find((f) => f.key.toLowerCase() === key.toLowerCase());

    if (!field) {
      throw new NotFoundException(`Field with key "${key}" not found.`);
    }

    if (field.isSystem) {
      throw new BadRequestException(
        `Cannot delete system field "${key}". You can deactivate it by setting isActive: false instead.`,
      );
    }

    const filtered = fields.filter((f) => f.key.toLowerCase() !== key.toLowerCase());

    await this.tenantModel.updateOne(
      { _id: tenant._id },
      {
        $set: {
          'settings.registrationFields': filtered,
          updatedAt: new Date(),
        },
      },
    );

    return {
      message: `Custom field "${key}" deleted successfully`,
      remainingFieldsCount: filtered.length,
    };
  }

  /**
   * 7. Admin: Reset form to platform default template
   */
  async resetToDefault(tenant: TenantDocument) {
    await this.tenantModel.updateOne(
      { _id: tenant._id },
      {
        $set: {
          'settings.registrationFields': DEFAULT_REGISTRATION_FIELDS,
          updatedAt: new Date(),
        },
      },
    );

    return {
      message: 'Registration form reset to default template successfully',
      fields: DEFAULT_REGISTRATION_FIELDS,
    };
  }

  /**
   * 8. Citizen: Complete Profile with Dynamic Custom Fields validation
   */
  async completeCitizenProfile(tenant: TenantDocument, userId: string, submissionData: any) {
    const targetUserId = submissionData.userId || userId;
    let user = await this.userModel.findOne({
      _id: Types.ObjectId.isValid(targetUserId) ? new Types.ObjectId(targetUserId) : targetUserId,
      tenantId: tenant._id,
    });

    if (!user && submissionData.mobile) {
      user = await this.userModel.findOne({
        mobile: submissionData.mobile,
        tenantId: tenant._id,
      });
    }

    if (!user) {
      throw new NotFoundException(
        'Citizen account not found. Please login via /auth/verify-otp using mobile & OTP to obtain a valid citizen token, or provide a valid citizen userId/mobile.',
      );
    }

    const fields = this.getTenantFields(tenant).filter((f) => f.isActive !== false);

    // Dynamic field validation
    const missingRequired: string[] = [];
    const customFields: Record<string, any> = { ...user.customFields };

    // Extract input from body or nested customFields
    const inputPayload = {
      ...submissionData,
      ...(submissionData.customFields || {}),
    };

    for (const field of fields) {
      // Mobile is already verified via OTP and stored on user document
      if (field.key === 'mobile') continue;

      const val = inputPayload[field.key];

      if (field.required && (val === undefined || val === null || val === '')) {
        missingRequired.push(`${field.label} (${field.key})`);
      }

      // Map core fields directly to user document
      if (val !== undefined && val !== null && val !== '') {
        if (field.key === 'name') {
          user.name = String(val).trim();
        } else if (field.key === 'gender') {
          user.gender = String(val).trim();
        } else if (field.key === 'dob') {
          user.dob = new Date(val);
        } else if (field.key === 'areaId' || field.key === 'area') {
          if (Types.ObjectId.isValid(val)) {
            user.areaId = new Types.ObjectId(val);
          }
        } else {
          // Dynamic custom field
          customFields[field.key] = val;
        }
      }
    }

    if (missingRequired.length > 0) {
      throw new BadRequestException(
        missingRequired.map((f) => `Missing required field: ${f}`),
      );
    }

    user.customFields = customFields;
    user.isProfileComplete = true;
    await user.save();

    return {
      message: 'Citizen profile completed successfully',
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        dob: user.dob,
        areaId: user.areaId,
        customFields: user.customFields,
        isProfileComplete: user.isProfileComplete,
      },
    };
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationFormService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_schema_1 = require("../tenants/tenant.schema");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
const registration_form_types_1 = require("./registration-form.types");
let RegistrationFormService = class RegistrationFormService {
    constructor(tenantModel, userModel, areaLevelModel) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
        this.areaLevelModel = areaLevelModel;
    }
    getTenantFields(tenant) {
        const fields = tenant.settings?.registrationFields;
        if (Array.isArray(fields) && fields.length > 0) {
            return JSON.parse(JSON.stringify(fields));
        }
        return JSON.parse(JSON.stringify(registration_form_types_1.DEFAULT_REGISTRATION_FIELDS));
    }
    async getPublicForm(tenant) {
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
    async getAdminForm(tenant) {
        const fields = this.getTenantFields(tenant).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        const activeFieldsCount = fields.filter((f) => f.isActive !== false).length;
        const customFieldsCount = fields.filter((f) => !f.isSystem).length;
        return {
            fields,
            supportedFieldTypes: Object.values(registration_form_types_1.RegistrationFieldType),
            stats: {
                totalFields: fields.length,
                activeFieldsCount,
                customFieldsCount,
            },
        };
    }
    async bulkUpdateFields(tenant, dto) {
        const keys = new Set();
        for (const f of dto.fields) {
            if (keys.has(f.key)) {
                throw new common_1.BadRequestException(`Duplicate field key: "${f.key}" is not allowed.`);
            }
            keys.add(f.key);
        }
        if (!keys.has('mobile')) {
            throw new common_1.BadRequestException('The "mobile" field is required by the platform and cannot be removed.');
        }
        const currentFields = this.getTenantFields(tenant);
        const systemMap = new Map(currentFields.map((f) => [f.key, f.isSystem]));
        const fieldsToSave = dto.fields.map((f, index) => ({
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
        await this.tenantModel.updateOne({ _id: tenant._id }, {
            $set: {
                'settings.registrationFields': fieldsToSave,
                updatedAt: new Date(),
            },
        });
        return {
            message: 'Registration form fields updated successfully',
            fields: fieldsToSave,
        };
    }
    async addField(tenant, dto) {
        const fields = this.getTenantFields(tenant);
        const exists = fields.some((f) => f.key.toLowerCase() === dto.key.toLowerCase());
        if (exists) {
            throw new common_1.ConflictException(`A registration field with key "${dto.key}" already exists.`);
        }
        const newField = {
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
        await this.tenantModel.updateOne({ _id: tenant._id }, {
            $set: {
                'settings.registrationFields': fields,
                updatedAt: new Date(),
            },
        });
        return {
            message: `Field "${newField.label}" added successfully`,
            field: newField,
            totalFields: fields.length,
        };
    }
    async updateField(tenant, key, dto) {
        const fields = this.getTenantFields(tenant);
        const fieldIndex = fields.findIndex((f) => f.key.toLowerCase() === key.toLowerCase());
        if (fieldIndex === -1) {
            throw new common_1.NotFoundException(`Field with key "${key}" not found in registration form.`);
        }
        const current = fields[fieldIndex];
        if (current.key === 'mobile' && dto.required === false) {
            throw new common_1.BadRequestException('The "mobile" field must remain mandatory for authentication.');
        }
        if (dto.label !== undefined)
            current.label = dto.label;
        if (dto.type !== undefined)
            current.type = dto.type;
        if (dto.required !== undefined)
            current.required = dto.required;
        if (dto.options !== undefined)
            current.options = dto.options;
        if (dto.placeholder !== undefined)
            current.placeholder = dto.placeholder;
        if (dto.helpText !== undefined)
            current.helpText = dto.helpText;
        if (dto.sortOrder !== undefined)
            current.sortOrder = dto.sortOrder;
        if (dto.isActive !== undefined)
            current.isActive = dto.isActive;
        fields.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        await this.tenantModel.updateOne({ _id: tenant._id }, {
            $set: {
                'settings.registrationFields': fields,
                updatedAt: new Date(),
            },
        });
        return {
            message: `Field "${key}" updated successfully`,
            field: current,
        };
    }
    async deleteField(tenant, key) {
        const fields = this.getTenantFields(tenant);
        const field = fields.find((f) => f.key.toLowerCase() === key.toLowerCase());
        if (!field) {
            throw new common_1.NotFoundException(`Field with key "${key}" not found.`);
        }
        if (field.isSystem) {
            throw new common_1.BadRequestException(`Cannot delete system field "${key}". You can deactivate it by setting isActive: false instead.`);
        }
        const filtered = fields.filter((f) => f.key.toLowerCase() !== key.toLowerCase());
        await this.tenantModel.updateOne({ _id: tenant._id }, {
            $set: {
                'settings.registrationFields': filtered,
                updatedAt: new Date(),
            },
        });
        return {
            message: `Custom field "${key}" deleted successfully`,
            remainingFieldsCount: filtered.length,
        };
    }
    async resetToDefault(tenant) {
        await this.tenantModel.updateOne({ _id: tenant._id }, {
            $set: {
                'settings.registrationFields': registration_form_types_1.DEFAULT_REGISTRATION_FIELDS,
                updatedAt: new Date(),
            },
        });
        return {
            message: 'Registration form reset to default template successfully',
            fields: registration_form_types_1.DEFAULT_REGISTRATION_FIELDS,
        };
    }
    async completeCitizenProfile(tenant, userId, submissionData) {
        const targetUserId = submissionData.userId || userId;
        let user = await this.userModel.findOne({
            _id: mongoose_2.Types.ObjectId.isValid(targetUserId) ? new mongoose_2.Types.ObjectId(targetUserId) : targetUserId,
            tenantId: tenant._id,
        });
        if (!user && submissionData.mobile) {
            user = await this.userModel.findOne({
                mobile: submissionData.mobile,
                tenantId: tenant._id,
            });
        }
        if (!user) {
            throw new common_1.NotFoundException('Citizen account not found. Please login via /auth/verify-otp using mobile & OTP to obtain a valid citizen token, or provide a valid citizen userId/mobile.');
        }
        const fields = this.getTenantFields(tenant).filter((f) => f.isActive !== false);
        const missingRequired = [];
        const customFields = { ...user.customFields };
        const inputPayload = {
            ...submissionData,
            ...(submissionData.customFields || {}),
        };
        for (const field of fields) {
            if (field.key === 'mobile')
                continue;
            const val = inputPayload[field.key];
            if (field.required && (val === undefined || val === null || val === '')) {
                missingRequired.push(`${field.label} (${field.key})`);
            }
            if (val !== undefined && val !== null && val !== '') {
                if (field.key === 'name') {
                    user.name = String(val).trim();
                }
                else if (field.key === 'gender') {
                    user.gender = String(val).trim();
                }
                else if (field.key === 'dob') {
                    user.dob = new Date(val);
                }
                else if (field.key === 'areaId' || field.key === 'area') {
                    if (mongoose_2.Types.ObjectId.isValid(val)) {
                        user.areaId = new mongoose_2.Types.ObjectId(val);
                    }
                }
                else {
                    customFields[field.key] = val;
                }
            }
        }
        if (missingRequired.length > 0) {
            throw new common_1.BadRequestException(missingRequired.map((f) => `Missing required field: ${f}`));
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
};
exports.RegistrationFormService = RegistrationFormService;
exports.RegistrationFormService = RegistrationFormService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(area_schema_1.AreaLevel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RegistrationFormService);
//# sourceMappingURL=registration-form.service.js.map
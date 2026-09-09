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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryStaffDto = exports.ResetStaffPasswordDto = exports.UpdateSuperAdminStaffDto = exports.CreateSuperAdminStaffDto = exports.AVAILABLE_PERMISSIONS_BY_CATEGORY = exports.PLATFORM_ROLES_METADATA = exports.DEFAULT_PLATFORM_PERMISSIONS = exports.PlatformStaffRole = void 0;
const class_validator_1 = require("class-validator");
var PlatformStaffRole;
(function (PlatformStaffRole) {
    PlatformStaffRole["SUPER_ADMIN"] = "super_admin";
    PlatformStaffRole["SALES_MANAGER"] = "sales_manager";
    PlatformStaffRole["SUPPORT_EXECUTIVE"] = "support_executive";
    PlatformStaffRole["TECHNICAL_SUPPORT"] = "technical_support";
    PlatformStaffRole["FINANCE_MANAGER"] = "finance_manager";
})(PlatformStaffRole || (exports.PlatformStaffRole = PlatformStaffRole = {}));
exports.DEFAULT_PLATFORM_PERMISSIONS = {
    [PlatformStaffRole.SUPER_ADMIN]: ['*'],
    [PlatformStaffRole.SALES_MANAGER]: [
        'tenants:read',
        'tenants:create',
        'plans:read',
        'subscriptions:read',
        'usage:read',
    ],
    [PlatformStaffRole.SUPPORT_EXECUTIVE]: [
        'tenants:read',
        'tenants:impersonate',
        'audit_logs:read',
        'complaints:read',
    ],
    [PlatformStaffRole.TECHNICAL_SUPPORT]: [
        'tenants:read',
        'tenants:impersonate',
        'tenants:domain',
        'audit_logs:read',
        'system:health',
    ],
    [PlatformStaffRole.FINANCE_MANAGER]: [
        'subscriptions:read',
        'subscriptions:manage',
        'invoices:read',
        'revenue:read',
        'plans:read',
    ],
};
exports.PLATFORM_ROLES_METADATA = [
    {
        key: PlatformStaffRole.SUPER_ADMIN,
        name: 'Super Admin',
        description: 'Full unrestricted platform-level control across all tenants, plans, global settings, and billing.',
        isSystem: true,
        permissions: exports.DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.SUPER_ADMIN],
    },
    {
        key: PlatformStaffRole.SALES_MANAGER,
        name: 'Sales Manager',
        description: 'Handles prospective client onboarding, tenant creation, plans, and subscription inquiries.',
        isSystem: false,
        permissions: exports.DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.SALES_MANAGER],
    },
    {
        key: PlatformStaffRole.SUPPORT_EXECUTIVE,
        name: 'Support Executive',
        description: 'Handles client support, complaints review, audit logs, and authorized tenant troubleshooting.',
        isSystem: false,
        permissions: exports.DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.SUPPORT_EXECUTIVE],
    },
    {
        key: PlatformStaffRole.TECHNICAL_SUPPORT,
        name: 'Technical Support',
        description: 'Manages custom domains, SSL DNS verification, system health, and tech issues.',
        isSystem: false,
        permissions: exports.DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.TECHNICAL_SUPPORT],
    },
    {
        key: PlatformStaffRole.FINANCE_MANAGER,
        name: 'Finance Manager',
        description: 'Oversees SaaS revenue, client subscriptions, invoices, and plan billing cycles.',
        isSystem: false,
        permissions: exports.DEFAULT_PLATFORM_PERMISSIONS[PlatformStaffRole.FINANCE_MANAGER],
    },
];
exports.AVAILABLE_PERMISSIONS_BY_CATEGORY = [
    {
        category: 'Tenants & Onboarding',
        permissions: [
            { key: 'tenants:read', label: 'View Tenants' },
            { key: 'tenants:create', label: 'Create New Tenants' },
            { key: 'tenants:impersonate', label: 'Tenant Support Impersonation' },
            { key: 'tenants:domain', label: 'Manage Custom Domains' },
        ],
    },
    {
        category: 'Subscriptions & Billing',
        permissions: [
            { key: 'subscriptions:read', label: 'View Client Subscriptions' },
            { key: 'subscriptions:manage', label: 'Modify & Renew Subscriptions' },
            { key: 'invoices:read', label: 'View Invoices' },
            { key: 'revenue:read', label: 'View Revenue & Financial Reports' },
            { key: 'plans:read', label: 'View Subscription Plans' },
        ],
    },
    {
        category: 'Platform & Monitoring',
        permissions: [
            { key: 'audit_logs:read', label: 'View Security Audit Trail' },
            { key: 'usage:read', label: 'View Tenant Resource Usage & Overages' },
            { key: 'system:health', label: 'System Health & Metrics' },
            { key: 'complaints:read', label: 'Read Complaints' },
        ],
    },
];
class CreateSuperAdminStaffDto {
}
exports.CreateSuperAdminStaffDto = CreateSuperAdminStaffDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSuperAdminStaffDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSuperAdminStaffDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    __metadata("design:type", String)
], CreateSuperAdminStaffDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSuperAdminStaffDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSuperAdminStaffDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateSuperAdminStaffDto.prototype, "permissions", void 0);
class UpdateSuperAdminStaffDto {
}
exports.UpdateSuperAdminStaffDto = UpdateSuperAdminStaffDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSuperAdminStaffDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSuperAdminStaffDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSuperAdminStaffDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateSuperAdminStaffDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSuperAdminStaffDto.prototype, "isActive", void 0);
class ResetStaffPasswordDto {
}
exports.ResetStaffPasswordDto = ResetStaffPasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'New password must be at least 6 characters long' }),
    __metadata("design:type", String)
], ResetStaffPasswordDto.prototype, "newPassword", void 0);
class QueryStaffDto {
}
exports.QueryStaffDto = QueryStaffDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryStaffDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryStaffDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], QueryStaffDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryStaffDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryStaffDto.prototype, "limit", void 0);
//# sourceMappingURL=super-admin-staff.dto.js.map
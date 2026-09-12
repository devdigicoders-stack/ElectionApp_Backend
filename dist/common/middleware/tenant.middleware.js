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
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_schema_1 = require("../../modules/tenants/tenant.schema");
const types_1 = require("../../shared/types");
let TenantMiddleware = class TenantMiddleware {
    constructor(tenantModel) {
        this.tenantModel = tenantModel;
    }
    async use(req, res, next) {
        const headerSlug = req.headers['x-tenant-slug'] || req.headers['x-tenant'];
        const headerTenantId = req.headers['x-tenant-id'];
        const querySlug = req.query?.['tenant'];
        const queryTenantId = req.query?.['tenantId'];
        const host = (req.hostname || '').toLowerCase().trim();
        const isLocalhost = host === 'localhost' || host === '127.0.0.1';
        const isCloudHosting = host.endsWith('onrender.com') ||
            host.endsWith('vercel.app') ||
            host.endsWith('railway.app') ||
            host.endsWith('fly.dev') ||
            host.endsWith('herokuapp.com');
        const isBaseApiDomain = host === 'election.digicoders.in' ||
            host === 'api.election.digicoders.in' ||
            host === 'elelection.digicoders.in';
        let subdomain = null;
        if (!isLocalhost && !isCloudHosting && !isBaseApiDomain && host.includes('.')) {
            if (host.endsWith('.election.digicoders.in')) {
                subdomain = host.replace('.election.digicoders.in', '').split('.')[0];
            }
            else if (host.endsWith('.elelection.digicoders.in')) {
                subdomain = host.replace('.elelection.digicoders.in', '').split('.')[0];
            }
            else {
                const parts = host.split('.');
                if (parts.length > 2) {
                    subdomain = parts[0];
                }
            }
        }
        let tenant = null;
        if (headerTenantId) {
            if ((0, mongoose_2.isValidObjectId)(headerTenantId)) {
                tenant = await this.tenantModel.findById(headerTenantId);
            }
            if (!tenant) {
                tenant = await this.tenantModel.findOne({ slug: headerTenantId.toLowerCase().trim() });
            }
            if (!tenant) {
                throw new common_1.BadRequestException(`Tenant not found for "x-tenant-id": "${headerTenantId}". Provide a valid 24-character ObjectId or tenant slug.`);
            }
        }
        else if (queryTenantId) {
            if ((0, mongoose_2.isValidObjectId)(queryTenantId)) {
                tenant = await this.tenantModel.findById(queryTenantId);
            }
            if (!tenant) {
                tenant = await this.tenantModel.findOne({ slug: queryTenantId.toLowerCase().trim() });
            }
            if (!tenant) {
                throw new common_1.BadRequestException(`Tenant not found for "tenantId": "${queryTenantId}". Provide a valid 24-character ObjectId or tenant slug.`);
            }
        }
        else if (headerSlug) {
            tenant = await this.tenantModel.findOne({ slug: headerSlug.toLowerCase().trim() });
        }
        else if (querySlug) {
            tenant = await this.tenantModel.findOne({ slug: querySlug.toLowerCase().trim() });
        }
        else if (subdomain) {
            tenant = await this.tenantModel.findOne({
                $or: [{ customDomain: host }, { slug: subdomain.toLowerCase() }],
            });
        }
        else {
            tenant = await this.tenantModel.findOne({ customDomain: host });
        }
        if (!tenant && (isLocalhost || isCloudHosting || isBaseApiDomain)) {
            tenant = (await this.tenantModel.findOne({ slug: 'demo' })) || (await this.tenantModel.findOne({ status: types_1.TenantStatus.ACTIVE }));
        }
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found. Please provide a valid "x-tenant-slug" or "x-tenant-id" header, or access via a valid subdomain/custom domain.');
        }
        if (tenant.status === 'suspended') {
            throw new common_1.ForbiddenException('This account has been suspended');
        }
        req.tenant = tenant;
        next();
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map
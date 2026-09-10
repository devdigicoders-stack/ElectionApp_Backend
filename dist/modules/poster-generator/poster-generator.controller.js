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
exports.PosterGeneratorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const poster_generator_service_1 = require("./poster-generator.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
const poster_dto_1 = require("./poster.dto");
let PosterGeneratorController = class PosterGeneratorController {
    constructor(posterService) {
        this.posterService = posterService;
    }
    createTemplate(req, body, file) {
        let parsedFields = body.fields;
        if (typeof body.fields === 'string') {
            try {
                parsedFields = JSON.parse(body.fields);
            }
            catch (e) { }
        }
        let parsedTags = body.tags;
        if (typeof body.tags === 'string') {
            try {
                parsedTags = JSON.parse(body.tags);
            }
            catch (e) {
                parsedTags = body.tags.split(',').map((t) => t.trim());
            }
        }
        const dto = {
            title: body.title,
            category: body.category,
            description: body.description,
            templateImageUrl: body.templateImageUrl,
            thumbnailUrl: body.thumbnailUrl,
            width: body.width ? Number(body.width) : undefined,
            height: body.height ? Number(body.height) : undefined,
            dimensionPreset: body.dimensionPreset,
            fields: parsedFields,
            includeTenantBranding: body.includeTenantBranding !== undefined ? String(body.includeTenantBranding) === 'true' : true,
            expiresAt: body.expiresAt,
            tags: parsedTags,
            isActive: body.isActive !== undefined ? String(body.isActive) === 'true' : true,
            sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
        };
        return this.posterService.createTemplate(req.tenant, dto, file);
    }
    getAdminTemplates(req, query) {
        return this.posterService.getTemplates(req.tenant, query, true);
    }
    getCategories(req) {
        return this.posterService.getTemplateCategories(req.tenant);
    }
    getTemplates(req, query) {
        return this.posterService.getTemplates(req.tenant, query, false);
    }
    getTemplate(req, id) {
        return this.posterService.getTemplate(req.tenant, id);
    }
    updateTemplate(req, id, body, file) {
        let parsedFields = body.fields;
        if (typeof body.fields === 'string') {
            try {
                parsedFields = JSON.parse(body.fields);
            }
            catch (e) { }
        }
        const dto = {
            ...body,
            fields: parsedFields,
            width: body.width ? Number(body.width) : undefined,
            height: body.height ? Number(body.height) : undefined,
            includeTenantBranding: body.includeTenantBranding !== undefined ? String(body.includeTenantBranding) === 'true' : undefined,
            isActive: body.isActive !== undefined ? String(body.isActive) === 'true' : undefined,
        };
        return this.posterService.updateTemplate(req.tenant, id, dto, file);
    }
    removeTemplate(req, id) {
        return this.posterService.removeTemplate(req.tenant, id);
    }
    async removeBackground(req, photo, photoUrl) {
        const targetPath = photo ? photo.path : photoUrl;
        if (!targetPath) {
            throw new common_1.BadRequestException('Please provide a photo file upload or photoUrl');
        }
        const result = await this.posterService.removeBackground(req.tenant, targetPath);
        return {
            message: 'Background removed successfully. You can use this cutout in banner generation.',
            originalUrl: targetPath,
            cutoutUrl: result.cutoutUrl,
            provider: result.provider,
            dimensions: { width: result.width, height: result.height },
        };
    }
    async generatePoster(req, templateId, body, photo) {
        let fieldValues = {};
        if (typeof body.fieldValues === 'string') {
            try {
                fieldValues = JSON.parse(body.fieldValues);
            }
            catch (e) {
                fieldValues = {};
            }
        }
        else if (typeof body.fieldValues === 'object' && body.fieldValues !== null) {
            fieldValues = body.fieldValues;
        }
        if (body.name && !fieldValues['name'])
            fieldValues['name'] = body.name;
        if (body.designation && !fieldValues['designation'])
            fieldValues['designation'] = body.designation;
        if (body.area && !fieldValues['area'])
            fieldValues['area'] = body.area;
        if (body.custom_text && !fieldValues['custom_text'])
            fieldValues['custom_text'] = body.custom_text;
        const photoPath = photo ? photo.path : null;
        const dto = {
            fieldValues,
            photoUrl: body.photoUrl,
            removeBg: body.removeBg !== undefined ? String(body.removeBg) === 'true' : false,
            format: (body.format === 'jpg' || body.format === 'jpeg') ? 'jpg' : 'png',
            includeBranding: body.includeBranding !== undefined ? String(body.includeBranding) === 'true' : true,
        };
        return this.posterService.generatePoster(req.tenant, templateId, fieldValues, photoPath, dto, req.user?.sub);
    }
    async downloadPoster(req, id, res) {
        const { filePath, filename } = await this.posterService.getPosterFilePath(req.tenant, id);
        return res.download(filePath, filename);
    }
    getMyPosters(req) {
        return this.posterService.getMyPosters(req.tenant, req.user.sub);
    }
    async getShareMetadata(req, id) {
        const { filename } = await this.posterService.getPosterFilePath(req.tenant, id);
        const domain = req.tenant.customDomain || `${req.tenant.slug}.localhost:3001`;
        const bannerUrl = `http://${domain}/uploads/${req.tenant.slug}/generated-posters/${filename}`;
        const downloadUrl = `http://${domain}/poster-generator/download/${id}`;
        const shareText = `Check out my official poster generated on ${req.tenant.name}! Download: ${downloadUrl}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        return {
            id,
            bannerUrl,
            downloadUrl,
            shareData: {
                title: `${req.tenant.name} Official Poster`,
                text: shareText,
                bannerUrl,
                downloadUrl,
                whatsappUrl,
            },
        };
    }
    adminGetAllPosters(req, query) {
        return this.posterService.adminGetAllPosters(req.tenant, query);
    }
    adminDeletePoster(req, id) {
        return this.posterService.adminDeletePoster(req.tenant, id);
    }
};
exports.PosterGeneratorController = PosterGeneratorController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('templateImage', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-templates');
                if (!(0, fs_1.existsSync)(dir))
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                cb(null, `tmpl-${Date.now()}-${Math.round(Math.random() * 1e6)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            cb(null, /jpeg|jpg|png|webp/.test((0, path_1.extname)(file.originalname).toLowerCase()));
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, poster_dto_1.QueryPosterTemplatesDto]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getAdminTemplates", null);
__decorate([
    (0, common_1.Get)('templates/categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, poster_dto_1.QueryPosterTemplatesDto]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('templateImage', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-templates');
                if (!(0, fs_1.existsSync)(dir))
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                cb(null, `tmpl-${Date.now()}-${Math.round(Math.random() * 1e6)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "removeTemplate", null);
__decorate([
    (0, common_1.Post)('remove-bg'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-photos');
                if (!(0, fs_1.existsSync)(dir))
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                cb(null, `raw-${Date.now()}-${Math.round(Math.random() * 1e6)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            cb(null, /jpeg|jpg|png|webp/.test((0, path_1.extname)(file.originalname).toLowerCase()));
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('photoUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PosterGeneratorController.prototype, "removeBackground", null);
__decorate([
    (0, common_1.Post)('generate/:templateId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-photos');
                if (!(0, fs_1.existsSync)(dir))
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            cb(null, /jpeg|jpg|png|webp/.test((0, path_1.extname)(file.originalname).toLowerCase()));
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('templateId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PosterGeneratorController.prototype, "generatePoster", null);
__decorate([
    (0, common_1.Get)('download/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PosterGeneratorController.prototype, "downloadPoster", null);
__decorate([
    (0, common_1.Get)('my-posters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getMyPosters", null);
__decorate([
    (0, common_1.Get)('share/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PosterGeneratorController.prototype, "getShareMetadata", null);
__decorate([
    (0, common_1.Get)('admin/posters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "adminGetAllPosters", null);
__decorate([
    (0, common_1.Delete)('admin/posters/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.LEADER, types_1.UserRole.ADMIN, types_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "adminDeletePoster", null);
exports.PosterGeneratorController = PosterGeneratorController = __decorate([
    (0, common_1.Controller)('poster-generator'),
    (0, common_1.UseGuards)(feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.POSTER_GENERATOR),
    __metadata("design:paramtypes", [poster_generator_service_1.PosterGeneratorService])
], PosterGeneratorController);
//# sourceMappingURL=poster-generator.controller.js.map
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
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
let PosterGeneratorController = class PosterGeneratorController {
    constructor(posterService) {
        this.posterService = posterService;
    }
    createTemplate(req, body) {
        return this.posterService.createTemplate(req.tenant, body);
    }
    getTemplates(req, category) {
        return this.posterService.getTemplates(req.tenant, category);
    }
    getCategories(req) {
        return this.posterService.getTemplateCategories(req.tenant);
    }
    getTemplate(req, id) {
        return this.posterService.getTemplate(req.tenant, id);
    }
    updateTemplate(req, id, body) {
        return this.posterService.updateTemplate(req.tenant, id, body);
    }
    removeTemplate(req, id) {
        return this.posterService.removeTemplate(req.tenant, id);
    }
    async generatePoster(req, templateId, body, photo) {
        const fieldValues = typeof body.fieldValues === 'string'
            ? JSON.parse(body.fieldValues)
            : body.fieldValues || {};
        const photoPath = photo
            ? `/uploads/${req.tenant.slug}/poster-photos/${photo.filename}`
            : null;
        return this.posterService.generatePoster(req.tenant, templateId, fieldValues, photoPath, req.user?.sub);
    }
    getMyPosters(req) {
        return this.posterService.getMyPosters(req.tenant, req.user.sub);
    }
};
exports.PosterGeneratorController = PosterGeneratorController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('templates/categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getCategories", null);
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
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "removeTemplate", null);
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
    (0, common_1.Get)('my-posters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosterGeneratorController.prototype, "getMyPosters", null);
exports.PosterGeneratorController = PosterGeneratorController = __decorate([
    (0, common_1.Controller)('poster-generator'),
    (0, common_1.UseGuards)(feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.POSTER_GENERATOR),
    __metadata("design:paramtypes", [poster_generator_service_1.PosterGeneratorService])
], PosterGeneratorController);
//# sourceMappingURL=poster-generator.controller.js.map
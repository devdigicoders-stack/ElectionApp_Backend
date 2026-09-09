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
exports.GalleryController = exports.galleryUploadOptions = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const gallery_service_1 = require("./gallery.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
exports.galleryUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, _file, cb) => {
            const tenantSlug = req.tenant?.slug || 'general';
            const dir = (0, path_1.join)(process.cwd(), 'uploads', tenantSlug, 'gallery');
            if (!(0, fs_1.existsSync)(dir))
                (0, fs_1.mkdirSync)(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (_req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
            cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowedExts = /jpeg|jpg|png|gif|webp|svg|mp4|webm|mov|m4v/;
        const ext = (0, path_1.extname)(file.originalname).toLowerCase().replace('.', '');
        const isAllowedExt = allowedExts.test(ext);
        const isAllowedMime = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
        if (isAllowedExt || isAllowedMime) {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException(`Unsupported file type: ${ext || file.mimetype}. Allowed: images and videos`), false);
        }
    },
};
function parseGalleryBody(body, files, tenantSlug) {
    const data = { ...(body || {}) };
    const uploadedMedia = files?.file?.[0] || files?.image?.[0];
    const uploadedThumbnail = files?.thumbnail?.[0];
    if (uploadedMedia) {
        data.url = `/uploads/${tenantSlug}/gallery/${uploadedMedia.filename}`;
        if (!data.type) {
            data.type = uploadedMedia.mimetype.startsWith('video/')
                ? types_1.GalleryType.VIDEO
                : types_1.GalleryType.PHOTO;
        }
    }
    if (uploadedThumbnail) {
        data.thumbnailUrl = `/uploads/${tenantSlug}/gallery/${uploadedThumbnail.filename}`;
    }
    if (typeof data.tags === 'string') {
        const trimmed = data.tags.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                data.tags = JSON.parse(trimmed);
            }
            catch {
                data.tags = trimmed.slice(1, -1).split(',').map((t) => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
            }
        }
        else {
            data.tags = trimmed.split(',').map((t) => t.trim()).filter(Boolean);
        }
    }
    if (typeof data.isPublished === 'string') {
        data.isPublished = data.isPublished.toLowerCase() === 'true' || data.isPublished === '1';
    }
    if (typeof data.allowDownload === 'string') {
        data.allowDownload = data.allowDownload.toLowerCase() === 'true' || data.allowDownload === '1';
    }
    if (typeof data.sortOrder === 'string') {
        const parsedOrder = parseInt(data.sortOrder, 10);
        data.sortOrder = isNaN(parsedOrder) ? 0 : parsedOrder;
    }
    if (!data.areaId || data.areaId === 'null' || data.areaId === 'undefined' || data.areaId === '') {
        data.areaId = null;
    }
    return data;
}
let GalleryController = class GalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async create(req, files, body) {
        const tenantSlug = req.tenant?.slug || 'general';
        const payload = parseGalleryBody(body, files, tenantSlug);
        if (!payload.url) {
            throw new common_1.BadRequestException('Either an image/video file must be uploaded or a valid url must be provided in body.');
        }
        if (!payload.type) {
            payload.type = types_1.GalleryType.PHOTO;
        }
        return this.galleryService.create(req.tenant, payload);
    }
    findAll(req, type, category, tag, search, all, page, limit) {
        return this.galleryService.findAll(req.tenant, {
            type,
            category,
            tag,
            search,
            all: all === 'true',
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
        });
    }
    findOne(req, id) {
        return this.galleryService.findOne(req.tenant, id);
    }
    async update(req, id, files, body) {
        const tenantSlug = req.tenant?.slug || 'general';
        const payload = parseGalleryBody(body, files, tenantSlug);
        return this.galleryService.update(req.tenant, id, payload);
    }
    remove(req, id) {
        return this.galleryService.remove(req.tenant, id);
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ], exports.galleryUploadOptions)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('tag')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('all')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ], exports.galleryUploadOptions)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GalleryController.prototype, "remove", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.Controller)('gallery'),
    (0, common_1.UseGuards)(feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.GALLERY),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map
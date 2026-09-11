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
exports.BannersController = exports.bannerUploadOptions = void 0;
exports.parseBannerBody = parseBannerBody;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const banners_service_1 = require("./banners.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
exports.bannerUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, _file, cb) => {
            const tenantSlug = req.tenant?.slug || 'general';
            const dir = (0, path_1.join)(process.cwd(), 'uploads', tenantSlug, 'banners');
            if (!(0, fs_1.existsSync)(dir))
                (0, fs_1.mkdirSync)(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (_req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
            cb(null, `banner-${unique}${(0, path_1.extname)(file.originalname)}`);
        },
    }),
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg|bmp/i;
        const ext = (0, path_1.extname)(file.originalname).toLowerCase().replace('.', '');
        const isAllowedExt = allowed.test(ext);
        const isAllowedMime = file.mimetype.startsWith('image/');
        if (isAllowedExt || isAllowedMime) {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException(`Unsupported file type for banner: ${ext || file.mimetype}. Allowed formats: JPG, PNG, GIF, WEBP, SVG`), false);
        }
    },
};
function parseBannerBody(body, files, tenantSlug) {
    const data = { ...(body || {}) };
    const uploadedImage = files?.image?.[0] ||
        files?.file?.[0] ||
        files?.banner?.[0] ||
        files?.bannerImage?.[0];
    const uploadedMobile = files?.mobileImage?.[0];
    if (uploadedImage) {
        data.imageUrl = `/uploads/${tenantSlug}/banners/${uploadedImage.filename}`;
    }
    if (uploadedMobile) {
        data.mobileImageUrl = `/uploads/${tenantSlug}/banners/${uploadedMobile.filename}`;
    }
    if (typeof data.isActive === 'string') {
        data.isActive = data.isActive.toLowerCase() === 'true' || data.isActive === '1';
    }
    else if (data.isActive === undefined && uploadedImage) {
        data.isActive = true;
    }
    if (typeof data.sortOrder === 'string') {
        const parsed = parseInt(data.sortOrder, 10);
        data.sortOrder = isNaN(parsed) ? 0 : parsed;
    }
    if (typeof data.title === 'string') {
        data.title = data.title.trim();
    }
    if (data.linkUrl && typeof data.linkUrl === 'string') {
        data.linkUrl = data.linkUrl.trim();
        if (data.linkUrl === 'null' || data.linkUrl === 'undefined' || data.linkUrl === '') {
            data.linkUrl = null;
        }
    }
    if (data.category && typeof data.category === 'string') {
        data.category = data.category.trim().toLowerCase();
    }
    return data;
}
let BannersController = class BannersController {
    constructor(bannersService) {
        this.bannersService = bannersService;
    }
    create(req, body, files) {
        const tenantSlug = req.tenant?.slug || 'general';
        const parsedData = parseBannerBody(body, files, tenantSlug);
        return this.bannersService.create(req.tenant, parsedData, req);
    }
    findActive(req) {
        return this.bannersService.findActive(req.tenant, req);
    }
    findAll(req) {
        return this.bannersService.findAll(req.tenant, req);
    }
    findOne(req, id) {
        return this.bannersService.findOne(req.tenant, id, req);
    }
    reorder(req, body) {
        return this.bannersService.reorder(req.tenant, body.orders);
    }
    update(req, id, body, files) {
        const tenantSlug = req.tenant?.slug || 'general';
        const parsedData = parseBannerBody(body, files, tenantSlug);
        return this.bannersService.update(req.tenant, id, parsedData, req);
    }
    remove(req, id) {
        return this.bannersService.remove(req.tenant, id);
    }
};
exports.BannersController = BannersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
        { name: 'mobileImage', maxCount: 1 },
    ], exports.bannerUploadOptions)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
        { name: 'mobileImage', maxCount: 1 },
    ], exports.bannerUploadOptions)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BannersController.prototype, "remove", null);
exports.BannersController = BannersController = __decorate([
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banners_service_1.BannersService])
], BannersController);
//# sourceMappingURL=banners.controller.js.map
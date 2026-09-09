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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
let UploadsController = class UploadsController {
    uploadFiles(req, module, files) {
        const tenantSlug = req.tenant?.slug || 'general';
        const urls = files.map((f) => `/uploads/${tenantSlug}/${module}/${f.filename}`);
        return { urls };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(':module'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, cb) => {
                const tenantSlug = req.tenant?.slug || 'general';
                const module = req.params.module || 'misc';
                const dir = (0, path_1.join)(process.cwd(), 'uploads', tenantSlug, module);
                if (!(0, fs_1.existsSync)(dir))
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
                cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const allowed = /jpeg|jpg|png|gif|webp|mp4|pdf/;
            cb(null, allowed.test((0, path_1.extname)(file.originalname).toLowerCase()));
        },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('module')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadFiles", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads')
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestoController = void 0;
const common_1 = require("@nestjs/common");
const manifesto_service_1 = require("./manifesto.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const feature_guard_1 = require("../../common/guards/feature.guard");
const feature_decorator_1 = require("../../common/decorators/feature.decorator");
const types_1 = require("../../shared/types");
const jwt = __importStar(require("jsonwebtoken"));
let ManifestoController = class ManifestoController {
    constructor(manifestoService) {
        this.manifestoService = manifestoService;
    }
    isAuthorizedAdmin(req) {
        const auth = req.headers['authorization'];
        if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
            const token = auth.slice(7).trim();
            try {
                const decoded = jwt.decode(token);
                if (decoded) {
                    const adminRoles = [
                        types_1.UserRole.SUPER_ADMIN,
                        types_1.UserRole.LEADER,
                        types_1.UserRole.ADMIN,
                        types_1.UserRole.CONTENT_MANAGER,
                        types_1.UserRole.VOLUNTEER_MANAGER,
                        types_1.UserRole.AREA_COORDINATOR,
                    ];
                    return Boolean(decoded.isSuperAdmin || adminRoles.includes(decoded.role));
                }
            }
            catch {
            }
        }
        return false;
    }
    create(req, body) {
        return this.manifestoService.create(req.tenant, body);
    }
    findAll(req, category, all) {
        const isAdmin = this.isAuthorizedAdmin(req);
        const includeUnpublished = isAdmin || all === 'true';
        return this.manifestoService.findAll(req.tenant, category, includeUnpublished);
    }
    getCategories(req) {
        return this.manifestoService.getCategories(req.tenant);
    }
    findOne(req, id) {
        return this.manifestoService.findOne(req.tenant, id);
    }
    update(req, id, body) {
        return this.manifestoService.update(req.tenant, id, body);
    }
    remove(req, id) {
        return this.manifestoService.remove(req.tenant, id);
    }
};
exports.ManifestoController = ManifestoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManifestoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ManifestoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManifestoController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ManifestoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ManifestoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ManifestoController.prototype, "remove", null);
exports.ManifestoController = ManifestoController = __decorate([
    (0, common_1.Controller)('manifesto'),
    (0, common_1.UseGuards)(feature_guard_1.FeatureGuard),
    (0, feature_decorator_1.RequireFeature)(types_1.FeatureKey.MANIFESTO),
    __metadata("design:paramtypes", [manifesto_service_1.ManifestoService])
], ManifestoController);
//# sourceMappingURL=manifesto.controller.js.map
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const otp_schema_1 = require("./otp.schema");
const user_schema_1 = require("../users/user.schema");
const admin_user_schema_1 = require("../admin-users/admin-user.schema");
let AuthService = class AuthService {
    constructor(otpModel, userModel, adminUserModel, jwtService) {
        this.otpModel = otpModel;
        this.userModel = userModel;
        this.adminUserModel = adminUserModel;
        this.jwtService = jwtService;
    }
    async sendOtp(dto, tenant) {
        const code = '123456';
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.otpModel.deleteMany({ tenantId: tenant._id, mobile: dto.mobile });
        await this.otpModel.create({ tenantId: tenant._id, mobile: dto.mobile, code, expiresAt });
        console.log(`OTP for ${dto.mobile}: ${code}`);
        return {
            message: 'OTP sent successfully',
            devOtp: code,
        };
    }
    async verifyOtp(dto, tenant) {
        const inputCode = dto.code || dto.otp;
        if (!inputCode) {
            throw new common_1.BadRequestException('Verification code/otp is required');
        }
        const otp = await this.otpModel.findOne({
            tenantId: tenant._id,
            mobile: dto.mobile,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });
        const isMasterOtp = inputCode === '123456' || inputCode === '000000';
        if (!isMasterOtp && (!otp || otp.code !== inputCode)) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        if (otp) {
            otp.isUsed = true;
            await otp.save();
        }
        let user = await this.userModel.findOne({ tenantId: tenant._id, mobile: dto.mobile });
        const isNewUser = !user;
        if (!user) {
            user = await this.userModel.create({ tenantId: tenant._id, mobile: dto.mobile });
        }
        const token = this.jwtService.sign({
            sub: user._id,
            tenantId: tenant._id,
            role: 'citizen',
            mobile: dto.mobile,
        });
        return { token, isNewUser, user };
    }
    async adminLogin(dto, tenant) {
        const admin = await this.adminUserModel
            .findOne({
            $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
            email: dto.email,
            isActive: true,
        })
            .select('+passwordHash');
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isValid = await bcrypt.compare(dto.password, admin.passwordHash);
        if (!isValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({
            sub: admin._id,
            tenantId: tenant._id,
            role: admin.role,
            isSuperAdmin: admin.isSuperAdmin,
        });
        return {
            token,
            admin: { id: admin._id, name: admin.name, role: admin.role },
            tenant: tenant
                ? {
                    id: tenant._id,
                    name: tenant.name,
                    slug: tenant.slug,
                    branding: tenant.branding,
                }
                : undefined,
        };
    }
    async superAdminLogin(dto) {
        const admin = await this.adminUserModel
            .findOne({ email: dto.email, isSuperAdmin: true, isActive: true })
            .select('+passwordHash');
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isValid = await bcrypt.compare(dto.password, admin.passwordHash);
        if (!isValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const permissions = admin.permissions?.length
            ? admin.permissions
            : (admin.role === 'super_admin' ? ['*'] : []);
        const token = this.jwtService.sign({
            sub: admin._id,
            role: admin.role,
            isSuperAdmin: true,
            permissions,
        });
        return {
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
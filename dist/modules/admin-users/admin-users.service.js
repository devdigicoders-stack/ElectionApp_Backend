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
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const admin_user_schema_1 = require("./admin-user.schema");
let AdminUsersService = class AdminUsersService {
    constructor(adminUserModel) {
        this.adminUserModel = adminUserModel;
    }
    async create(tenant, data) {
        const exists = await this.adminUserModel.findOne({ tenantId: tenant._id, email: data.email });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        const passwordHash = await bcrypt.hash(data.password, 10);
        const { password, ...rest } = data;
        return this.adminUserModel.create({ tenantId: tenant._id, ...rest, passwordHash });
    }
    async findAll(tenant) {
        return this.adminUserModel
            .find({ tenantId: tenant._id })
            .populate('assignedAreaId', 'name')
            .select('-passwordHash')
            .sort({ createdAt: -1 });
    }
    async findOne(tenant, id) {
        const admin = await this.adminUserModel
            .findOne({ _id: id, tenantId: tenant._id })
            .populate('assignedAreaId', 'name')
            .select('-passwordHash');
        if (!admin)
            throw new common_1.NotFoundException('Admin user not found');
        return admin;
    }
    async update(tenant, id, data) {
        if (data.password) {
            data.passwordHash = await bcrypt.hash(data.password, 10);
            delete data.password;
        }
        const admin = await this.adminUserModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true }).select('-passwordHash');
        if (!admin)
            throw new common_1.NotFoundException('Admin user not found');
        return admin;
    }
    async remove(tenant, id) {
        return this.adminUserModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
    async createStaff(dto) {
        const email = dto.email.toLowerCase().trim();
        const exists = await this.adminUserModel.findOne({ email });
        if (exists)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const { DEFAULT_PLATFORM_PERMISSIONS } = await Promise.resolve().then(() => __importStar(require('./super-admin-staff.dto')));
        const permissions = dto.permissions?.length
            ? dto.permissions
            : (DEFAULT_PLATFORM_PERMISSIONS[dto.role] || ['*']);
        const staff = await this.adminUserModel.create({
            name: dto.name.trim(),
            email,
            passwordHash,
            role: dto.role,
            phone: dto.phone || undefined,
            permissions,
            isSuperAdmin: true,
            isActive: true,
            tenantId: undefined,
        });
        const result = staff.toObject ? staff.toObject() : { ...staff };
        delete result.passwordHash;
        return result;
    }
    async findAllStaff(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const filter = { isSuperAdmin: true };
        if (query.role) {
            filter.role = query.role;
        }
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === 'true' || query.isActive === true;
        }
        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
                { phone: { $regex: query.search, $options: 'i' } },
            ];
        }
        const [total, items] = await Promise.all([
            this.adminUserModel.countDocuments(filter),
            this.adminUserModel
                .find(filter)
                .select('-passwordHash')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneStaff(id) {
        const staff = await this.adminUserModel
            .findOne({ _id: id, isSuperAdmin: true })
            .select('-passwordHash')
            .lean();
        if (!staff)
            throw new common_1.NotFoundException('Platform staff member not found');
        return staff;
    }
    async updateStaff(id, dto) {
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name.trim();
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.role !== undefined)
            updateData.role = dto.role;
        if (dto.permissions !== undefined)
            updateData.permissions = dto.permissions;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        const updated = await this.adminUserModel
            .findOneAndUpdate({ _id: id, isSuperAdmin: true }, { $set: updateData }, { new: true })
            .select('-passwordHash')
            .lean();
        if (!updated)
            throw new common_1.NotFoundException('Platform staff member not found');
        return updated;
    }
    async toggleStaffStatus(id, requesterId) {
        const staff = await this.adminUserModel.findOne({ _id: id, isSuperAdmin: true });
        if (!staff)
            throw new common_1.NotFoundException('Platform staff member not found');
        if (requesterId && staff._id.toString() === requesterId) {
            throw new common_1.ConflictException('You cannot deactivate your own account');
        }
        staff.isActive = !staff.isActive;
        await staff.save();
        const result = staff.toObject();
        delete result.passwordHash;
        return result;
    }
    async resetStaffPassword(id, newPassword) {
        const staff = await this.adminUserModel.findOne({ _id: id, isSuperAdmin: true });
        if (!staff)
            throw new common_1.NotFoundException('Platform staff member not found');
        staff.passwordHash = await bcrypt.hash(newPassword, 10);
        await staff.save();
        return { message: `Password for ${staff.email} has been reset successfully` };
    }
    async removeStaff(id, requesterId) {
        const staff = await this.adminUserModel.findOne({ _id: id, isSuperAdmin: true });
        if (!staff)
            throw new common_1.NotFoundException('Platform staff member not found');
        if (requesterId && staff._id.toString() === requesterId) {
            throw new common_1.ConflictException('You cannot delete your own account');
        }
        if (staff.role === 'super_admin') {
            const superAdminCount = await this.adminUserModel.countDocuments({
                isSuperAdmin: true,
                role: 'super_admin',
                isActive: true,
            });
            if (superAdminCount <= 1) {
                throw new common_1.ConflictException('Cannot delete the last active Super Admin account');
            }
        }
        await this.adminUserModel.findByIdAndDelete(id);
        return { message: `Staff member ${staff.email} deleted successfully` };
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_user_schema_1.AdminUser.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map
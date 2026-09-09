import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { OtpDocument } from './otp.schema';
import { User, UserDocument } from '../users/user.schema';
import { AdminUserDocument } from '../admin-users/admin-user.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { SendOtpDto, VerifyOtpDto, AdminLoginDto } from './auth.dto';
export declare class AuthService {
    private otpModel;
    private userModel;
    private adminUserModel;
    private jwtService;
    constructor(otpModel: Model<OtpDocument>, userModel: Model<UserDocument>, adminUserModel: Model<AdminUserDocument>, jwtService: JwtService);
    sendOtp(dto: SendOtpDto, tenant: TenantDocument): Promise<{
        message: string;
        devOtp: string;
    }>;
    verifyOtp(dto: VerifyOtpDto, tenant: TenantDocument): Promise<{
        token: string;
        isNewUser: boolean;
        user: import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    adminLogin(dto: AdminLoginDto, tenant: TenantDocument): Promise<{
        token: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            role: string;
        };
    }>;
    superAdminLogin(dto: AdminLoginDto): Promise<{
        token: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: string;
            permissions: string[];
        };
    }>;
}

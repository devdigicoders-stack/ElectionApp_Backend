import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, AdminLoginDto } from './auth.dto';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto, req: TenantRequest): Promise<{
        message: string;
        devOtp: string;
    }>;
    verifyOtp(dto: VerifyOtpDto, req: TenantRequest): Promise<{
        token: string;
        isNewUser: boolean;
        user: import("mongoose").Document<unknown, {}, import("../users/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    adminLogin(dto: AdminLoginDto, req: TenantRequest): Promise<{
        token: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            role: string;
        };
        tenant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            slug: string;
            branding: {
                platformName?: string;
                title?: string;
                logoUrl?: string;
                logo?: string;
                faviconUrl?: string;
                pwaIconUrl?: string;
                leaderPhotoUrl?: string;
                loginBgUrl?: string;
                splashScreenUrl?: string;
                splashScreens?: Array<{
                    title?: string;
                    subtitle?: string;
                    mediaType?: "image" | "video";
                    mediaUrl: string;
                    order?: number;
                }>;
                primaryColor?: string;
                secondaryColor?: string;
                accentColor?: string;
                leaderName?: string;
                tagline?: string;
                footerText?: string;
                privacyPolicyUrl?: string;
                termsUrl?: string;
                privacyPolicyContent?: string;
                termsContent?: string;
                socialLinks?: Record<string, string>;
            };
        } | undefined;
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

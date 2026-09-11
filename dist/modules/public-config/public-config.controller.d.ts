import { PublicConfigService } from './public-config.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class PublicConfigController {
    private publicConfigService;
    constructor(publicConfigService: PublicConfigService);
    getConfig(req: TenantRequest): Promise<{
        tenant: {
            id: import("mongoose").Types.ObjectId;
            slug: string;
            name: string;
            title: string;
            status: import("../../shared/types").TenantStatus;
        };
        branding: {
            title: string | null;
            platformName: string | null;
            logo: string | null;
            logoUrl: string | null;
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
        registrationFields: any[];
        enabledFeatures: {
            key: import("../../shared/types").FeatureKey;
            config: Record<string, any>;
        }[];
        areaLevels: (import("mongoose").Document<unknown, {}, import("../areas/area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../areas/area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}

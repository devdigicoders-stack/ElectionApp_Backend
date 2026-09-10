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
            status: import("../../shared/types").TenantStatus;
        };
        branding: {
            platformName?: string;
            logoUrl?: string;
            faviconUrl?: string;
            pwaIconUrl?: string;
            leaderPhotoUrl?: string;
            loginBgUrl?: string;
            splashScreenUrl?: string;
            primaryColor?: string;
            secondaryColor?: string;
            leaderName?: string;
            tagline?: string;
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

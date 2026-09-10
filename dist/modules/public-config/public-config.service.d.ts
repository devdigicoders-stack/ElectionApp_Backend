import { Model } from 'mongoose';
import { TenantDocument } from '../tenants/tenant.schema';
import { TenantFeatureDocument } from '../features/tenant-feature.schema';
import { AreaLevel, AreaLevelDocument } from '../areas/area.schema';
export declare class PublicConfigService {
    private featureModel;
    private areaLevelModel;
    constructor(featureModel: Model<TenantFeatureDocument>, areaLevelModel: Model<AreaLevelDocument>);
    getConfig(tenant: TenantDocument): Promise<{
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
        areaLevels: (import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}

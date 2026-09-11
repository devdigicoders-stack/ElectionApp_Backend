import { RegistrationFormService } from './registration-form.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { BulkUpdateRegistrationFieldsDto, CreateRegistrationFieldDto, UpdateRegistrationFieldDto, CompleteCitizenProfileDto } from './registration-form.dto';
export declare class RegistrationFormController {
    private registrationFormService;
    constructor(registrationFormService: RegistrationFormService);
    getPublicForm(req: TenantRequest): Promise<{
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
        };
        fields: import("./registration-form.types").IRegistrationField[];
        areaLevels: (import("mongoose").Document<unknown, {}, import("../areas/area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../areas/area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        totalFields: number;
    }>;
    getAdminForm(req: TenantRequest): Promise<{
        fields: import("./registration-form.types").IRegistrationField[];
        supportedFieldTypes: import("./registration-form.types").RegistrationFieldType[];
        stats: {
            totalFields: number;
            activeFieldsCount: number;
            customFieldsCount: number;
        };
    }>;
    bulkUpdateFields(req: TenantRequest, dto: BulkUpdateRegistrationFieldsDto): Promise<{
        message: string;
        fields: import("./registration-form.types").IRegistrationField[];
    }>;
    addField(req: TenantRequest, dto: CreateRegistrationFieldDto): Promise<{
        message: string;
        field: import("./registration-form.types").IRegistrationField;
        totalFields: number;
    }>;
    updateField(req: TenantRequest, key: string, dto: UpdateRegistrationFieldDto): Promise<{
        message: string;
        field: import("./registration-form.types").IRegistrationField;
    }>;
    deleteField(req: TenantRequest, key: string): Promise<{
        message: string;
        remainingFieldsCount: number;
    }>;
    resetToDefault(req: TenantRequest): Promise<{
        message: string;
        fields: import("./registration-form.types").IRegistrationField[];
    }>;
    completeProfile(req: TenantRequest & {
        user: any;
    }, body: CompleteCitizenProfileDto & Record<string, any>): Promise<{
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string | undefined;
            mobile: string;
            gender: string | undefined;
            dob: Date | undefined;
            areaId: import("mongoose").Types.ObjectId | undefined;
            customFields: Record<string, any>;
            isProfileComplete: boolean;
        };
    }>;
}

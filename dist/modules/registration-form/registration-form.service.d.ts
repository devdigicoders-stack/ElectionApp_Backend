import { Model, Types } from 'mongoose';
import { TenantDocument } from '../tenants/tenant.schema';
import { UserDocument } from '../users/user.schema';
import { AreaLevel, AreaLevelDocument } from '../areas/area.schema';
import { IRegistrationField, RegistrationFieldType } from './registration-form.types';
import { BulkUpdateRegistrationFieldsDto, CreateRegistrationFieldDto, UpdateRegistrationFieldDto } from './registration-form.dto';
export declare class RegistrationFormService {
    private tenantModel;
    private userModel;
    private areaLevelModel;
    constructor(tenantModel: Model<TenantDocument>, userModel: Model<UserDocument>, areaLevelModel: Model<AreaLevelDocument>);
    private getTenantFields;
    getPublicForm(tenant: TenantDocument): Promise<{
        tenant: {
            id: Types.ObjectId;
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
                primaryColor?: string;
                secondaryColor?: string;
                leaderName?: string;
                tagline?: string;
            };
        };
        fields: IRegistrationField[];
        areaLevels: (import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        totalFields: number;
    }>;
    getAdminForm(tenant: TenantDocument): Promise<{
        fields: IRegistrationField[];
        supportedFieldTypes: RegistrationFieldType[];
        stats: {
            totalFields: number;
            activeFieldsCount: number;
            customFieldsCount: number;
        };
    }>;
    bulkUpdateFields(tenant: TenantDocument, dto: BulkUpdateRegistrationFieldsDto): Promise<{
        message: string;
        fields: IRegistrationField[];
    }>;
    addField(tenant: TenantDocument, dto: CreateRegistrationFieldDto): Promise<{
        message: string;
        field: IRegistrationField;
        totalFields: number;
    }>;
    updateField(tenant: TenantDocument, key: string, dto: UpdateRegistrationFieldDto): Promise<{
        message: string;
        field: IRegistrationField;
    }>;
    deleteField(tenant: TenantDocument, key: string): Promise<{
        message: string;
        remainingFieldsCount: number;
    }>;
    resetToDefault(tenant: TenantDocument): Promise<{
        message: string;
        fields: IRegistrationField[];
    }>;
    completeCitizenProfile(tenant: TenantDocument, userId: string, submissionData: any): Promise<{
        message: string;
        user: {
            id: Types.ObjectId;
            name: string | undefined;
            mobile: string;
            gender: string | undefined;
            dob: Date | undefined;
            areaId: Types.ObjectId | undefined;
            customFields: Record<string, any>;
            isProfileComplete: boolean;
        };
    }>;
}

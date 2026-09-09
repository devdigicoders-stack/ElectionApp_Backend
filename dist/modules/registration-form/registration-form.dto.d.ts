import { RegistrationFieldType } from './registration-form.types';
export declare class CreateRegistrationFieldDto {
    key: string;
    label: string;
    type: RegistrationFieldType;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    helpText?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class UpdateRegistrationFieldDto {
    label?: string;
    type?: RegistrationFieldType;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    helpText?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class BulkUpdateRegistrationFieldsDto {
    fields: CreateRegistrationFieldDto[];
}
export declare class CompleteCitizenProfileDto {
    name?: string;
    gender?: string;
    dob?: string;
    areaId?: string;
    customFields?: Record<string, any>;
}

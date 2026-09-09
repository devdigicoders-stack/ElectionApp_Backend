export declare enum RegistrationFieldType {
    TEXT = "text",
    TEXTAREA = "textarea",
    NUMBER = "number",
    PHONE = "phone",
    EMAIL = "email",
    DATE = "date",
    SELECT = "select",
    MULTISELECT = "multiselect",
    RADIO = "radio",
    CHECKBOX = "checkbox",
    PHOTO = "photo",
    AREA_SELECTOR = "area_selector"
}
export interface IRegistrationField {
    key: string;
    label: string;
    type: RegistrationFieldType | string;
    required: boolean;
    options?: string[];
    placeholder?: string;
    helpText?: string;
    sortOrder: number;
    isActive: boolean;
    isSystem?: boolean;
}
export declare const DEFAULT_REGISTRATION_FIELDS: IRegistrationField[];

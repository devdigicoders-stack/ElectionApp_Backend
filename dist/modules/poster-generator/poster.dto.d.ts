export declare class TemplatePositionDto {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class TemplateStyleDto {
    fontSize?: number;
    fontColor?: string;
    fontWeight?: string;
    textAlign?: string;
    maskShape?: 'circle' | 'rectangle' | 'rounded';
}
export declare class TemplateFieldDto {
    key: string;
    label: string;
    type: 'photo' | 'text';
    editable: boolean;
    required: boolean;
    defaultValue?: string;
    position?: TemplatePositionDto;
    style?: TemplateStyleDto;
}
export declare class CreatePosterTemplateDto {
    title: string;
    category: string;
    description?: string;
    templateImageUrl?: string;
    thumbnailUrl?: string;
    width?: number;
    height?: number;
    dimensionPreset?: string;
    fields?: TemplateFieldDto[];
    includeTenantBranding?: boolean;
    expiresAt?: string;
    tags?: string[];
    isActive?: boolean;
    sortOrder?: number;
}
export declare class UpdatePosterTemplateDto {
    title?: string;
    category?: string;
    description?: string;
    templateImageUrl?: string;
    thumbnailUrl?: string;
    width?: number;
    height?: number;
    dimensionPreset?: string;
    fields?: TemplateFieldDto[];
    includeTenantBranding?: boolean;
    expiresAt?: string;
    tags?: string[];
    isActive?: boolean;
    sortOrder?: number;
}
export declare class GeneratePosterDto {
    fieldValues?: Record<string, string> | string;
    photoUrl?: string;
    removeBg?: boolean;
    format?: 'png' | 'jpg' | 'jpeg';
    includeBranding?: boolean;
}
export declare class QueryPosterTemplatesDto {
    category?: string;
    preset?: string;
    search?: string;
    includeExpired?: boolean;
}

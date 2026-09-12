export interface BackgroundRemovalResult {
    success: boolean;
    cutoutPath: string;
    cutoutUrl: string;
    provider: 'local-canvas' | 'remove-bg' | 'external-api';
    width: number;
    height: number;
}
export interface IBackgroundRemovalProvider {
    name: 'local-canvas' | 'remove-bg' | 'external-api';
    isAvailable(): boolean;
    removeBackground(inputPath: string, outputPath: string): Promise<{
        success: boolean;
        width: number;
        height: number;
    }>;
}
export declare class BackgroundRemovalService {
    private readonly logger;
    private localProvider;
    removeBackground(tenantSlug: string, inputPhotoPath: string): Promise<BackgroundRemovalResult>;
}

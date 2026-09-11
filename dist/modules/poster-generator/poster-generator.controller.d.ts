import { Response } from 'express';
import { PosterGeneratorService } from './poster-generator.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { QueryPosterTemplatesDto } from './poster.dto';
export declare class PosterGeneratorController {
    private posterService;
    constructor(posterService: PosterGeneratorService);
    createTemplate(req: TenantRequest, body: any, file?: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAdminTemplates(req: TenantRequest, query: QueryPosterTemplatesDto): Promise<(import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getCategories(req: TenantRequest): Promise<string[]>;
    getTemplates(req: TenantRequest, query: QueryPosterTemplatesDto): Promise<(import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTemplate(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTemplate(req: TenantRequest, id: string, body: any, file?: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeTemplate(req: TenantRequest, id: string): Promise<{
        message: string;
    }>;
    removeBackground(req: TenantRequest, photo?: Express.Multer.File, photoUrl?: string): Promise<{
        message: string;
        originalUrl: string;
        cutoutUrl: string;
        provider: "remove-bg" | "local-canvas" | "external-api";
        dimensions: {
            width: number;
            height: number;
        };
    }>;
    generatePoster(req: TenantRequest & {
        user: any;
    }, templateId: string, body: any, photo?: Express.Multer.File): Promise<{
        recordId: import("mongoose").Types.ObjectId;
        outputUrl: string;
        downloadUrl: string;
        format: string;
        dimensions: {
            width: any;
            height: any;
            preset: string;
        };
        template: {
            id: import("mongoose").Types.ObjectId;
            title: string;
            category: string;
        };
        shareData: {
            title: string;
            text: string;
            bannerUrl: string;
            whatsappUrl: string;
            downloadUrl: string;
        };
    }>;
    downloadPoster(req: TenantRequest, id: string, res: Response): Promise<void>;
    getMyPosters(req: TenantRequest & {
        user: any;
    }): Promise<(import("./generated-poster.schema").GeneratedPoster & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getShareMetadata(req: TenantRequest, id: string): Promise<{
        id: string;
        bannerUrl: string;
        downloadUrl: string;
        shareData: {
            title: string;
            text: string;
            bannerUrl: string;
            downloadUrl: string;
            whatsappUrl: string;
        };
    }>;
    adminGetAllPosters(req: TenantRequest, query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: (import("./generated-poster.schema").GeneratedPoster & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        summary: {
            totalGenerated: number;
            totalTemplates: number;
        };
    }>;
    adminDeletePoster(req: TenantRequest, id: string): Promise<{
        message: string;
    }>;
}

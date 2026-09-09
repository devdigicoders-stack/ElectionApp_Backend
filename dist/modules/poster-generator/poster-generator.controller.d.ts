import { PosterGeneratorService } from './poster-generator.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class PosterGeneratorController {
    private posterService;
    constructor(posterService: PosterGeneratorService);
    createTemplate(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTemplates(req: TenantRequest, category?: string): Promise<(import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getCategories(req: TenantRequest): Promise<string[]>;
    getTemplate(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTemplate(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeTemplate(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./poster-template.schema").PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./poster-template.schema").PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    generatePoster(req: TenantRequest & {
        user: any;
    }, templateId: string, body: {
        fieldValues: string;
    }, photo?: Express.Multer.File): Promise<{
        outputUrl: string;
        recordId: any;
    }>;
    getMyPosters(req: TenantRequest & {
        user: any;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./generated-poster.schema").GeneratedPosterDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./generated-poster.schema").GeneratedPoster & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

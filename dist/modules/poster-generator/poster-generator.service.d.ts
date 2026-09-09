import { Model } from 'mongoose';
import { PosterTemplate, PosterTemplateDocument } from './poster-template.schema';
import { GeneratedPoster, GeneratedPosterDocument } from './generated-poster.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class PosterGeneratorService {
    private templateModel;
    private generatedModel;
    constructor(templateModel: Model<PosterTemplateDocument>, generatedModel: Model<GeneratedPosterDocument>);
    createTemplate(tenant: TenantDocument, data: any): Promise<import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTemplates(tenant: TenantDocument, category?: string): Promise<(import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getTemplateCategories(tenant: TenantDocument): Promise<string[]>;
    getTemplate(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTemplate(tenant: TenantDocument, id: string, data: any): Promise<import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeTemplate(tenant: TenantDocument, id: string): Promise<(import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    generatePoster(tenant: TenantDocument, templateId: string, fieldValues: Record<string, string>, userPhotoPath: string | null, userId?: string): Promise<{
        outputUrl: string;
        recordId: any;
    }>;
    getMyPosters(tenant: TenantDocument, userId: string): Promise<(import("mongoose").Document<unknown, {}, GeneratedPosterDocument, {}, import("mongoose").DefaultSchemaOptions> & GeneratedPoster & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

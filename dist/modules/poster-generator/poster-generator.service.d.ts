import { Model, Types } from 'mongoose';
import { PosterTemplate, PosterTemplateDocument } from './poster-template.schema';
import { GeneratedPoster, GeneratedPosterDocument } from './generated-poster.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { UserDocument } from '../users/user.schema';
import { BackgroundRemovalService } from './background-removal.service';
import { CreatePosterTemplateDto, UpdatePosterTemplateDto, QueryPosterTemplatesDto, GeneratePosterDto } from './poster.dto';
export declare class PosterGeneratorService {
    private templateModel;
    private generatedModel;
    private userModel;
    private readonly bgRemovalService;
    private readonly logger;
    private readonly seedingLocks;
    constructor(templateModel: Model<PosterTemplateDocument>, generatedModel: Model<GeneratedPosterDocument>, userModel: Model<UserDocument>, bgRemovalService: BackgroundRemovalService);
    private drawRoundedRect;
    private createBaseTemplateImage;
    seedDefaultTemplatesIfEmpty(tenant: TenantDocument): Promise<void>;
    createTemplate(tenant: TenantDocument, dto: CreatePosterTemplateDto, uploadedFile?: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTemplates(tenant: TenantDocument, query: QueryPosterTemplatesDto, isAdmin?: boolean): Promise<(PosterTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTemplateCategories(tenant: TenantDocument): Promise<string[]>;
    getTemplate(tenant: TenantDocument, id: string): Promise<import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTemplate(tenant: TenantDocument, id: string, dto: UpdatePosterTemplateDto, uploadedFile?: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, PosterTemplateDocument, {}, import("mongoose").DefaultSchemaOptions> & PosterTemplate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    removeTemplate(tenant: TenantDocument, id: string): Promise<{
        message: string;
    }>;
    removeBackground(tenant: TenantDocument, photoPath: string): Promise<import("./background-removal.service").BackgroundRemovalResult>;
    generatePoster(tenant: TenantDocument, templateId: string, fieldValues: Record<string, string>, userPhotoPath: string | null, dto?: GeneratePosterDto, userId?: string): Promise<{
        recordId: Types.ObjectId;
        outputUrl: string;
        downloadUrl: string;
        format: string;
        dimensions: {
            width: any;
            height: any;
            preset: string;
        };
        template: {
            id: Types.ObjectId;
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
    getPosterFilePath(tenant: TenantDocument, id: string): Promise<{
        filePath: string;
        filename: string;
    }>;
    getMyPosters(tenant: TenantDocument, userId: string): Promise<(GeneratedPoster & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminGetAllPosters(tenant: TenantDocument, query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: (GeneratedPoster & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    adminDeletePoster(tenant: TenantDocument, id: string): Promise<{
        message: string;
    }>;
}

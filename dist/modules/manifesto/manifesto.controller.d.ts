import { ManifestoService } from './manifesto.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class ManifestoController {
    private manifestoService;
    constructor(manifestoService: ManifestoService);
    create(req: TenantRequest, body: any): Promise<import("mongoose").Document<unknown, {}, import("./manifesto.schema").ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./manifesto.schema").Manifesto & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: TenantRequest, category?: string): Promise<(import("mongoose").Document<unknown, {}, import("./manifesto.schema").ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./manifesto.schema").Manifesto & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getCategories(req: TenantRequest): Promise<string[]>;
    findOne(req: TenantRequest, id: string): Promise<import("mongoose").Document<unknown, {}, import("./manifesto.schema").ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./manifesto.schema").Manifesto & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(req: TenantRequest, id: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./manifesto.schema").ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./manifesto.schema").Manifesto & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./manifesto.schema").ManifestoDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./manifesto.schema").Manifesto & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}

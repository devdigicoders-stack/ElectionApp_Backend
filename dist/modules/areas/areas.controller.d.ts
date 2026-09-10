import { AreasService } from './areas.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
export declare class AreasController {
    private areasService;
    constructor(areasService: AreasService);
    createLevel(req: TenantRequest, body: {
        levelOrder: number;
        name: string;
        isRequired?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("./area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getLevels(req: TenantRequest): Promise<(import("mongoose").Document<unknown, {}, import("./area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateLevel(req: TenantRequest, id: string, body: any): Promise<(import("mongoose").Document<unknown, {}, import("./area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteLevel(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createArea(req: TenantRequest, body: {
        levelId: string;
        parentId?: string;
        name: string;
        code?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./area.schema").AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").Area & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTree(req: TenantRequest): Promise<{
        levels: (import("mongoose").Document<unknown, {}, import("./area.schema").AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").AreaLevel & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        tree: any[];
    }>;
    getByLevel(req: TenantRequest, levelId: string): Promise<(import("mongoose").Document<unknown, {}, import("./area.schema").AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").Area & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getChildren(req: TenantRequest, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./area.schema").AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./area.schema").Area & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAncestors(req: TenantRequest, id: string): Promise<any[]>;
}

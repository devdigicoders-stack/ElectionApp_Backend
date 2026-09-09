import { Model, Types } from 'mongoose';
import { AreaLevel, AreaLevelDocument, Area, AreaDocument } from './area.schema';
import { TenantDocument } from '../tenants/tenant.schema';
export declare class AreasService {
    private levelModel;
    private areaModel;
    constructor(levelModel: Model<AreaLevelDocument>, areaModel: Model<AreaDocument>);
    createLevel(tenant: TenantDocument, data: {
        levelOrder: number;
        name: string;
        isRequired?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getLevels(tenant: TenantDocument): Promise<(import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateLevel(tenant: TenantDocument, levelId: string, data: Partial<{
        name: string;
        levelOrder: number;
    }>): Promise<(import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteLevel(tenant: TenantDocument, levelId: string): Promise<(import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    createArea(tenant: TenantDocument, data: {
        levelId: string;
        parentId?: string;
        name: string;
        code?: string;
    }): Promise<import("mongoose").Document<unknown, {}, AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & Area & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAreasByLevel(tenant: TenantDocument, levelId: string): Promise<(import("mongoose").Document<unknown, {}, AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & Area & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getChildren(tenant: TenantDocument, parentId: string): Promise<(import("mongoose").Document<unknown, {}, AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & Area & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getTree(tenant: TenantDocument): Promise<{
        levels: (import("mongoose").Document<unknown, {}, AreaLevelDocument, {}, import("mongoose").DefaultSchemaOptions> & AreaLevel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        tree: any[];
    }>;
    findById(tenant: TenantDocument, areaId: string): Promise<import("mongoose").Document<unknown, {}, AreaDocument, {}, import("mongoose").DefaultSchemaOptions> & Area & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

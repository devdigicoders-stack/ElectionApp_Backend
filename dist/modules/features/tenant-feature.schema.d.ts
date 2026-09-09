import { Document, Types } from 'mongoose';
import { FeatureKey } from '../../shared/types';
export type TenantFeatureDocument = TenantFeature & Document;
export declare class TenantFeature {
    tenantId: Types.ObjectId;
    featureKey: FeatureKey;
    isEnabled: boolean;
    config: Record<string, any>;
}
export declare const TenantFeatureSchema: import("mongoose").Schema<TenantFeature, import("mongoose").Model<TenantFeature, any, any, any, any, any, TenantFeature>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TenantFeature, Document<unknown, {}, TenantFeature, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TenantFeature & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    tenantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, TenantFeature, Document<unknown, {}, TenantFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TenantFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    featureKey?: import("mongoose").SchemaDefinitionProperty<FeatureKey, TenantFeature, Document<unknown, {}, TenantFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TenantFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, TenantFeature, Document<unknown, {}, TenantFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TenantFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    config?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, TenantFeature, Document<unknown, {}, TenantFeature, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TenantFeature & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, TenantFeature>;

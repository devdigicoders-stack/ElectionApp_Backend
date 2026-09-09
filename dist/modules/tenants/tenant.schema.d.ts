import { Document, Types } from 'mongoose';
import { TenantStatus } from '../../shared/types';
export type TenantDocument = Tenant & Document;
export declare class Tenant {
    slug: string;
    name: string;
    customDomain?: string;
    isCustomDomainVerified?: boolean;
    customDomainVerifiedAt?: Date;
    customDomainVerification?: {
        domain?: string | null;
        status?: 'unconfigured' | 'pending' | 'verified' | 'failed';
        verificationToken?: string | null;
        targetCname?: string | null;
        dnsRecords?: Array<{
            type: 'TXT' | 'CNAME' | 'A';
            name: string;
            value: string;
            purpose: string;
            ttl?: string;
        }>;
        lastCheckedAt?: Date | null;
        failureReason?: string | null;
    };
    status: TenantStatus;
    branding: {
        logoUrl?: string;
        faviconUrl?: string;
        pwaIconUrl?: string;
        primaryColor?: string;
        secondaryColor?: string;
        leaderName?: string;
        tagline?: string;
    };
    settings: {
        registrationFields?: any[];
        areaLevels?: string[];
        timezone?: string;
    };
    planId?: Types.ObjectId;
    trialEndsAt?: Date;
    subscriptionStartsAt?: Date;
    subscriptionEndsAt?: Date;
}
export declare const TenantSchema: import("mongoose").Schema<Tenant, import("mongoose").Model<Tenant, any, any, any, any, any, Tenant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tenant, Document<unknown, {}, Tenant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    slug?: import("mongoose").SchemaDefinitionProperty<string, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customDomain?: import("mongoose").SchemaDefinitionProperty<string | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isCustomDomainVerified?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customDomainVerifiedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customDomainVerification?: import("mongoose").SchemaDefinitionProperty<{
        domain?: string | null;
        status?: "unconfigured" | "pending" | "verified" | "failed";
        verificationToken?: string | null;
        targetCname?: string | null;
        dnsRecords?: Array<{
            type: "TXT" | "CNAME" | "A";
            name: string;
            value: string;
            purpose: string;
            ttl?: string;
        }>;
        lastCheckedAt?: Date | null;
        failureReason?: string | null;
    } | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<TenantStatus, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    branding?: import("mongoose").SchemaDefinitionProperty<{
        logoUrl?: string;
        faviconUrl?: string;
        pwaIconUrl?: string;
        primaryColor?: string;
        secondaryColor?: string;
        leaderName?: string;
        tagline?: string;
    }, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    settings?: import("mongoose").SchemaDefinitionProperty<{
        registrationFields?: any[];
        areaLevels?: string[];
        timezone?: string;
    }, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    planId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    trialEndsAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subscriptionStartsAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subscriptionEndsAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Tenant>;

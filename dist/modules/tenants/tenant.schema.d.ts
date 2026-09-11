import { Document, Types } from 'mongoose';
import { TenantStatus } from '../../shared/types';
export type TenantDocument = Tenant & Document;
export declare class Tenant {
    slug: string;
    name: string;
    title?: string;
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
    contactPerson?: string | null;
    mobileNumber?: string | null;
    email?: string | null;
    gstin?: string | null;
    billingState?: string | null;
    billingAddress?: string | null;
    electionType?: string;
    isPublished: boolean;
    status: TenantStatus;
    branding: {
        platformName?: string;
        title?: string;
        logoUrl?: string;
        logo?: string;
        faviconUrl?: string;
        pwaIconUrl?: string;
        leaderPhotoUrl?: string;
        loginBgUrl?: string;
        splashScreenUrl?: string;
        splashScreens?: Array<{
            title?: string;
            subtitle?: string;
            mediaType?: 'image' | 'video';
            mediaUrl: string;
            order?: number;
        }>;
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
        leaderName?: string;
        tagline?: string;
        footerText?: string;
        privacyPolicyUrl?: string;
        termsUrl?: string;
        privacyPolicyContent?: string;
        termsContent?: string;
        socialLinks?: Record<string, string>;
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
    title?: import("mongoose").SchemaDefinitionProperty<string | undefined, Tenant, Document<unknown, {}, Tenant, {
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
    contactPerson?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mobileNumber?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gstin?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    billingState?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    billingAddress?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    electionType?: import("mongoose").SchemaDefinitionProperty<string | undefined, Tenant, Document<unknown, {}, Tenant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tenant & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Tenant, Document<unknown, {}, Tenant, {
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
        platformName?: string;
        title?: string;
        logoUrl?: string;
        logo?: string;
        faviconUrl?: string;
        pwaIconUrl?: string;
        leaderPhotoUrl?: string;
        loginBgUrl?: string;
        splashScreenUrl?: string;
        splashScreens?: Array<{
            title?: string;
            subtitle?: string;
            mediaType?: "image" | "video";
            mediaUrl: string;
            order?: number;
        }>;
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
        leaderName?: string;
        tagline?: string;
        footerText?: string;
        privacyPolicyUrl?: string;
        termsUrl?: string;
        privacyPolicyContent?: string;
        termsContent?: string;
        socialLinks?: Record<string, string>;
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

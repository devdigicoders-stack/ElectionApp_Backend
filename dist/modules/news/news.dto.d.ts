import { NewsStatus } from '../../shared/types';
export declare class CreateNewsDto {
    title: string;
    slug?: string;
    shortDescription: string;
    content: string;
    coverImageUrl?: string;
    galleryImages?: string[];
    category: string;
    author?: {
        name: string;
        role?: string;
        avatarUrl?: string;
    };
    publishDate?: string;
    status?: NewsStatus;
    scheduledPublishDate?: string;
    areaId?: string;
    tags?: string[];
    isFeatured?: boolean;
    allowSharing?: boolean;
}
export declare class UpdateNewsDto {
    title?: string;
    slug?: string;
    shortDescription?: string;
    content?: string;
    coverImageUrl?: string;
    galleryImages?: string[];
    category?: string;
    author?: {
        name: string;
        role?: string;
        avatarUrl?: string;
    };
    publishDate?: string;
    status?: NewsStatus;
    scheduledPublishDate?: string;
    areaId?: string;
    tags?: string[];
    isFeatured?: boolean;
    allowSharing?: boolean;
}
export declare class UpdateNewsStatusDto {
    status: NewsStatus;
    scheduledPublishDate?: string;
}
export declare class QueryNewsDto {
    category?: string;
    status?: string;
    search?: string;
    areaId?: string;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'publishDate' | 'viewsCount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

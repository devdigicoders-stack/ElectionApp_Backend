"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const news_schema_1 = require("./news.schema");
const types_1 = require("../../shared/types");
let NewsService = class NewsService {
    constructor(newsModel) {
        this.newsModel = newsModel;
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async create(tenant, dto, user) {
        let baseSlug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.title);
        if (!baseSlug)
            baseSlug = `news-${Date.now()}`;
        let slug = baseSlug;
        let counter = 1;
        while (await this.newsModel.findOne({ tenantId: tenant._id, slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        const author = dto.author || {
            name: user?.name || tenant.branding?.leaderName || 'Office of Leader',
            role: user?.role || 'Admin',
            avatarUrl: user?.avatarUrl || null,
        };
        const publishDate = dto.publishDate
            ? new Date(dto.publishDate)
            : new Date();
        const scheduledPublishDate = dto.scheduledPublishDate
            ? new Date(dto.scheduledPublishDate)
            : undefined;
        const status = dto.status || types_1.NewsStatus.PUBLISHED;
        const created = await this.newsModel.create({
            tenantId: tenant._id,
            title: dto.title.trim(),
            slug,
            shortDescription: dto.shortDescription.trim(),
            content: dto.content,
            coverImageUrl: dto.coverImageUrl || undefined,
            galleryImages: dto.galleryImages || [],
            category: dto.category.trim(),
            author,
            publishDate,
            status,
            scheduledPublishDate,
            areaId: dto.areaId ? new mongoose_2.Types.ObjectId(dto.areaId) : undefined,
            tags: dto.tags || [],
            isFeatured: dto.isFeatured || false,
            allowSharing: dto.allowSharing !== false,
            createdBy: user?.sub ? new mongoose_2.Types.ObjectId(user.sub) : undefined,
        });
        return created;
    }
    async findAllPublished(tenant, query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const now = new Date();
        const filter = {
            tenantId: tenant._id,
            status: types_1.NewsStatus.PUBLISHED,
            publishDate: { $lte: now },
        };
        if (query.category) {
            filter.category = query.category;
        }
        if (query.areaId) {
            filter.areaId = new mongoose_2.Types.ObjectId(query.areaId);
        }
        if (query.isFeatured !== undefined) {
            filter.isFeatured = query.isFeatured;
        }
        if (query.search) {
            const searchRegex = { $regex: query.search.trim(), $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { shortDescription: searchRegex },
                { tags: { $in: [new RegExp(query.search.trim(), 'i')] } },
            ];
        }
        const sortField = query.sortBy || 'publishDate';
        const sortDir = query.sortOrder === 'asc' ? 1 : -1;
        const sortOptions = { [sortField]: sortDir };
        const [items, total] = await Promise.all([
            this.newsModel
                .find(filter)
                .populate('areaId', 'name code')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            this.newsModel.countDocuments(filter),
        ]);
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findAllAdmin(tenant, query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const filter = { tenantId: tenant._id };
        if (query.status) {
            filter.status = query.status;
        }
        if (query.category) {
            filter.category = query.category;
        }
        if (query.areaId) {
            filter.areaId = new mongoose_2.Types.ObjectId(query.areaId);
        }
        if (query.isFeatured !== undefined) {
            filter.isFeatured = query.isFeatured;
        }
        if (query.search) {
            const searchRegex = { $regex: query.search.trim(), $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { shortDescription: searchRegex },
                { tags: { $in: [new RegExp(query.search.trim(), 'i')] } },
            ];
        }
        const sortField = query.sortBy || 'createdAt';
        const sortDir = query.sortOrder === 'asc' ? 1 : -1;
        const sortOptions = { [sortField]: sortDir };
        const [items, total] = await Promise.all([
            this.newsModel
                .find(filter)
                .populate('areaId', 'name code')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            this.newsModel.countDocuments(filter),
        ]);
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(tenant, idOrSlug, isPublic = false) {
        const isObjectId = mongoose_2.Types.ObjectId.isValid(idOrSlug);
        const query = {
            tenantId: tenant._id,
            ...(isObjectId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] } : { slug: idOrSlug }),
        };
        if (isPublic) {
            query.status = types_1.NewsStatus.PUBLISHED;
            query.publishDate = { $lte: new Date() };
        }
        const news = await this.newsModel
            .findOne(query)
            .populate('areaId', 'name code')
            .exec();
        if (!news) {
            throw new common_1.NotFoundException('News article not found');
        }
        if (isPublic) {
            this.newsModel.updateOne({ _id: news._id }, { $inc: { viewsCount: 1 } }).exec();
            news.viewsCount += 1;
        }
        return news;
    }
    async getCategories(tenant) {
        const categories = await this.newsModel.aggregate([
            { $match: { tenantId: tenant._id, status: types_1.NewsStatus.PUBLISHED } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const defaultCategories = [
            'News',
            'Press Release',
            'Announcement',
            'Article',
            'Leader Message',
            'Development Update',
        ];
        const existingNames = new Set(categories.map((c) => c._id));
        const result = categories.map((c) => ({ category: c._id, count: c.count }));
        for (const def of defaultCategories) {
            if (!existingNames.has(def)) {
                result.push({ category: def, count: 0 });
            }
        }
        return result;
    }
    async getStats(tenant) {
        const stats = await this.newsModel.aggregate([
            { $match: { tenantId: tenant._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalViews: { $sum: '$viewsCount' },
                },
            },
        ]);
        const summary = {
            total: 0,
            published: 0,
            draft: 0,
            scheduled: 0,
            archived: 0,
            totalViews: 0,
        };
        for (const s of stats) {
            summary.total += s.count;
            summary.totalViews += s.totalViews || 0;
            if (s._id === types_1.NewsStatus.PUBLISHED)
                summary.published = s.count;
            else if (s._id === types_1.NewsStatus.DRAFT)
                summary.draft = s.count;
            else if (s._id === types_1.NewsStatus.SCHEDULED)
                summary.scheduled = s.count;
            else if (s._id === types_1.NewsStatus.ARCHIVED)
                summary.archived = s.count;
        }
        return summary;
    }
    async update(tenant, id, dto) {
        const news = await this.newsModel.findOne({ _id: id, tenantId: tenant._id });
        if (!news)
            throw new common_1.NotFoundException('News article not found');
        if (dto.title && dto.title !== news.title && !dto.slug) {
            let baseSlug = this.generateSlug(dto.title);
            let slug = baseSlug;
            let counter = 1;
            while (await this.newsModel.findOne({ tenantId: tenant._id, slug, _id: { $ne: news._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            news.slug = slug;
        }
        else if (dto.slug) {
            news.slug = this.generateSlug(dto.slug);
        }
        if (dto.title !== undefined)
            news.title = dto.title.trim();
        if (dto.shortDescription !== undefined)
            news.shortDescription = dto.shortDescription.trim();
        if (dto.content !== undefined)
            news.content = dto.content;
        if (dto.coverImageUrl !== undefined)
            news.coverImageUrl = dto.coverImageUrl;
        if (dto.galleryImages !== undefined)
            news.galleryImages = dto.galleryImages;
        if (dto.category !== undefined)
            news.category = dto.category.trim();
        if (dto.author !== undefined)
            news.author = { ...news.author, ...dto.author };
        if (dto.publishDate !== undefined)
            news.publishDate = new Date(dto.publishDate);
        if (dto.status !== undefined)
            news.status = dto.status;
        if (dto.scheduledPublishDate !== undefined) {
            news.scheduledPublishDate = dto.scheduledPublishDate ? new Date(dto.scheduledPublishDate) : undefined;
        }
        if (dto.areaId !== undefined) {
            news.areaId = dto.areaId ? new mongoose_2.Types.ObjectId(dto.areaId) : undefined;
        }
        if (dto.tags !== undefined)
            news.tags = dto.tags;
        if (dto.isFeatured !== undefined)
            news.isFeatured = dto.isFeatured;
        if (dto.allowSharing !== undefined)
            news.allowSharing = dto.allowSharing;
        await news.save();
        return news;
    }
    async updateStatus(tenant, id, dto) {
        const news = await this.newsModel.findOne({ _id: id, tenantId: tenant._id });
        if (!news)
            throw new common_1.NotFoundException('News article not found');
        news.status = dto.status;
        if (dto.status === types_1.NewsStatus.PUBLISHED && !news.publishDate) {
            news.publishDate = new Date();
        }
        if (dto.scheduledPublishDate) {
            news.scheduledPublishDate = new Date(dto.scheduledPublishDate);
        }
        await news.save();
        return news;
    }
    async remove(tenant, id) {
        const deleted = await this.newsModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
        if (!deleted)
            throw new common_1.NotFoundException('News article not found');
        return { success: true, message: 'News article deleted successfully' };
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(news_schema_1.News.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NewsService);
//# sourceMappingURL=news.service.js.map
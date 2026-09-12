import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument } from './news.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { NewsStatus } from '../../shared/types';
import {
  CreateNewsDto,
  UpdateNewsDto,
  UpdateNewsStatusDto,
  QueryNewsDto,
} from './news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

  /**
   * Helper to create a URL-friendly slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Create news / article / press release (SRS Sec 26 & 42)
   */
  async create(tenant: TenantDocument, dto: CreateNewsDto, user?: any) {
    let baseSlug = dto.slug ? this.generateSlug(dto.slug) : this.generateSlug(dto.title);
    if (!baseSlug) baseSlug = `news-${Date.now()}`;

    // Ensure slug uniqueness within tenant
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

    const status = dto.status || NewsStatus.PUBLISHED;

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
      areaId: dto.areaId ? new Types.ObjectId(dto.areaId) : undefined,
      tags: dto.tags || [],
      isFeatured: dto.isFeatured || false,
      allowSharing: dto.allowSharing !== false,
      createdBy: user?.sub ? new Types.ObjectId(user.sub) : undefined,
    });

    return created;
  }

  /**
   * Public list of published news/articles with search and filtering
   */
  async findAllPublished(tenant: TenantDocument, query: QueryNewsDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const now = new Date();
    const filter: any = {
      tenantId: tenant._id,
      status: NewsStatus.PUBLISHED,
      publishDate: { $lte: now },
    };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.areaId) {
      filter.areaId = new Types.ObjectId(query.areaId);
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
    const sortOptions: any = { [sortField]: sortDir };

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

  /**
   * Admin list of all news/articles (all statuses, drafts, scheduled)
   */
  async findAllAdmin(tenant: TenantDocument, query: QueryNewsDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter: any = { tenantId: tenant._id };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.areaId) {
      filter.areaId = new Types.ObjectId(query.areaId);
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
    const sortOptions: any = { [sortField]: sortDir };

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

  /**
   * Get single news by ID or Slug. If isPublic, increments viewsCount.
   */
  async findOne(tenant: TenantDocument, idOrSlug: string, isPublic = false) {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);
    const query: any = {
      tenantId: tenant._id,
      ...(isObjectId
        ? { $or: [{ _id: new Types.ObjectId(idOrSlug) }, { slug: idOrSlug }] }
        : { slug: idOrSlug }),
    };

    if (isPublic) {
      query.status = NewsStatus.PUBLISHED;
      query.publishDate = { $lte: new Date() };
    }

    const news = await this.newsModel
      .findOne(query)
      .populate('areaId', 'name code')
      .exec();

    if (!news) {
      throw new NotFoundException('News article not found');
    }

    if (isPublic) {
      // Increment view counter asynchronously
      this.newsModel.updateOne({ _id: news._id }, { $inc: { viewsCount: 1 } }).exec();
      news.viewsCount += 1;
    }

    return news;
  }

  /**
   * Get distinct categories with counts
   */
  async getCategories(tenant: TenantDocument) {
    const categories = await this.newsModel.aggregate([
      { $match: { tenantId: tenant._id, status: NewsStatus.PUBLISHED } },
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

  /**
   * Get News module metrics and statistics for dashboard
   */
  async getStats(tenant: TenantDocument) {
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
      if (s._id === NewsStatus.PUBLISHED) summary.published = s.count;
      else if (s._id === NewsStatus.DRAFT) summary.draft = s.count;
      else if (s._id === NewsStatus.SCHEDULED) summary.scheduled = s.count;
      else if (s._id === NewsStatus.ARCHIVED) summary.archived = s.count;
    }

    return summary;
  }

  /**
   * Update news article
   */
  async update(tenant: TenantDocument, id: string, dto: UpdateNewsDto) {
    const isObjectId = Types.ObjectId.isValid(id);
    const news = await this.newsModel.findOne({
      _id: isObjectId ? new Types.ObjectId(id) : id,
      tenantId: tenant._id,
    });
    if (!news) throw new NotFoundException('News article not found');

    if (dto.title && dto.title !== news.title && !dto.slug) {
      let baseSlug = this.generateSlug(dto.title);
      let slug = baseSlug;
      let counter = 1;
      while (await this.newsModel.findOne({ tenantId: tenant._id, slug, _id: { $ne: news._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      news.slug = slug;
    } else if (dto.slug) {
      news.slug = this.generateSlug(dto.slug);
    }

    if (dto.title !== undefined) news.title = dto.title.trim();
    if (dto.shortDescription !== undefined) news.shortDescription = dto.shortDescription.trim();
    if (dto.content !== undefined) news.content = dto.content;
    if (dto.coverImageUrl !== undefined) news.coverImageUrl = dto.coverImageUrl;
    if (dto.galleryImages !== undefined) news.galleryImages = dto.galleryImages;
    if (dto.category !== undefined) news.category = dto.category.trim();
    if (dto.author !== undefined) news.author = { ...news.author, ...dto.author };
    if (dto.publishDate !== undefined) news.publishDate = new Date(dto.publishDate);
    if (dto.status !== undefined) news.status = dto.status;
    if (dto.scheduledPublishDate !== undefined) {
      news.scheduledPublishDate = dto.scheduledPublishDate ? new Date(dto.scheduledPublishDate) : undefined;
    }
    if (dto.areaId !== undefined) {
      news.areaId = dto.areaId ? new Types.ObjectId(dto.areaId) : undefined;
    }
    if (dto.tags !== undefined) news.tags = dto.tags;
    if (dto.isFeatured !== undefined) news.isFeatured = dto.isFeatured;
    if (dto.allowSharing !== undefined) news.allowSharing = dto.allowSharing;

    await news.save();
    return news;
  }

  /**
   * Quick status update (publish / unpublish / schedule / archive)
   */
  async updateStatus(tenant: TenantDocument, id: string, dto: UpdateNewsStatusDto) {
    const isObjectId = Types.ObjectId.isValid(id);
    const news = await this.newsModel.findOne({
      _id: isObjectId ? new Types.ObjectId(id) : id,
      tenantId: tenant._id,
    });
    if (!news) throw new NotFoundException('News article not found');

    news.status = dto.status;
    if (dto.status === NewsStatus.PUBLISHED && !news.publishDate) {
      news.publishDate = new Date();
    }
    if (dto.scheduledPublishDate) {
      news.scheduledPublishDate = new Date(dto.scheduledPublishDate);
    }

    await news.save();
    return news;
  }

  /**
   * Delete news article
   */
  async remove(tenant: TenantDocument, id: string) {
    const isObjectId = Types.ObjectId.isValid(id);
    const deleted = await this.newsModel.findOneAndDelete({
      _id: isObjectId ? new Types.ObjectId(id) : id,
      tenantId: tenant._id,
    });
    if (!deleted) throw new NotFoundException('News article not found');
    return { success: true, message: 'News article deleted successfully' };
  }
}

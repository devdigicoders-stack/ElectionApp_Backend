import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { GalleryService } from './gallery.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, GalleryType } from '../../shared/types';

export const galleryUploadOptions = {
  storage: diskStorage({
    destination: (req: any, _file, cb) => {
      const tenantSlug = req.tenant?.slug || 'general';
      const dir = join(process.cwd(), 'uploads', tenantSlug, 'gallery');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowedExts = /jpeg|jpg|png|gif|webp|svg|mp4|webm|mov|m4v/;
    const ext = extname(file.originalname).toLowerCase().replace('.', '');
    const isAllowedExt = allowedExts.test(ext);
    const isAllowedMime = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    if (isAllowedExt || isAllowedMime) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`Unsupported file type: ${ext || file.mimetype}. Allowed: images and videos`), false);
    }
  },
};

function parseGalleryBody(
  body: any,
  files: { file?: Express.Multer.File[]; image?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] } | undefined,
  tenantSlug: string,
) {
  const data = { ...(body || {}) };
  const uploadedMedia = files?.file?.[0] || files?.image?.[0];
  const uploadedThumbnail = files?.thumbnail?.[0];

  if (uploadedMedia) {
    data.url = `/uploads/${tenantSlug}/gallery/${uploadedMedia.filename}`;
    if (!data.type) {
      data.type = uploadedMedia.mimetype.startsWith('video/')
        ? GalleryType.VIDEO
        : GalleryType.PHOTO;
    }
  }

  if (uploadedThumbnail) {
    data.thumbnailUrl = `/uploads/${tenantSlug}/gallery/${uploadedThumbnail.filename}`;
  }

  // Parse tags if passed as JSON string or comma-separated string in form-data
  if (typeof data.tags === 'string') {
    const trimmed = data.tags.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        data.tags = JSON.parse(trimmed);
      } catch {
        data.tags = trimmed.slice(1, -1).split(',').map((t: string) => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      }
    } else {
      data.tags = trimmed.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
  }

  // Parse booleans from form-data strings
  if (typeof data.isPublished === 'string') {
    data.isPublished = data.isPublished.toLowerCase() === 'true' || data.isPublished === '1';
  }

  if (typeof data.allowDownload === 'string') {
    data.allowDownload = data.allowDownload.toLowerCase() === 'true' || data.allowDownload === '1';
  }

  // Parse sortOrder
  if (typeof data.sortOrder === 'string') {
    const parsedOrder = parseInt(data.sortOrder, 10);
    data.sortOrder = isNaN(parsedOrder) ? 0 : parsedOrder;
  }

  // Sanitize areaId
  if (!data.areaId || data.areaId === 'null' || data.areaId === 'undefined' || data.areaId === '') {
    data.areaId = null;
  }

  return data;
}

@Controller('gallery')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.GALLERY)
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      galleryUploadOptions,
    ),
  )
  async create(
    @Req() req: TenantRequest,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      image?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const tenantSlug = req.tenant?.slug || 'general';
    const payload = parseGalleryBody(body, files, tenantSlug);

    if (!payload.url) {
      throw new BadRequestException('Either an image/video file must be uploaded or a valid url must be provided in body.');
    }

    if (!payload.type) {
      payload.type = GalleryType.PHOTO;
    }

    return this.galleryService.create(req.tenant, payload);
  }

  @Get()
  findAll(
    @Req() req: TenantRequest,
    @Query('type') type?: GalleryType,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('all') all?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.galleryService.findAll(req.tenant, {
      type,
      category,
      tag,
      search,
      all: all === 'true',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.galleryService.findOne(req.tenant, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      galleryUploadOptions,
    ),
  )
  async update(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      image?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
    @Body() body: any,
  ) {
    const tenantSlug = req.tenant?.slug || 'general';
    const payload = parseGalleryBody(body, files, tenantSlug);
    return this.galleryService.update(req.tenant, id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.galleryService.remove(req.tenant, id);
  }
}

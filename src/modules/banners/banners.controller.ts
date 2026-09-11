import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import { BannersService } from './banners.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

export const bannerUploadOptions = {
  storage: diskStorage({
    destination: (req: any, _file, cb) => {
      const tenantSlug = req.tenant?.slug || 'general';
      const dir = join(process.cwd(), 'uploads', tenantSlug, 'banners');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      cb(null, `banner-${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|bmp/i;
    const ext = extname(file.originalname).toLowerCase().replace('.', '');
    const isAllowedExt = allowed.test(ext);
    const isAllowedMime = file.mimetype.startsWith('image/');
    if (isAllowedExt || isAllowedMime) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Unsupported file type for banner: ${ext || file.mimetype}. Allowed formats: JPG, PNG, GIF, WEBP, SVG`,
        ),
        false,
      );
    }
  },
};

export function parseBannerBody(
  body: any,
  files:
    | {
        image?: Express.Multer.File[];
        file?: Express.Multer.File[];
        banner?: Express.Multer.File[];
        bannerImage?: Express.Multer.File[];
        mobileImage?: Express.Multer.File[];
      }
    | undefined,
  tenantSlug: string,
) {
  const data = { ...(body || {}) };
  const uploadedImage =
    files?.image?.[0] ||
    files?.file?.[0] ||
    files?.banner?.[0] ||
    files?.bannerImage?.[0];
  const uploadedMobile = files?.mobileImage?.[0];

  if (uploadedImage) {
    data.imageUrl = `/uploads/${tenantSlug}/banners/${uploadedImage.filename}`;
  }

  if (uploadedMobile) {
    data.mobileImageUrl = `/uploads/${tenantSlug}/banners/${uploadedMobile.filename}`;
  }

  // Parse booleans from form-data strings
  if (typeof data.isActive === 'string') {
    data.isActive = data.isActive.toLowerCase() === 'true' || data.isActive === '1';
  } else if (data.isActive === undefined && uploadedImage) {
    data.isActive = true;
  }

  // Parse sortOrder
  if (typeof data.sortOrder === 'string') {
    const parsed = parseInt(data.sortOrder, 10);
    data.sortOrder = isNaN(parsed) ? 0 : parsed;
  }

  // Clean strings
  if (typeof data.title === 'string') {
    data.title = data.title.trim();
  }
  if (data.linkUrl && typeof data.linkUrl === 'string') {
    data.linkUrl = data.linkUrl.trim();
    if (data.linkUrl === 'null' || data.linkUrl === 'undefined' || data.linkUrl === '') {
      data.linkUrl = null;
    }
  }

  // Support category (homepage, campaign, popup)
  if (data.category && typeof data.category === 'string') {
    data.category = data.category.trim().toLowerCase();
  }

  return data;
}

@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
        { name: 'mobileImage', maxCount: 1 },
      ],
      bannerUploadOptions,
    ),
  )
  create(
    @Req() req: TenantRequest,
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
      banner?: Express.Multer.File[];
      bannerImage?: Express.Multer.File[];
      mobileImage?: Express.Multer.File[];
    },
  ) {
    const tenantSlug = req.tenant?.slug || 'general';
    const parsedData = parseBannerBody(body, files, tenantSlug);
    return this.bannersService.create(req.tenant, parsedData, req);
  }

  @Get()
  findActive(@Req() req: TenantRequest) {
    return this.bannersService.findActive(req.tenant, req);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: TenantRequest) {
    return this.bannersService.findAll(req.tenant, req);
  }

  @Get(':id')
  findOne(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.bannersService.findOne(req.tenant, id, req);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Req() req: TenantRequest, @Body() body: { orders: { id: string; sortOrder: number }[] }) {
    return this.bannersService.reorder(req.tenant, body.orders);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
        { name: 'mobileImage', maxCount: 1 },
      ],
      bannerUploadOptions,
    ),
  )
  update(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
      banner?: Express.Multer.File[];
      bannerImage?: Express.Multer.File[];
      mobileImage?: Express.Multer.File[];
    },
  ) {
    const tenantSlug = req.tenant?.slug || 'general';
    const parsedData = parseBannerBody(body, files, tenantSlug);
    return this.bannersService.update(req.tenant, id, parsedData, req);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.bannersService.remove(req.tenant, id);
  }
}


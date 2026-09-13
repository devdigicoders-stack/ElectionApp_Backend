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
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PosterGeneratorService } from './poster-generator.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey, UserRole } from '../../shared/types';
import {
  CreatePosterTemplateDto,
  UpdatePosterTemplateDto,
  QueryPosterTemplatesDto,
  GeneratePosterDto,
} from './poster.dto';

@Controller('poster-generator')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.POSTER_GENERATOR)
export class PosterGeneratorController {
  constructor(private posterService: PosterGeneratorService) {}

  // ══════════════════════════════════════════════════════════════
  // ADMIN TEMPLATE MANAGEMENT (SRS Sec 28)
  // ══════════════════════════════════════════════════════════════

  /**
   * 1. [Admin] Create a new poster template (Supports templateImage file upload)
   * POST /poster-generator/templates
   */
  @Post('templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @UseInterceptors(
    FileInterceptor('templateImage', {
      storage: diskStorage({
        destination: (req: any, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-templates');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `tmpl-${Date.now()}-${Math.round(Math.random() * 1e6)}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        cb(null, /jpeg|jpg|png|webp/.test(extname(file.originalname).toLowerCase()));
      },
    }),
  )
  createTemplate(
    @Req() req: TenantRequest,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let parsedFields = body.fields;
    if (typeof body.fields === 'string') {
      try {
        parsedFields = JSON.parse(body.fields);
      } catch (e) {}
    }

    let parsedTags = body.tags;
    if (typeof body.tags === 'string') {
      try {
        parsedTags = JSON.parse(body.tags);
      } catch (e) {
        parsedTags = body.tags.split(',').map((t: string) => t.trim());
      }
    }

    const dto: CreatePosterTemplateDto = {
      title: body.title || body.name,
      category: body.category,
      description: body.description,
      templateImageUrl: body.templateImageUrl || body.imageUrl,
      thumbnailUrl: body.thumbnailUrl,
      width: body.width ? Number(body.width) : undefined,
      height: body.height ? Number(body.height) : undefined,
      dimensionPreset: body.dimensionPreset,
      fields: parsedFields,
      includeTenantBranding: body.includeTenantBranding !== undefined ? String(body.includeTenantBranding) === 'true' : true,
      expiresAt: body.expiresAt,
      tags: parsedTags,
      isActive: body.isActive !== undefined ? String(body.isActive) === 'true' : true,
      sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
    };

    return this.posterService.createTemplate(req.tenant, dto, file);
  }

  /**
   * 2. [Admin] List all templates (including inactive and expired)
   * GET /poster-generator/templates/admin
   */
  @Get('templates/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  getAdminTemplates(@Req() req: TenantRequest, @Query() query: QueryPosterTemplatesDto) {
    return this.posterService.getTemplates(req.tenant, query, true);
  }

  /**
   * 3. [Public / Citizen] List distinct template categories
   * GET /poster-generator/templates/categories
   */
  @Get('templates/categories')
  getCategories(@Req() req: TenantRequest) {
    return this.posterService.getTemplateCategories(req.tenant);
  }

  /**
   * 4. [Public / Citizen] List active templates with optional filters
   * GET /poster-generator/templates
   */
  @Get('templates')
  getTemplates(@Req() req: TenantRequest, @Query() query: QueryPosterTemplatesDto) {
    return this.posterService.getTemplates(req.tenant, query, false);
  }

  /**
   * 5. [Public / Citizen] Get single template detail
   * GET /poster-generator/templates/:id
   */
  @Get('templates/:id')
  getTemplate(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.posterService.getTemplate(req.tenant, id);
  }

  /**
   * 6. [Admin] Update template
   * PATCH /poster-generator/templates/:id
   */
  @Patch('templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @UseInterceptors(
    FileInterceptor('templateImage', {
      storage: diskStorage({
        destination: (req: any, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-templates');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `tmpl-${Date.now()}-${Math.round(Math.random() * 1e6)}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  updateTemplate(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let parsedFields = body.fields;
    if (typeof body.fields === 'string') {
      try {
        parsedFields = JSON.parse(body.fields);
      } catch (e) {}
    }

    const dto: UpdatePosterTemplateDto = {
      ...body,
      title: body.title || body.name,
      templateImageUrl: body.templateImageUrl || body.imageUrl,
      fields: parsedFields,
      width: body.width ? Number(body.width) : undefined,
      height: body.height ? Number(body.height) : undefined,
      includeTenantBranding: body.includeTenantBranding !== undefined ? String(body.includeTenantBranding) === 'true' : undefined,
      isActive: body.isActive !== undefined ? String(body.isActive) === 'true' : undefined,
    };

    return this.posterService.updateTemplate(req.tenant, id, dto, file);
  }

  /**
   * 7. [Admin] Delete template
   * DELETE /poster-generator/templates/:id
   */
  @Delete('templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  removeTemplate(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.posterService.removeTemplate(req.tenant, id);
  }

  // ══════════════════════════════════════════════════════════════
  // BACKGROUND REMOVAL PREVIEW (SRS Sec 29)
  // ══════════════════════════════════════════════════════════════

  /**
   * 8. [Citizen / Public] Background Removal Service & Cutout Preview
   * POST /poster-generator/remove-bg
   */
  @Post('remove-bg')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req: any, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-photos');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `raw-${Date.now()}-${Math.round(Math.random() * 1e6)}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        cb(null, /jpeg|jpg|png|webp/.test(extname(file.originalname).toLowerCase()));
      },
    }),
  )
  async removeBackground(
    @Req() req: TenantRequest,
    @UploadedFile() photo?: Express.Multer.File,
    @Body('photoUrl') photoUrl?: string,
  ) {
    const targetPath = photo ? photo.path : photoUrl;

    if (!targetPath) {
      throw new BadRequestException('Please provide a photo file upload or photoUrl');
    }

    const result = await this.posterService.removeBackground(req.tenant, targetPath);

    return {
      message: 'Background removed successfully. You can use this cutout in banner generation.',
      originalUrl: targetPath,
      cutoutUrl: result.cutoutUrl,
      provider: result.provider,
      dimensions: { width: result.width, height: result.height },
    };
  }

  // ══════════════════════════════════════════════════════════════
  // POSTER GENERATION (SRS Sec 27 & 30)
  // ══════════════════════════════════════════════════════════════

  /**
   * 9. [Citizen / Public] Generate Personalized Banner
   * POST /poster-generator/generate/:templateId
   */
  @Post('generate/:templateId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req: any, _file, cb) => {
          const dir = join(process.cwd(), 'uploads', req.tenant?.slug || 'general', 'poster-photos');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        cb(null, /jpeg|jpg|png|webp/.test(extname(file.originalname).toLowerCase()));
      },
    }),
  )
  async generatePoster(
    @Req() req: TenantRequest & { user: any },
    @Param('templateId') templateId: string,
    @Body() body: any,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    let fieldValues: Record<string, string> = {};
    if (typeof body.fieldValues === 'string') {
      try {
        fieldValues = JSON.parse(body.fieldValues);
      } catch (e) {
        fieldValues = {};
      }
    } else if (typeof body.fieldValues === 'object' && body.fieldValues !== null) {
      fieldValues = body.fieldValues;
    }

    // Also pick direct form body keys if fieldValues wasn't nested
    if (body.name && !fieldValues['name']) fieldValues['name'] = body.name;
    if (body.designation && !fieldValues['designation']) fieldValues['designation'] = body.designation;
    if (body.area && !fieldValues['area']) fieldValues['area'] = body.area;
    if (body.custom_text && !fieldValues['custom_text']) fieldValues['custom_text'] = body.custom_text;

    const photoPath = photo ? photo.path : null;

    const dto: GeneratePosterDto = {
      fieldValues,
      photoUrl: body.photoUrl,
      removeBg: body.removeBg !== undefined ? String(body.removeBg) === 'true' : false,
      format: (body.format === 'jpg' || body.format === 'jpeg') ? 'jpg' : 'png',
      includeBranding: body.includeBranding !== undefined ? String(body.includeBranding) === 'true' : true,
    };

    return this.posterService.generatePoster(
      req.tenant,
      templateId,
      fieldValues,
      photoPath,
      dto,
      req.user?.sub,
    );
  }

  /**
   * 10. [Citizen] Direct Binary Download of Generated Poster
   * GET /poster-generator/download/:id
   */
  @Get('download/:id')
  async downloadPoster(
    @Req() req: TenantRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { filePath, filename } = await this.posterService.getPosterFilePath(req.tenant, id);
    return res.download(filePath, filename);
  }

  /**
   * 11. [Citizen] View My Generated Posters Gallery
   * GET /poster-generator/my-posters
   */
  @Get('my-posters')
  @UseGuards(JwtAuthGuard)
  getMyPosters(@Req() req: TenantRequest & { user: any }) {
    return this.posterService.getMyPosters(req.tenant, req.user.sub);
  }

  /**
   * 12. [Public / Citizen] Get Social Sharing Metadata
   * GET /poster-generator/share/:id
   */
  @Get('share/:id')
  async getShareMetadata(@Req() req: TenantRequest, @Param('id') id: string) {
    const { filename } = await this.posterService.getPosterFilePath(req.tenant, id);
    const envBase = process.env.APP_URL || process.env.API_BASE_URL || process.env.BASE_URL || process.env.FRONTEND_URL;
    let base = '';
    if (req.tenant.customDomain) {
      const proto = req.tenant.customDomain.includes('localhost') ? 'http' : 'https';
      base = `${proto}://${req.tenant.customDomain}`;
    } else if (envBase) {
      const cleanBase = envBase.replace(/\/+$/, '');
      base = cleanBase.startsWith('http') ? cleanBase : `https://${cleanBase}`;
    } else {
      const port = process.env.PORT || 3001;
      base = `http://${req.tenant.slug}.localhost:${port}`;
    }
    const bannerUrl = `${base}/uploads/${req.tenant.slug}/generated-posters/${filename}`;
    const downloadUrl = `${base}/poster-generator/download/${id}`;
    const shareText = `Check out my official poster generated on ${req.tenant.name}! Download: ${downloadUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    return {
      id,
      bannerUrl,
      downloadUrl,
      shareData: {
        title: `${req.tenant.name} Official Poster`,
        text: shareText,
        bannerUrl,
        downloadUrl,
        whatsappUrl,
      },
    };
  }

  // ══════════════════════════════════════════════════════════════
  // ADMIN GALLERY & MODERATION (SRS Sec 27 & 28)
  // ══════════════════════════════════════════════════════════════

  /**
   * 13. [Admin] View All Generated Posters Across Tenant with Analytics
   * GET /poster-generator/admin/posters
   */
  @Get('admin/posters')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  adminGetAllPosters(
    @Req() req: TenantRequest,
    @Query() query: { page?: number; limit?: number; search?: string },
  ) {
    return this.posterService.adminGetAllPosters(req.tenant, query);
  }

  /**
   * 14. [Admin] Delete Generated Poster
   * DELETE /poster-generator/admin/posters/:id
   */
  @Delete('admin/posters/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  adminDeletePoster(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.posterService.adminDeletePoster(req.tenant, id);
  }
}

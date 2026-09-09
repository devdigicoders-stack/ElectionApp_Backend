import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, Req, UseGuards,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PosterGeneratorService } from './poster-generator.service';
import { TenantRequest } from '../../common/middleware/tenant.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FeatureGuard } from '../../common/guards/feature.guard';
import { RequireFeature } from '../../common/decorators/feature.decorator';
import { FeatureKey } from '../../shared/types';

@Controller('poster-generator')
@UseGuards(FeatureGuard)
@RequireFeature(FeatureKey.POSTER_GENERATOR)
export class PosterGeneratorController {
  constructor(private posterService: PosterGeneratorService) {}

  // ── Admin: Template Management ───────────────────────────────────

  @Post('templates')
  @UseGuards(JwtAuthGuard)
  createTemplate(@Req() req: TenantRequest, @Body() body: any) {
    return this.posterService.createTemplate(req.tenant, body);
  }

  @Get('templates')
  getTemplates(@Req() req: TenantRequest, @Query('category') category?: string) {
    return this.posterService.getTemplates(req.tenant, category);
  }

  @Get('templates/categories')
  getCategories(@Req() req: TenantRequest) {
    return this.posterService.getTemplateCategories(req.tenant);
  }

  @Get('templates/:id')
  getTemplate(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.posterService.getTemplate(req.tenant, id);
  }

  @Patch('templates/:id')
  @UseGuards(JwtAuthGuard)
  updateTemplate(@Req() req: TenantRequest, @Param('id') id: string, @Body() body: any) {
    return this.posterService.updateTemplate(req.tenant, id, body);
  }

  @Delete('templates/:id')
  @UseGuards(JwtAuthGuard)
  removeTemplate(@Req() req: TenantRequest, @Param('id') id: string) {
    return this.posterService.removeTemplate(req.tenant, id);
  }

  // ── Public: Generate Poster ──────────────────────────────────────

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
    @Body() body: { fieldValues: string }, // JSON string from form-data
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const fieldValues = typeof body.fieldValues === 'string'
      ? JSON.parse(body.fieldValues)
      : body.fieldValues || {};

    const photoPath = photo
      ? `/uploads/${req.tenant.slug}/poster-photos/${photo.filename}`
      : null;

    return this.posterService.generatePoster(
      req.tenant,
      templateId,
      fieldValues,
      photoPath,
      req.user?.sub,
    );
  }

  @Get('my-posters')
  @UseGuards(JwtAuthGuard)
  getMyPosters(@Req() req: TenantRequest & { user: any }) {
    return this.posterService.getMyPosters(req.tenant, req.user.sub);
  }
}

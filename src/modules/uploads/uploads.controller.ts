import { Controller, Post, UploadedFiles, UseInterceptors, Req, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { TenantRequest } from '../../common/middleware/tenant.middleware';

@Controller('uploads')
export class UploadsController {
  @Post(':module')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req: any, _file, cb) => {
          const tenantSlug = req.tenant?.slug || 'general';
          const module = req.params.module || 'misc';
          const dir = join(process.cwd(), 'uploads', tenantSlug, module);
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|mp4|pdf/;
        cb(null, allowed.test(extname(file.originalname).toLowerCase()));
      },
    }),
  )
  uploadFiles(
    @Req() req: TenantRequest,
    @Param('module') module: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const tenantSlug = req.tenant?.slug || 'general';
    const urls = files.map((f) => `/uploads/${tenantSlug}/${module}/${f.filename}`);
    return { urls };
  }
}

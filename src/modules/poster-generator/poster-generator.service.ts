import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createCanvas, loadImage, registerFont } from 'canvas';
import * as path from 'path';
import * as fs from 'fs';
import { PosterTemplate, PosterTemplateDocument } from './poster-template.schema';
import { GeneratedPoster, GeneratedPosterDocument } from './generated-poster.schema';
import { TenantDocument } from '../tenants/tenant.schema';

@Injectable()
export class PosterGeneratorService {
  constructor(
    @InjectModel(PosterTemplate.name) private templateModel: Model<PosterTemplateDocument>,
    @InjectModel(GeneratedPoster.name) private generatedModel: Model<GeneratedPosterDocument>,
  ) {}

  // ── Template Management ──────────────────────────────────────────

  async createTemplate(tenant: TenantDocument, data: any) {
    return this.templateModel.create({ tenantId: tenant._id, ...data });
  }

  async getTemplates(tenant: TenantDocument, category?: string) {
    const query: any = { tenantId: tenant._id, isActive: true };
    if (category) query.category = category;
    return this.templateModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
  }

  async getTemplateCategories(tenant: TenantDocument) {
    return this.templateModel.distinct('category', { tenantId: tenant._id, isActive: true });
  }

  async getTemplate(tenant: TenantDocument, id: string) {
    const template = await this.templateModel.findOne({ _id: id, tenantId: tenant._id });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async updateTemplate(tenant: TenantDocument, id: string, data: any) {
    const template = await this.templateModel.findOneAndUpdate(
      { _id: id, tenantId: tenant._id },
      { $set: data },
      { new: true },
    );
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async removeTemplate(tenant: TenantDocument, id: string) {
    return this.templateModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
  }

  // ── Poster Generation ────────────────────────────────────────────

  async generatePoster(
    tenant: TenantDocument,
    templateId: string,
    fieldValues: Record<string, string>,
    userPhotoPath: string | null,
    userId?: string,
  ) {
    const template = await this.templateModel.findOne({ _id: templateId, tenantId: tenant._id, isActive: true });
    if (!template) throw new NotFoundException('Template not found');

    // Validate required fields
    for (const field of template.fields) {
      if (field.required && field.editable && !fieldValues[field.key] && !(field.key === 'photo' && userPhotoPath)) {
        throw new BadRequestException(`Field '${field.label}' is required`);
      }
    }

    // Output directory
    const outputDir = path.join(process.cwd(), 'uploads', tenant.slug, 'generated-posters');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputFilename = `poster-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`;
    const outputPath = path.join(outputDir, outputFilename);

    // Load base template image
    const templateImagePath = path.join(process.cwd(), template.templateImageUrl.replace(/^\//, ''));
    const baseImage = await loadImage(templateImagePath);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // Draw base template
    ctx.drawImage(baseImage, 0, 0);

    // Process each field
    for (const field of template.fields) {
      if (!field.editable || !field.position) continue;

      const pos = field.position;
      const x = (pos.x / 100) * baseImage.width;
      const y = (pos.y / 100) * baseImage.height;
      const w = (pos.width / 100) * baseImage.width;
      const h = (pos.height / 100) * baseImage.height;

      if (field.type === 'photo') {
        const photoSrc = field.key === 'photo' && userPhotoPath
          ? path.join(process.cwd(), userPhotoPath.replace(/^\//, ''))
          : null;

        if (photoSrc && fs.existsSync(photoSrc)) {
          const photo = await loadImage(photoSrc);
          // Clip to circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(photo, x, y, w, h);
          ctx.restore();
        }
      } else if (field.type === 'text') {
        const text = fieldValues[field.key] || field.defaultValue || '';
        if (!text) continue;

        const style = field.style || {};
        const fontSize = style.fontSize || 24;
        const fontColor = style.fontColor || '#ffffff';
        const fontWeight = style.fontWeight || 'bold';
        const textAlign = (style.textAlign as CanvasTextAlign) || 'center';

        ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';

        // Word wrap if text is long
        const words = text.split(' ');
        let line = '';
        let lineY = y + h / 2;
        const lineHeight = fontSize * 1.3;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > w && i > 0) {
            ctx.fillText(line.trim(), x + w / 2, lineY);
            line = words[i] + ' ';
            lineY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), x + w / 2, lineY);
      }
    }

    // Save output
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    const outputUrl = `/uploads/${tenant.slug}/generated-posters/${outputFilename}`;

    // Save record
    const record = await this.generatedModel.create({
      tenantId: tenant._id,
      templateId: template._id,
      ...(userId && { userId }),
      outputUrl,
      fieldValues,
    } as any);

    // Increment usage count
    await this.templateModel.updateOne({ _id: templateId }, { $inc: { usageCount: 1 } });

    return { outputUrl, recordId: (record as any)._id };
  }

  async getMyPosters(tenant: TenantDocument, userId: string) {
    return this.generatedModel
      .find({ tenantId: tenant._id, userId })
      .populate('templateId', 'title category')
      .sort({ createdAt: -1 })
      .limit(20);
  }
}

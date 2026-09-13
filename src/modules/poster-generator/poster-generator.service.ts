import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
let createCanvas: any;
let loadImage: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const canvasPkg = require('canvas');
  createCanvas = canvasPkg.createCanvas;
  loadImage = canvasPkg.loadImage;
} catch {
  // Native canvas binary blocked by Windows Application Control
}
import * as path from 'path';
import * as fs from 'fs';
import { PosterTemplate, PosterTemplateDocument } from './poster-template.schema';
import { GeneratedPoster, GeneratedPosterDocument } from './generated-poster.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { User, UserDocument } from '../users/user.schema';
import { BackgroundRemovalService } from './background-removal.service';
import {
  CreatePosterTemplateDto,
  UpdatePosterTemplateDto,
  QueryPosterTemplatesDto,
  GeneratePosterDto,
} from './poster.dto';

@Injectable()
export class PosterGeneratorService {
  private readonly logger = new Logger(PosterGeneratorService.name);
  private readonly seedingLocks = new Set<string>();

  constructor(
    @InjectModel(PosterTemplate.name) private templateModel: Model<PosterTemplateDocument>,
    @InjectModel(GeneratedPoster.name) private generatedModel: Model<GeneratedPosterDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly bgRemovalService: BackgroundRemovalService,
  ) {}

  private drawRoundedRect(
    ctx: any,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ══════════════════════════════════════════════════════════════
  // TEMPLATE AUTO-SEEDING & MANAGEMENT (SRS Sec 28)
  // ══════════════════════════════════════════════════════════════

  /**
   * Helper: Generate a high-resolution base canvas image for default templates
   */
  private async createBaseTemplateImage(
    tenantSlug: string,
    filename: string,
    width: number,
    height: number,
    theme: { title: string; subtitle: string; primary: string; secondary: string; dark: string },
  ): Promise<string> {
    const dir = path.join(process.cwd(), 'uploads', tenantSlug, 'poster-templates');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      return `/uploads/${tenantSlug}/poster-templates/${filename}`;
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, theme.dark);
    bgGrad.addColorStop(0.5, '#111827');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric shapes
    ctx.save();
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.15, width * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = theme.secondary;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(width * 0.1, height * 0.85, width * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Golden / Accent Top Stripe
    const stripe = ctx.createLinearGradient(0, 0, width, 0);
    stripe.addColorStop(0, theme.secondary);
    stripe.addColorStop(1, theme.primary);
    ctx.fillStyle = stripe;
    ctx.fillRect(0, 0, width, 14);

    // Header Title
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(width * 0.048)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(theme.title, width / 2, height * 0.05);

    // Subtitle
    ctx.fillStyle = theme.secondary;
    ctx.font = `bold ${Math.round(width * 0.026)}px sans-serif`;
    ctx.fillText(theme.subtitle, width / 2, height * 0.11);

    // Save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    return `/uploads/${tenantSlug}/poster-templates/${filename}`;
  }

  /**
   * Auto-seed ready-to-use templates for a tenant if none exist
   */
  async seedDefaultTemplatesIfEmpty(tenant: TenantDocument): Promise<void> {
    const tenantIdStr = tenant._id.toString();
    if (this.seedingLocks.has(tenantIdStr)) return;

    // If tenant has already been initialized, never re-seed even if templates were deleted by admin
    if ((tenant.settings as any)?.postersSeeded) return;

    this.seedingLocks.add(tenantIdStr);
    try {
      const count = await this.templateModel.countDocuments({ tenantId: tenant._id });
      if (count > 0) {
        await tenant.updateOne({ $set: { 'settings.postersSeeded': true } });
        return;
      }

      const primaryColor = tenant.branding?.primaryColor || '#1e3a8a';
      const secondaryColor = tenant.branding?.secondaryColor || '#f59e0b';

    // 1. Festival Greeting (Square 1080x1080)
    const festivalImg = await this.createBaseTemplateImage(
      tenant.slug,
      'festival_greeting_base.png',
      1080,
      1080,
      {
        title: 'पावन पर्व की हार्दिक शुभकामनाएं',
        subtitle: '★ समस्त क्षेत्रवासियों को हार्दिक बधाई एवं शुभकामनाएं ★',
        primary: primaryColor,
        secondary: secondaryColor,
        dark: '#451a03',
      },
    );

    // 2. Political Campaign (Portrait Feed 1080x1350)
    const campaignImg = await this.createBaseTemplateImage(
      tenant.slug,
      'campaign_feed_base.png',
      1080,
      1350,
      {
        title: 'जन संकल्प विजय अभियान',
        subtitle: 'विकास की नई राह • सशक्त नेतृत्व • सशक्त समाज',
        primary: primaryColor,
        secondary: secondaryColor,
        dark: '#0f172a',
      },
    );

    // 3. Congratulations (Square 1080x1080)
    const congratsImg = await this.createBaseTemplateImage(
      tenant.slug,
      'congratulations_base.png',
      1080,
      1080,
      {
        title: 'हार्दिक बधाई एवं मंगलकामनाएं',
        subtitle: 'उज्ज्वल भविष्य एवं निरंतर प्रगति की कामना सहित',
        primary: primaryColor,
        secondary: secondaryColor,
        dark: '#1e1b4b',
      },
    );

    // 4. National Day Story (Status/Story 1080x1920)
    const storyImg = await this.createBaseTemplateImage(
      tenant.slug,
      'national_day_story_base.png',
      1080,
      1920,
      {
        title: 'राष्ट्रीय पर्व पर कोटि-कोटि नमन',
        subtitle: 'जय हिन्द • वन्दे मातरम्',
        primary: primaryColor,
        secondary: secondaryColor,
        dark: '#064e3b',
      },
    );

    const defaultTemplates = [
      {
        tenantId: tenant._id,
        title: 'पावन पर्व शुभकामना पोस्टर (Festival Greeting)',
        category: 'Festival',
        description: 'त्योहारों और विशेष अवसरों पर अपनी फोटो और पद के साथ आकर्षक बधाई संदेश तैयार करें।',
        templateImageUrl: festivalImg,
        thumbnailUrl: festivalImg,
        width: 1080,
        height: 1080,
        dimensionPreset: '1080x1080',
        includeTenantBranding: true,
        tags: ['festival', 'greeting', 'social-post', 'diwali', 'holi'],
        sortOrder: 1,
        fields: [
          {
            key: 'photo',
            label: 'आपकी फोटो (Photo)',
            type: 'photo',
            editable: true,
            required: true,
            position: { x: 8, y: 55, width: 34, height: 38 },
            style: { maskShape: 'circle' },
          },
          {
            key: 'name',
            label: 'नाम (Full Name)',
            type: 'text',
            editable: true,
            required: true,
            defaultValue: 'नागरिक / कार्यकर्ता',
            position: { x: 45, y: 72, width: 50, height: 8 },
            style: { fontSize: 36, fontColor: '#ffffff', fontWeight: 'bold', textAlign: 'left' },
          },
          {
            key: 'designation',
            label: 'पद / दायित्व (Designation)',
            type: 'text',
            editable: true,
            required: false,
            defaultValue: 'सक्रिय सदस्य / Active Worker',
            position: { x: 45, y: 81, width: 50, height: 6 },
            style: { fontSize: 24, fontColor: '#fbbf24', fontWeight: 'bold', textAlign: 'left' },
          },
          {
            key: 'area',
            label: 'विधानसभा / वार्ड (Area)',
            type: 'text',
            editable: true,
            required: false,
            defaultValue: 'विधानसभा क्षेत्र',
            position: { x: 45, y: 88, width: 50, height: 6 },
            style: { fontSize: 20, fontColor: '#94a3b8', fontWeight: 'normal', textAlign: 'left' },
          },
        ],
      },
      {
        tenantId: tenant._id,
        title: 'जन संकल्प विजय अभियान (Campaign Portrait Feed)',
        category: 'Political Campaign',
        description: 'राजनीतिक अभियान और जनसंपर्क के लिए उच्च-गुणवत्ता 4:5 पोर्ट्रेट सोशल मीडिया पोस्टर।',
        templateImageUrl: campaignImg,
        thumbnailUrl: campaignImg,
        width: 1080,
        height: 1350,
        dimensionPreset: '1080x1350',
        includeTenantBranding: true,
        tags: ['campaign', 'feed', 'rally', 'election'],
        sortOrder: 2,
        fields: [
          {
            key: 'photo',
            label: 'आपकी फोटो (Photo)',
            type: 'photo',
            editable: true,
            required: true,
            position: { x: 8, y: 60, width: 32, height: 32 },
            style: { maskShape: 'rounded' },
          },
          {
            key: 'name',
            label: 'नाम (Full Name)',
            type: 'text',
            editable: true,
            required: true,
            defaultValue: 'पार्टी कार्यकर्ता',
            position: { x: 44, y: 75, width: 52, height: 7 },
            style: { fontSize: 36, fontColor: '#ffffff', fontWeight: 'bold', textAlign: 'left' },
          },
          {
            key: 'designation',
            label: 'पद / दायित्व (Designation)',
            type: 'text',
            editable: true,
            required: false,
            defaultValue: 'मंडल संयोजक',
            position: { x: 44, y: 83, width: 52, height: 6 },
            style: { fontSize: 24, fontColor: '#38bdf8', fontWeight: 'bold', textAlign: 'left' },
          },
          {
            key: 'area',
            label: 'क्षेत्र (Area)',
            type: 'text',
            editable: true,
            required: false,
            defaultValue: 'वार्ड क्र. 12',
            position: { x: 44, y: 90, width: 52, height: 5 },
            style: { fontSize: 20, fontColor: '#cbd5e1', fontWeight: 'normal', textAlign: 'left' },
          },
        ],
      },
      {
        tenantId: tenant._id,
        title: 'हार्दिक बधाई एवं शुभकामनाएं (Congratulations Banner)',
        category: 'Congratulations',
        description: 'विशेष उपलब्धि, जन्मदिन या पदभार ग्रहण पर बधाई संदेश बनाने हेतु वर्गकार पोस्टर।',
        templateImageUrl: congratsImg,
        thumbnailUrl: congratsImg,
        width: 1080,
        height: 1080,
        dimensionPreset: '1080x1080',
        includeTenantBranding: true,
        tags: ['congratulations', 'birthday', 'achievement'],
        sortOrder: 3,
        fields: [
          {
            key: 'photo',
            label: 'आपकी फोटो (Photo)',
            type: 'photo',
            editable: true,
            required: true,
            position: { x: 10, y: 55, width: 32, height: 38 },
            style: { maskShape: 'circle' },
          },
          {
            key: 'name',
            label: 'नाम (Full Name)',
            type: 'text',
            editable: true,
            required: true,
            defaultValue: 'नागरिक',
            position: { x: 46, y: 73, width: 50, height: 8 },
            style: { fontSize: 36, fontColor: '#ffffff', fontWeight: 'bold', textAlign: 'left' },
          },
          {
            key: 'designation',
            label: 'पद / दायित्व (Designation)',
            type: 'text',
            editable: true,
            required: false,
            defaultValue: 'शुभचिंतक',
            position: { x: 46, y: 82, width: 50, height: 6 },
            style: { fontSize: 24, fontColor: '#f43f5e', fontWeight: 'bold', textAlign: 'left' },
          },
        ],
      },
      {
        tenantId: tenant._id,
        title: 'राष्ट्रीय पर्व स्टेटस/स्टोरी पोस्टर (Story / WhatsApp Status)',
        category: 'National Day',
        description: '9:16 अनुपात में WhatsApp Status और Instagram Story के लिए आदर्श लंबवत पोस्टर।',
        templateImageUrl: storyImg,
        thumbnailUrl: storyImg,
        width: 1080,
        height: 1920,
        dimensionPreset: '1080x1920',
        includeTenantBranding: true,
        tags: ['story', 'status', 'national-day', 'republic-day', 'independence-day'],
        sortOrder: 4,
        fields: [
          {
            key: 'photo',
            label: 'आपकी फोटो (Photo)',
            type: 'photo',
            editable: true,
            required: true,
            position: { x: 12, y: 72, width: 28, height: 18 },
            style: { maskShape: 'circle' },
          },
          {
            key: 'name',
            label: 'नाम (Full Name)',
            type: 'text',
            editable: true,
            required: true,
            defaultValue: 'देशभक्त नागरिक',
            position: { x: 44, y: 80, width: 50, height: 5 },
            style: { fontSize: 36, fontColor: '#ffffff', fontWeight: 'bold', textAlign: 'left' },
          },
          {
            key: 'designation',
            label: 'पद (Designation)',
            type: 'text',
            editable: true,
            required: false,
            defaultValue: 'राष्ट्रसेवी कार्यकर्ता',
            position: { x: 44, y: 86, width: 50, height: 4 },
            style: { fontSize: 24, fontColor: '#10b981', fontWeight: 'bold', textAlign: 'left' },
          },
        ],
      },
    ];

      await this.templateModel.insertMany(defaultTemplates);
      await tenant.updateOne({ $set: { 'settings.postersSeeded': true } });
      this.logger.log(`Successfully seeded ${defaultTemplates.length} default poster templates for tenant ${tenant.slug}`);
    } finally {
      this.seedingLocks.delete(tenantIdStr);
    }
  }

  /**
   * 1. Create a new template (Admin)
   */
  async createTemplate(
    tenant: TenantDocument,
    dto: CreatePosterTemplateDto,
    uploadedFile?: Express.Multer.File,
  ) {
    let imageUrl = dto.templateImageUrl;

    if (uploadedFile) {
      imageUrl = `/uploads/${tenant.slug}/poster-templates/${uploadedFile.filename}`;
    }

    if (!imageUrl) {
      throw new BadRequestException('Template image file or templateImageUrl is required');
    }

    // Determine dimensions from preset if provided
    let width = dto.width || 1080;
    let height = dto.height || 1080;
    if (dto.dimensionPreset === '1080x1350') {
      width = 1080;
      height = 1350;
    } else if (dto.dimensionPreset === '1080x1920') {
      width = 1080;
      height = 1920;
    }

    return this.templateModel.create({
      tenantId: tenant._id,
      title: dto.title.trim(),
      category: dto.category.trim(),
      description: dto.description || '',
      templateImageUrl: imageUrl,
      thumbnailUrl: dto.thumbnailUrl || imageUrl,
      width,
      height,
      dimensionPreset: dto.dimensionPreset || '1080x1080',
      fields: dto.fields || [
        {
          key: 'photo',
          label: 'User Photo',
          type: 'photo',
          editable: true,
          required: true,
          position: { x: 10, y: 60, width: 30, height: 30 },
          style: { maskShape: 'circle' },
        },
        {
          key: 'name',
          label: 'Full Name',
          type: 'text',
          editable: true,
          required: true,
          position: { x: 45, y: 75, width: 50, height: 8 },
          style: { fontSize: 36, fontColor: '#ffffff', fontWeight: 'bold', textAlign: 'left' },
        },
        {
          key: 'designation',
          label: 'Designation',
          type: 'text',
          editable: true,
          required: false,
          position: { x: 45, y: 84, width: 50, height: 6 },
          style: { fontSize: 24, fontColor: '#fbbf24', textAlign: 'left' },
        },
      ],
      includeTenantBranding: dto.includeTenantBranding !== undefined ? dto.includeTenantBranding : true,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      tags: dto.tags || [],
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      sortOrder: dto.sortOrder || 0,
    });
  }

  /**
   * 2. List all templates (Public: active & unexpired; Admin: all)
   */
  async getTemplates(tenant: TenantDocument, query: QueryPosterTemplatesDto, isAdmin = false) {
    await this.seedDefaultTemplatesIfEmpty(tenant);

    const filter: any = { tenantId: tenant._id };

    if (!isAdmin) {
      filter.isActive = true;
      if (!query.includeExpired) {
        filter.$or = [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }];
      }
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.preset) {
      filter.dimensionPreset = query.preset;
    }

    if (query.search && query.search.trim()) {
      filter.$or = [
        { title: { $regex: query.search.trim(), $options: 'i' } },
        { category: { $regex: query.search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(query.search.trim(), 'i')] } },
      ];
    }

    return this.templateModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  /**
   * 3. Get all unique template categories
   */
  async getTemplateCategories(tenant: TenantDocument) {
    return this.templateModel.distinct('category', { tenantId: tenant._id, isActive: true });
  }

  /**
   * 4. Get single template detail
   */
  async getTemplate(tenant: TenantDocument, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid template ID');
    let template = await this.templateModel.findOne({
      _id: new Types.ObjectId(id),
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    });
    if (!template) {
      template = await this.templateModel.findOne({
        _id: id,
        $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
      });
    }
    if (!template) throw new NotFoundException(`Poster template #${id} not found`);
    return template;
  }

  /**
   * 5. Update template (Admin)
   */
  async updateTemplate(
    tenant: TenantDocument,
    id: string,
    dto: UpdatePosterTemplateDto,
    uploadedFile?: Express.Multer.File,
  ) {
    const template = await this.getTemplate(tenant, id);

    if (dto.title !== undefined) template.title = dto.title.trim();
    if (dto.category !== undefined) template.category = dto.category.trim();
    if (dto.description !== undefined) template.description = dto.description;
    if (dto.width !== undefined) template.width = dto.width;
    if (dto.height !== undefined) template.height = dto.height;
    if (dto.dimensionPreset !== undefined) template.dimensionPreset = dto.dimensionPreset;
    if (dto.fields !== undefined) template.fields = dto.fields as any;
    if (dto.includeTenantBranding !== undefined) template.includeTenantBranding = dto.includeTenantBranding;
    if (dto.expiresAt !== undefined) template.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    if (dto.tags !== undefined) template.tags = dto.tags;
    if (dto.isActive !== undefined) template.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) template.sortOrder = dto.sortOrder;

    if (uploadedFile) {
      template.templateImageUrl = `/uploads/${tenant.slug}/poster-templates/${uploadedFile.filename}`;
      template.thumbnailUrl = template.templateImageUrl;
    } else if (dto.templateImageUrl) {
      template.templateImageUrl = dto.templateImageUrl;
    }

    return template.save();
  }

  /**
   * 6. Remove template (Admin)
   */
  async removeTemplate(tenant: TenantDocument, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid template ID');
    const template = await this.templateModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    });
    if (!template) throw new NotFoundException(`Poster template #${id} not found`);
    return { message: `Template #${id} deleted successfully.` };
  }

  // ══════════════════════════════════════════════════════════════
  // BACKGROUND REMOVAL (SRS Sec 29)
  // ══════════════════════════════════════════════════════════════

  /**
   * Process photo and generate transparent subject cutout
   */
  async removeBackground(tenant: TenantDocument, photoPath: string) {
    return this.bgRemovalService.removeBackground(tenant.slug, photoPath);
  }

  // ══════════════════════════════════════════════════════════════
  // POSTER GENERATION ENGINE (SRS Sec 27 & 30)
  // ══════════════════════════════════════════════════════════════

  /**
   * Generate personalized promotional social banner
   */
  async generatePoster(
    tenant: TenantDocument,
    templateId: string,
    fieldValues: Record<string, string>,
    userPhotoPath: string | null,
    dto: GeneratePosterDto = {},
    userId?: string,
  ) {
    if (!Types.ObjectId.isValid(templateId)) {
      throw new BadRequestException('Invalid template ID');
    }

    const template = await this.templateModel.findOne({
      _id: new Types.ObjectId(templateId),
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
      isActive: true,
    });
    if (!template) {
      throw new NotFoundException(`Poster template #${templateId} not found or inactive`);
    }

    // Check expiry
    if (template.expiresAt && new Date(template.expiresAt) < new Date()) {
      throw new BadRequestException('This template has expired and can no longer be used');
    }

    // 1. Resolve photo source and optional background removal (SRS Sec 29)
    let finalPhotoPath = userPhotoPath || dto.photoUrl || null;

    if (finalPhotoPath && dto.removeBg) {
      try {
        const cutout = await this.bgRemovalService.removeBackground(tenant.slug, finalPhotoPath);
        finalPhotoPath = cutout.cutoutUrl;
      } catch (err: any) {
        this.logger.warn(`Auto background removal skipped: ${err.message}`);
      }
    }

    // Validate required fields
    for (const field of template.fields) {
      if (field.required && field.editable) {
        if (field.type === 'photo' && !finalPhotoPath) {
          throw new BadRequestException(`Field '${field.label}' (photo) is required`);
        }
        if (field.type === 'text' && !fieldValues[field.key] && !field.defaultValue) {
          throw new BadRequestException(`Field '${field.label}' is required`);
        }
      }
    }

    // Output directory setup
    const outputDir = path.join(process.cwd(), 'uploads', tenant.slug, 'generated-posters');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const format = (dto.format === 'jpg' || dto.format === 'jpeg') ? 'jpg' : 'png';
    const outputFilename = `banner-${Date.now()}-${Math.round(Math.random() * 1e6)}.${format}`;
    const outputPath = path.join(outputDir, outputFilename);

    // 2. Load base template image
    const cleanTmpl = template.templateImageUrl.replace(/^[\\\/]+/, '').replace(/\//g, path.sep);
    const templateImagePath = (template.templateImageUrl.includes(':') && path.isAbsolute(template.templateImageUrl))
      ? template.templateImageUrl
      : path.join(process.cwd(), cleanTmpl);

    let baseImage: any;
    if (fs.existsSync(templateImagePath)) {
      baseImage = await loadImage(templateImagePath);
    } else {
      // Graceful fallback: dynamically generate base template canvas image
      const fallbackUrl = await this.createBaseTemplateImage(
        tenant.slug,
        `base_${template._id}.png`,
        template.width || 1080,
        template.height || 1080,
        {
          title: template.title,
          subtitle: `★ ${template.category.toUpperCase()} • ${tenant.name.toUpperCase()} ★`,
          primary: tenant.branding?.primaryColor || '#1e3a8a',
          secondary: tenant.branding?.secondaryColor || '#f59e0b',
          dark: '#0f172a',
        },
      );
      template.templateImageUrl = fallbackUrl;
      await template.save();
      const fbPath = path.join(process.cwd(), fallbackUrl.replace(/^\//, ''));
      baseImage = await loadImage(fbPath);
    }

    const canvasWidth = template.width || baseImage.width;
    const canvasHeight = template.height || baseImage.height;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Draw base template scaled to canvas dimensions
    ctx.drawImage(baseImage, 0, 0, canvasWidth, canvasHeight);

    // 3. Process fields
    for (const field of template.fields) {
      if (!field.position) continue;

      const pos = field.position;
      const x = (pos.x / 100) * canvasWidth;
      const y = (pos.y / 100) * canvasHeight;
      const w = (pos.width / 100) * canvasWidth;
      const h = (pos.height / 100) * canvasHeight;

      if (field.type === 'photo') {
        const cleanPhoto = finalPhotoPath ? finalPhotoPath.replace(/^[\\\/]+/, '').replace(/\//g, path.sep) : '';
        const photoSrc = (finalPhotoPath && finalPhotoPath.includes(':') && path.isAbsolute(finalPhotoPath))
          ? finalPhotoPath
          : (finalPhotoPath ? path.join(process.cwd(), cleanPhoto) : null);

        if (photoSrc && fs.existsSync(photoSrc)) {
          const photo = await loadImage(photoSrc);
          const maskShape = field.style?.maskShape || 'circle';

          ctx.save();
          if (maskShape === 'circle') {
            const radius = Math.min(w, h) / 2;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(photo, x, y, w, h);

            // Ring border
            ctx.strokeStyle = tenant.branding?.secondaryColor || '#fbbf24';
            ctx.lineWidth = Math.max(2, Math.round(canvasWidth * 0.004));
            ctx.stroke();
          } else if (maskShape === 'rounded') {
            this.drawRoundedRect(ctx, x, y, w, h, 18);
            ctx.clip();
            ctx.drawImage(photo, x, y, w, h);
            ctx.strokeStyle = tenant.branding?.secondaryColor || '#fbbf24';
            ctx.lineWidth = Math.max(2, Math.round(canvasWidth * 0.003));
            ctx.stroke();
          } else {
            ctx.drawImage(photo, x, y, w, h);
          }
          ctx.restore();
        }
      } else if (field.type === 'text') {
        const text = fieldValues[field.key] || field.defaultValue || '';
        if (!text) continue;

        const style = field.style || {};
        const fontSize = style.fontSize || Math.round(canvasWidth * 0.03);
        const fontColor = style.fontColor || '#ffffff';
        const fontWeight = style.fontWeight || 'bold';
        const textAlign = (style.textAlign as CanvasTextAlign) || 'center';

        ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';

        // Word wrap within bounding width
        const words = text.split(' ');
        let line = '';
        let lineY = y + h / 2;
        const lineHeight = fontSize * 1.3;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > w && i > 0) {
            ctx.fillText(line.trim(), textAlign === 'left' ? x : textAlign === 'right' ? x + w : x + w / 2, lineY);
            line = words[i] + ' ';
            lineY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), textAlign === 'left' ? x : textAlign === 'right' ? x + w : x + w / 2, lineY);
      }
    }

    // 4. Optional Tenant Branding Watermark / Footer Overlay (SRS Sec 30)
    if (template.includeTenantBranding && dto.includeBranding !== false) {
      ctx.save();
      const footerH = Math.round(canvasHeight * 0.05);
      const footerY = canvasHeight - footerH;

      ctx.fillStyle = 'rgba(7, 13, 30, 0.75)';
      ctx.fillRect(0, footerY, canvasWidth, footerH);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, footerY);
      ctx.lineTo(canvasWidth, footerY);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold ${Math.round(canvasWidth * 0.016)}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const brandText = tenant.branding?.leaderName
        ? `${tenant.name} • नेतृत्व: ${tenant.branding.leaderName}`
        : `${tenant.name} Official Platform`;
      ctx.fillText(brandText, canvasWidth * 0.03, footerY + footerH / 2);

      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'right';
      ctx.fillText(tenant.customDomain || `${tenant.slug}.platform`, canvasWidth * 0.97, footerY + footerH / 2);
      ctx.restore();
    }

    // 5. Output Buffer
    const buffer = format === 'jpg'
      ? canvas.toBuffer('image/jpeg', { quality: 0.92 })
      : canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    const outputUrl = `/uploads/${tenant.slug}/generated-posters/${outputFilename}`;
    const downloadUrl = `/poster-generator/download/`;

    // 6. Sharing Metadata (SRS Sec 27)
    const envBase = process.env.APP_URL || process.env.API_BASE_URL || process.env.BASE_URL || process.env.FRONTEND_URL;
    let fullBannerUrl = '';
    if (tenant.customDomain) {
      const proto = tenant.customDomain.includes('localhost') ? 'http' : 'https';
      fullBannerUrl = `${proto}://${tenant.customDomain}${outputUrl}`;
    } else if (envBase) {
      const cleanBase = envBase.replace(/\/+$/, '');
      const protoBase = cleanBase.startsWith('http') ? cleanBase : `https://${cleanBase}`;
      fullBannerUrl = `${protoBase}${outputUrl}`;
    } else {
      const port = process.env.PORT || 3001;
      fullBannerUrl = `http://${tenant.slug}.localhost:${port}${outputUrl}`;
    }
    const personName = fieldValues['name'] || 'Citizen';
    const shareText = `Check out my official poster for ${template.title} by ${tenant.name}! Create your own personalized banner here: ${fullBannerUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    // 7. Save record
    const record = await this.generatedModel.create({
      tenantId: tenant._id,
      templateId: template._id,
      ...(userId && Types.ObjectId.isValid(userId) && { userId: new Types.ObjectId(userId) }),
      outputUrl,
      format,
      width: canvasWidth,
      height: canvasHeight,
      downloadUrl: `${downloadUrl}`,
      shareText,
      userPhotoUrl: finalPhotoPath || undefined,
      fieldValues,
    });

    // Update download URL with real ID
    record.downloadUrl = `/poster-generator/download/${record._id}`;
    await record.save();

    // Increment usage count
    await this.templateModel.updateOne({ _id: template._id }, { $inc: { usageCount: 1 } });

    return {
      recordId: record._id,
      outputUrl,
      downloadUrl: record.downloadUrl,
      format,
      dimensions: { width: canvasWidth, height: canvasHeight, preset: template.dimensionPreset },
      template: { id: template._id, title: template.title, category: template.category },
      shareData: {
        title: template.title,
        text: shareText,
        bannerUrl: fullBannerUrl,
        whatsappUrl,
        downloadUrl: record.downloadUrl,
      },
    };
  }

  /**
   * 8. Direct binary file path resolver for download endpoint
   */
  async getPosterFilePath(tenant: TenantDocument, id: string): Promise<{ filePath: string; filename: string }> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid poster ID');
    const record = await this.generatedModel.findOne({
      _id: new Types.ObjectId(id),
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    });
    if (!record) throw new NotFoundException(`Poster #${id} not found`);

    const cleanRel = record.outputUrl.replace(/^[\\\/]+/, '').replace(/\//g, path.sep);
    const fullPath = (record.outputUrl.includes(':') && path.isAbsolute(record.outputUrl))
      ? record.outputUrl
      : path.join(process.cwd(), cleanRel);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`Generated poster image file missing on server: ${fullPath}`);
    }

    return { filePath: fullPath, filename: path.basename(fullPath) };
  }

  /**
   * 9. Get user's own generated posters
   */
  async getMyPosters(tenant: TenantDocument, userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user ID');
    return this.generatedModel
      .find({ tenantId: tenant._id, userId: new Types.ObjectId(userId) })
      .populate('templateId', 'title category dimensionPreset')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
  }

  /**
   * 10. Admin view of all generated posters with statistics
   */
  async adminGetAllPosters(tenant: TenantDocument, query: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));

    const filter: any = { tenantId: tenant._id };

    const [data, total, totalTemplates] = await Promise.all([
      this.generatedModel
        .find(filter)
        .populate('templateId', 'title category dimensionPreset')
        .populate('userId', 'name mobile')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.generatedModel.countDocuments(filter),
      this.templateModel.countDocuments({ tenantId: tenant._id }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      summary: {
        totalGenerated: total,
        totalTemplates,
      },
    };
  }

  /**
   * 11. Admin delete generated poster
   */
  async adminDeletePoster(tenant: TenantDocument, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid poster ID');
    const poster = await this.generatedModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      $or: [{ tenantId: tenant._id }, { tenantId: tenant._id.toString() }],
    });
    if (!poster) throw new NotFoundException(`Poster #${id} not found`);

    const fullPath = path.join(process.cwd(), poster.outputUrl.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (e) {}
    }

    return { message: `Generated poster #${id} deleted successfully.` };
  }
}

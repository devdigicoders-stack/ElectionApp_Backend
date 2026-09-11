"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PosterGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosterGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let createCanvas;
let loadImage;
try {
    const canvasPkg = require('canvas');
    createCanvas = canvasPkg.createCanvas;
    loadImage = canvasPkg.loadImage;
}
catch {
}
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const poster_template_schema_1 = require("./poster-template.schema");
const generated_poster_schema_1 = require("./generated-poster.schema");
const user_schema_1 = require("../users/user.schema");
const background_removal_service_1 = require("./background-removal.service");
let PosterGeneratorService = PosterGeneratorService_1 = class PosterGeneratorService {
    constructor(templateModel, generatedModel, userModel, bgRemovalService) {
        this.templateModel = templateModel;
        this.generatedModel = generatedModel;
        this.userModel = userModel;
        this.bgRemovalService = bgRemovalService;
        this.logger = new common_1.Logger(PosterGeneratorService_1.name);
    }
    drawRoundedRect(ctx, x, y, w, h, r) {
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
    async createBaseTemplateImage(tenantSlug, filename, width, height, theme) {
        const dir = path.join(process.cwd(), 'uploads', tenantSlug, 'poster-templates');
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        const filePath = path.join(dir, filename);
        if (fs.existsSync(filePath)) {
            return `/uploads/${tenantSlug}/poster-templates/${filename}`;
        }
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, theme.dark);
        bgGrad.addColorStop(0.5, '#111827');
        bgGrad.addColorStop(1, '#030712');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
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
        const stripe = ctx.createLinearGradient(0, 0, width, 0);
        stripe.addColorStop(0, theme.secondary);
        stripe.addColorStop(1, theme.primary);
        ctx.fillStyle = stripe;
        ctx.fillRect(0, 0, width, 14);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(width * 0.048)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(theme.title, width / 2, height * 0.05);
        ctx.fillStyle = theme.secondary;
        ctx.font = `bold ${Math.round(width * 0.026)}px sans-serif`;
        ctx.fillText(theme.subtitle, width / 2, height * 0.11);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${tenantSlug}/poster-templates/${filename}`;
    }
    async seedDefaultTemplatesIfEmpty(tenant) {
        const count = await this.templateModel.countDocuments({ tenantId: tenant._id });
        if (count > 0)
            return;
        const primaryColor = tenant.branding?.primaryColor || '#1e3a8a';
        const secondaryColor = tenant.branding?.secondaryColor || '#f59e0b';
        const festivalImg = await this.createBaseTemplateImage(tenant.slug, 'festival_greeting_base.png', 1080, 1080, {
            title: 'पावन पर्व की हार्दिक शुभकामनाएं',
            subtitle: '★ समस्त क्षेत्रवासियों को हार्दिक बधाई एवं शुभकामनाएं ★',
            primary: primaryColor,
            secondary: secondaryColor,
            dark: '#451a03',
        });
        const campaignImg = await this.createBaseTemplateImage(tenant.slug, 'campaign_feed_base.png', 1080, 1350, {
            title: 'जन संकल्प विजय अभियान',
            subtitle: 'विकास की नई राह • सशक्त नेतृत्व • सशक्त समाज',
            primary: primaryColor,
            secondary: secondaryColor,
            dark: '#0f172a',
        });
        const congratsImg = await this.createBaseTemplateImage(tenant.slug, 'congratulations_base.png', 1080, 1080, {
            title: 'हार्दिक बधाई एवं मंगलकामनाएं',
            subtitle: 'उज्ज्वल भविष्य एवं निरंतर प्रगति की कामना सहित',
            primary: primaryColor,
            secondary: secondaryColor,
            dark: '#1e1b4b',
        });
        const storyImg = await this.createBaseTemplateImage(tenant.slug, 'national_day_story_base.png', 1080, 1920, {
            title: 'राष्ट्रीय पर्व पर कोटि-कोटि नमन',
            subtitle: 'जय हिन्द • वन्दे मातरम्',
            primary: primaryColor,
            secondary: secondaryColor,
            dark: '#064e3b',
        });
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
        this.logger.log(`Successfully seeded ${defaultTemplates.length} default poster templates for tenant ${tenant.slug}`);
    }
    async createTemplate(tenant, dto, uploadedFile) {
        let imageUrl = dto.templateImageUrl;
        if (uploadedFile) {
            imageUrl = `/uploads/${tenant.slug}/poster-templates/${uploadedFile.filename}`;
        }
        if (!imageUrl) {
            throw new common_1.BadRequestException('Template image file or templateImageUrl is required');
        }
        let width = dto.width || 1080;
        let height = dto.height || 1080;
        if (dto.dimensionPreset === '1080x1350') {
            width = 1080;
            height = 1350;
        }
        else if (dto.dimensionPreset === '1080x1920') {
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
    async getTemplates(tenant, query, isAdmin = false) {
        await this.seedDefaultTemplatesIfEmpty(tenant);
        const filter = { tenantId: tenant._id };
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
    async getTemplateCategories(tenant) {
        await this.seedDefaultTemplatesIfEmpty(tenant);
        return this.templateModel.distinct('category', { tenantId: tenant._id, isActive: true });
    }
    async getTemplate(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid template ID');
        const template = await this.templateModel.findOne({ _id: id, tenantId: tenant._id });
        if (!template)
            throw new common_1.NotFoundException(`Poster template #${id} not found`);
        return template;
    }
    async updateTemplate(tenant, id, dto, uploadedFile) {
        const template = await this.getTemplate(tenant, id);
        if (dto.title !== undefined)
            template.title = dto.title.trim();
        if (dto.category !== undefined)
            template.category = dto.category.trim();
        if (dto.description !== undefined)
            template.description = dto.description;
        if (dto.width !== undefined)
            template.width = dto.width;
        if (dto.height !== undefined)
            template.height = dto.height;
        if (dto.dimensionPreset !== undefined)
            template.dimensionPreset = dto.dimensionPreset;
        if (dto.fields !== undefined)
            template.fields = dto.fields;
        if (dto.includeTenantBranding !== undefined)
            template.includeTenantBranding = dto.includeTenantBranding;
        if (dto.expiresAt !== undefined)
            template.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
        if (dto.tags !== undefined)
            template.tags = dto.tags;
        if (dto.isActive !== undefined)
            template.isActive = dto.isActive;
        if (dto.sortOrder !== undefined)
            template.sortOrder = dto.sortOrder;
        if (uploadedFile) {
            template.templateImageUrl = `/uploads/${tenant.slug}/poster-templates/${uploadedFile.filename}`;
            template.thumbnailUrl = template.templateImageUrl;
        }
        else if (dto.templateImageUrl) {
            template.templateImageUrl = dto.templateImageUrl;
        }
        return template.save();
    }
    async removeTemplate(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid template ID');
        const template = await this.templateModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
        if (!template)
            throw new common_1.NotFoundException(`Poster template #${id} not found`);
        return { message: `Template #${id} deleted successfully.` };
    }
    async removeBackground(tenant, photoPath) {
        return this.bgRemovalService.removeBackground(tenant.slug, photoPath);
    }
    async generatePoster(tenant, templateId, fieldValues, userPhotoPath, dto = {}, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(templateId)) {
            throw new common_1.BadRequestException('Invalid template ID');
        }
        const template = await this.templateModel.findOne({
            _id: templateId,
            tenantId: tenant._id,
            isActive: true,
        });
        if (!template) {
            throw new common_1.NotFoundException(`Poster template #${templateId} not found or inactive`);
        }
        if (template.expiresAt && new Date(template.expiresAt) < new Date()) {
            throw new common_1.BadRequestException('This template has expired and can no longer be used');
        }
        let finalPhotoPath = userPhotoPath || dto.photoUrl || null;
        if (finalPhotoPath && dto.removeBg) {
            try {
                const cutout = await this.bgRemovalService.removeBackground(tenant.slug, finalPhotoPath);
                finalPhotoPath = cutout.cutoutUrl;
            }
            catch (err) {
                this.logger.warn(`Auto background removal skipped: ${err.message}`);
            }
        }
        for (const field of template.fields) {
            if (field.required && field.editable) {
                if (field.type === 'photo' && !finalPhotoPath) {
                    throw new common_1.BadRequestException(`Field '${field.label}' (photo) is required`);
                }
                if (field.type === 'text' && !fieldValues[field.key] && !field.defaultValue) {
                    throw new common_1.BadRequestException(`Field '${field.label}' is required`);
                }
            }
        }
        const outputDir = path.join(process.cwd(), 'uploads', tenant.slug, 'generated-posters');
        if (!fs.existsSync(outputDir))
            fs.mkdirSync(outputDir, { recursive: true });
        const format = (dto.format === 'jpg' || dto.format === 'jpeg') ? 'jpg' : 'png';
        const outputFilename = `banner-${Date.now()}-${Math.round(Math.random() * 1e6)}.${format}`;
        const outputPath = path.join(outputDir, outputFilename);
        const cleanTmpl = template.templateImageUrl.replace(/^[\\\/]+/, '').replace(/\//g, path.sep);
        const templateImagePath = (template.templateImageUrl.includes(':') && path.isAbsolute(template.templateImageUrl))
            ? template.templateImageUrl
            : path.join(process.cwd(), cleanTmpl);
        let baseImage;
        if (fs.existsSync(templateImagePath)) {
            baseImage = await loadImage(templateImagePath);
        }
        else {
            const fallbackUrl = await this.createBaseTemplateImage(tenant.slug, `base_${template._id}.png`, template.width || 1080, template.height || 1080, {
                title: template.title,
                subtitle: `★ ${template.category.toUpperCase()} • ${tenant.name.toUpperCase()} ★`,
                primary: tenant.branding?.primaryColor || '#1e3a8a',
                secondary: tenant.branding?.secondaryColor || '#f59e0b',
                dark: '#0f172a',
            });
            template.templateImageUrl = fallbackUrl;
            await template.save();
            const fbPath = path.join(process.cwd(), fallbackUrl.replace(/^\//, ''));
            baseImage = await loadImage(fbPath);
        }
        const canvasWidth = template.width || baseImage.width;
        const canvasHeight = template.height || baseImage.height;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImage, 0, 0, canvasWidth, canvasHeight);
        for (const field of template.fields) {
            if (!field.position)
                continue;
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
                        ctx.strokeStyle = tenant.branding?.secondaryColor || '#fbbf24';
                        ctx.lineWidth = Math.max(2, Math.round(canvasWidth * 0.004));
                        ctx.stroke();
                    }
                    else if (maskShape === 'rounded') {
                        this.drawRoundedRect(ctx, x, y, w, h, 18);
                        ctx.clip();
                        ctx.drawImage(photo, x, y, w, h);
                        ctx.strokeStyle = tenant.branding?.secondaryColor || '#fbbf24';
                        ctx.lineWidth = Math.max(2, Math.round(canvasWidth * 0.003));
                        ctx.stroke();
                    }
                    else {
                        ctx.drawImage(photo, x, y, w, h);
                    }
                    ctx.restore();
                }
            }
            else if (field.type === 'text') {
                const text = fieldValues[field.key] || field.defaultValue || '';
                if (!text)
                    continue;
                const style = field.style || {};
                const fontSize = style.fontSize || Math.round(canvasWidth * 0.03);
                const fontColor = style.fontColor || '#ffffff';
                const fontWeight = style.fontWeight || 'bold';
                const textAlign = style.textAlign || 'center';
                ctx.font = `${fontWeight} ${fontSize}px sans-serif`;
                ctx.fillStyle = fontColor;
                ctx.textAlign = textAlign;
                ctx.textBaseline = 'middle';
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
                    }
                    else {
                        line = testLine;
                    }
                }
                ctx.fillText(line.trim(), textAlign === 'left' ? x : textAlign === 'right' ? x + w : x + w / 2, lineY);
            }
        }
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
        const buffer = format === 'jpg'
            ? canvas.toBuffer('image/jpeg', { quality: 0.92 })
            : canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        const outputUrl = `/uploads/${tenant.slug}/generated-posters/${outputFilename}`;
        const downloadUrl = `/poster-generator/download/`;
        const domain = tenant.customDomain || `${tenant.slug}.localhost:3001`;
        const fullBannerUrl = `http://${domain}${outputUrl}`;
        const personName = fieldValues['name'] || 'Citizen';
        const shareText = `Check out my official poster for ${template.title} by ${tenant.name}! Create your own personalized banner here: ${fullBannerUrl}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        const record = await this.generatedModel.create({
            tenantId: tenant._id,
            templateId: template._id,
            ...(userId && mongoose_2.Types.ObjectId.isValid(userId) && { userId: new mongoose_2.Types.ObjectId(userId) }),
            outputUrl,
            format,
            width: canvasWidth,
            height: canvasHeight,
            downloadUrl: `${downloadUrl}`,
            shareText,
            userPhotoUrl: finalPhotoPath || undefined,
            fieldValues,
        });
        record.downloadUrl = `/poster-generator/download/${record._id}`;
        await record.save();
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
    async getPosterFilePath(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid poster ID');
        const record = await this.generatedModel.findOne({ _id: id, tenantId: tenant._id });
        if (!record)
            throw new common_1.NotFoundException(`Poster #${id} not found`);
        const cleanRel = record.outputUrl.replace(/^[\\\/]+/, '').replace(/\//g, path.sep);
        const fullPath = (record.outputUrl.includes(':') && path.isAbsolute(record.outputUrl))
            ? record.outputUrl
            : path.join(process.cwd(), cleanRel);
        if (!fs.existsSync(fullPath)) {
            throw new common_1.NotFoundException(`Generated poster image file missing on server: ${fullPath}`);
        }
        return { filePath: fullPath, filename: path.basename(fullPath) };
    }
    async getMyPosters(tenant, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId))
            throw new common_1.BadRequestException('Invalid user ID');
        return this.generatedModel
            .find({ tenantId: tenant._id, userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('templateId', 'title category dimensionPreset')
            .sort({ createdAt: -1 })
            .limit(30)
            .lean();
    }
    async adminGetAllPosters(tenant, query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const filter = { tenantId: tenant._id };
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
    async adminDeletePoster(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Invalid poster ID');
        const poster = await this.generatedModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
        if (!poster)
            throw new common_1.NotFoundException(`Poster #${id} not found`);
        const fullPath = path.join(process.cwd(), poster.outputUrl.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
            try {
                fs.unlinkSync(fullPath);
            }
            catch (e) { }
        }
        return { message: `Generated poster #${id} deleted successfully.` };
    }
};
exports.PosterGeneratorService = PosterGeneratorService;
exports.PosterGeneratorService = PosterGeneratorService = PosterGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(poster_template_schema_1.PosterTemplate.name)),
    __param(1, (0, mongoose_1.InjectModel)(generated_poster_schema_1.GeneratedPoster.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        background_removal_service_1.BackgroundRemovalService])
], PosterGeneratorService);
//# sourceMappingURL=poster-generator.service.js.map
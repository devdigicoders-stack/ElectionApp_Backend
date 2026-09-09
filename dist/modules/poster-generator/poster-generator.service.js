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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosterGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const canvas_1 = require("canvas");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const poster_template_schema_1 = require("./poster-template.schema");
const generated_poster_schema_1 = require("./generated-poster.schema");
let PosterGeneratorService = class PosterGeneratorService {
    constructor(templateModel, generatedModel) {
        this.templateModel = templateModel;
        this.generatedModel = generatedModel;
    }
    async createTemplate(tenant, data) {
        return this.templateModel.create({ tenantId: tenant._id, ...data });
    }
    async getTemplates(tenant, category) {
        const query = { tenantId: tenant._id, isActive: true };
        if (category)
            query.category = category;
        return this.templateModel.find(query).sort({ sortOrder: 1, createdAt: -1 });
    }
    async getTemplateCategories(tenant) {
        return this.templateModel.distinct('category', { tenantId: tenant._id, isActive: true });
    }
    async getTemplate(tenant, id) {
        const template = await this.templateModel.findOne({ _id: id, tenantId: tenant._id });
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        return template;
    }
    async updateTemplate(tenant, id, data) {
        const template = await this.templateModel.findOneAndUpdate({ _id: id, tenantId: tenant._id }, { $set: data }, { new: true });
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        return template;
    }
    async removeTemplate(tenant, id) {
        return this.templateModel.findOneAndDelete({ _id: id, tenantId: tenant._id });
    }
    async generatePoster(tenant, templateId, fieldValues, userPhotoPath, userId) {
        const template = await this.templateModel.findOne({ _id: templateId, tenantId: tenant._id, isActive: true });
        if (!template)
            throw new common_1.NotFoundException('Template not found');
        for (const field of template.fields) {
            if (field.required && field.editable && !fieldValues[field.key] && !(field.key === 'photo' && userPhotoPath)) {
                throw new common_1.BadRequestException(`Field '${field.label}' is required`);
            }
        }
        const outputDir = path.join(process.cwd(), 'uploads', tenant.slug, 'generated-posters');
        if (!fs.existsSync(outputDir))
            fs.mkdirSync(outputDir, { recursive: true });
        const outputFilename = `poster-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`;
        const outputPath = path.join(outputDir, outputFilename);
        const templateImagePath = path.join(process.cwd(), template.templateImageUrl.replace(/^\//, ''));
        const baseImage = await (0, canvas_1.loadImage)(templateImagePath);
        const canvas = (0, canvas_1.createCanvas)(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImage, 0, 0);
        for (const field of template.fields) {
            if (!field.editable || !field.position)
                continue;
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
                    const photo = await (0, canvas_1.loadImage)(photoSrc);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(photo, x, y, w, h);
                    ctx.restore();
                }
            }
            else if (field.type === 'text') {
                const text = fieldValues[field.key] || field.defaultValue || '';
                if (!text)
                    continue;
                const style = field.style || {};
                const fontSize = style.fontSize || 24;
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
                        ctx.fillText(line.trim(), x + w / 2, lineY);
                        line = words[i] + ' ';
                        lineY += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                }
                ctx.fillText(line.trim(), x + w / 2, lineY);
            }
        }
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        const outputUrl = `/uploads/${tenant.slug}/generated-posters/${outputFilename}`;
        const record = await this.generatedModel.create({
            tenantId: tenant._id,
            templateId: template._id,
            ...(userId && { userId }),
            outputUrl,
            fieldValues,
        });
        await this.templateModel.updateOne({ _id: templateId }, { $inc: { usageCount: 1 } });
        return { outputUrl, recordId: record._id };
    }
    async getMyPosters(tenant, userId) {
        return this.generatedModel
            .find({ tenantId: tenant._id, userId })
            .populate('templateId', 'title category')
            .sort({ createdAt: -1 })
            .limit(20);
    }
};
exports.PosterGeneratorService = PosterGeneratorService;
exports.PosterGeneratorService = PosterGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(poster_template_schema_1.PosterTemplate.name)),
    __param(1, (0, mongoose_1.InjectModel)(generated_poster_schema_1.GeneratedPoster.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PosterGeneratorService);
//# sourceMappingURL=poster-generator.service.js.map
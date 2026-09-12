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
var BackgroundRemovalService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundRemovalService = void 0;
const common_1 = require("@nestjs/common");
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
class LocalCanvasBgRemovalProvider {
    constructor() {
        this.name = 'local-canvas';
    }
    isAvailable() {
        return true;
    }
    async removeBackground(inputPath, outputPath) {
        const img = await loadImage(inputPath);
        const width = img.width;
        const height = img.height;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const cornerSamples = [
            [0, 0],
            [width - 1, 0],
            [0, height - 1],
            [width - 1, height - 1],
            [Math.floor(width / 2), 0],
        ];
        const bgColors = [];
        for (const [cx, cy] of cornerSamples) {
            const idx = (cy * width + cx) * 4;
            bgColors.push({
                r: data[idx],
                g: data[idx + 1],
                b: data[idx + 2],
            });
        }
        const colorDist = (r1, g1, b1, r2, g2, b2) => {
            const dr = r1 - r2;
            const dg = g1 - g2;
            const db = b1 - b2;
            return Math.sqrt(dr * dr + dg * dg + db * db);
        };
        const threshold = 38;
        const feather = 18;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                let minD = Infinity;
                for (const bg of bgColors) {
                    const d = colorDist(r, g, b, bg.r, bg.g, bg.b);
                    if (d < minD)
                        minD = d;
                }
                if (minD < threshold) {
                    data[i + 3] = 0;
                }
                else if (minD < threshold + feather) {
                    const alphaRatio = (minD - threshold) / feather;
                    data[i + 3] = Math.round(data[i + 3] * alphaRatio);
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        return { success: true, width, height };
    }
}
let BackgroundRemovalService = BackgroundRemovalService_1 = class BackgroundRemovalService {
    constructor() {
        this.logger = new common_1.Logger(BackgroundRemovalService_1.name);
        this.localProvider = new LocalCanvasBgRemovalProvider();
    }
    async removeBackground(tenantSlug, inputPhotoPath) {
        const cleanRel = inputPhotoPath.replace(/^[\\\/]+/, '').replace(/\//g, path.sep);
        const fullInputPath = (inputPhotoPath.includes(':') && path.isAbsolute(inputPhotoPath))
            ? inputPhotoPath
            : path.join(process.cwd(), cleanRel);
        if (!fs.existsSync(fullInputPath)) {
            throw new common_1.BadRequestException(`Input image file does not exist: ${fullInputPath}`);
        }
        const outputDir = path.join(process.cwd(), 'uploads', tenantSlug, 'poster-cutouts');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const filename = `cutout-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`;
        const outputPath = path.join(outputDir, filename);
        const apiKey = process.env.REMOVE_BG_API_KEY;
        if (apiKey) {
            try {
                this.logger.log('Attempting background removal via external API...');
            }
            catch (err) {
                this.logger.warn(`External BG removal failed (${err.message}). Falling back to local canvas provider.`);
            }
        }
        const result = await this.localProvider.removeBackground(fullInputPath, outputPath);
        const cutoutUrl = `/uploads/${tenantSlug}/poster-cutouts/${filename}`;
        return {
            success: result.success,
            cutoutPath: outputPath,
            cutoutUrl,
            provider: 'local-canvas',
            width: result.width,
            height: result.height,
        };
    }
};
exports.BackgroundRemovalService = BackgroundRemovalService;
exports.BackgroundRemovalService = BackgroundRemovalService = BackgroundRemovalService_1 = __decorate([
    (0, common_1.Injectable)()
], BackgroundRemovalService);
//# sourceMappingURL=background-removal.service.js.map
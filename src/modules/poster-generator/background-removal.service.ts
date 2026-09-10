import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createCanvas, loadImage } from 'canvas';
import * as path from 'path';
import * as fs from 'fs';

export interface BackgroundRemovalResult {
  success: boolean;
  cutoutPath: string;
  cutoutUrl: string;
  provider: 'local-canvas' | 'remove-bg' | 'external-api';
  width: number;
  height: number;
}

export interface IBackgroundRemovalProvider {
  name: 'local-canvas' | 'remove-bg' | 'external-api';
  isAvailable(): boolean;
  removeBackground(inputPath: string, outputPath: string): Promise<{ success: boolean; width: number; height: number }>;
}

/**
 * Native Canvas-based Background Cutout Provider.
 * Samples background edge and corner chroma, creating an alpha mask cutout with edge antialiasing.
 */
class LocalCanvasBgRemovalProvider implements IBackgroundRemovalProvider {
  name = 'local-canvas' as const;

  isAvailable(): boolean {
    return true;
  }

  async removeBackground(inputPath: string, outputPath: string): Promise<{ success: boolean; width: number; height: number }> {
    const img = await loadImage(inputPath);
    const width = img.width;
    const height = img.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Sample background colors from 4 corners
    const cornerSamples = [
      [0, 0], // Top-Left
      [width - 1, 0], // Top-Right
      [0, height - 1], // Bottom-Left
      [width - 1, height - 1], // Bottom-Right
      [Math.floor(width / 2), 0], // Top-Center
    ];

    const bgColors: { r: number; g: number; b: number }[] = [];
    for (const [cx, cy] of cornerSamples) {
      const idx = (cy * width + cx) * 4;
      bgColors.push({
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
      });
    }

    // Color distance calculation
    const colorDist = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
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

        // Find min distance to any corner background sample
        let minD = Infinity;
        for (const bg of bgColors) {
          const d = colorDist(r, g, b, bg.r, bg.g, bg.b);
          if (d < minD) minD = d;
        }

        if (minD < threshold) {
          // Fully transparent
          data[i + 3] = 0;
        } else if (minD < threshold + feather) {
          // Smooth antialiased transition
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

/**
 * Pluggable Background Removal Engine (SRS Sec 29)
 * Supports changing the background removal provider seamlessly.
 */
@Injectable()
export class BackgroundRemovalService {
  private readonly logger = new Logger(BackgroundRemovalService.name);
  private localProvider = new LocalCanvasBgRemovalProvider();

  /**
   * Process photo and generate transparent subject cutout
   */
  async removeBackground(
    tenantSlug: string,
    inputPhotoPath: string,
  ): Promise<BackgroundRemovalResult> {
    const cleanRel = inputPhotoPath.replace(/^[\\\/]+/, '').replace(/\//g, path.sep);
    const fullInputPath = (inputPhotoPath.includes(':') && path.isAbsolute(inputPhotoPath))
      ? inputPhotoPath
      : path.join(process.cwd(), cleanRel);

    if (!fs.existsSync(fullInputPath)) {
      throw new BadRequestException(`Input image file does not exist: ${fullInputPath}`);
    }

    const outputDir = path.join(process.cwd(), 'uploads', tenantSlug, 'poster-cutouts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `cutout-${Date.now()}-${Math.round(Math.random() * 1e6)}.png`;
    const outputPath = path.join(outputDir, filename);

    // If external remove.bg API key is set in environment, we could call it
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (apiKey) {
      try {
        this.logger.log('Attempting background removal via external API...');
        // Placeholder for cloud call if apiKey is present
      } catch (err: any) {
        this.logger.warn(`External BG removal failed (${err.message}). Falling back to local canvas provider.`);
      }
    }

    // Process via local canvas provider
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
}

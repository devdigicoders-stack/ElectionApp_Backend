import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SystemSettings,
  SystemSettingsDocument,
} from '../../modules/system-settings/system-settings.schema';

/**
 * Maintenance Mode Middleware (SRS Sec 2.1 & 73)
 *
 * When `general.maintenanceMode = true` in SystemSettings:
 *  - All tenant-facing API routes return 503 Service Unavailable
 *  - Super Admin routes (/super-admin/*, /auth/super-admin/*) are BYPASSED
 *  - Health check (/health) is BYPASSED
 *  - Settings DB is read with a 30-second in-memory cache to avoid hammering MongoDB on every request
 */
@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(SystemSettings.name)
    private systemSettingsModel: Model<SystemSettingsDocument>,
  ) {}

  /** In-memory cache to avoid a DB hit on every single request */
  private cache: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    fetchedAt: number;
  } | null = null;

  private readonly CACHE_TTL_MS = 30_000; // 30 seconds

  /** Routes that are always allowed even during maintenance */
  private readonly BYPASS_PREFIXES = [
    '/super-admin',
    '/auth/super-admin',
    '/health',
    '/uploads',
    '/payments/webhook', // payment gateway callbacks must always go through
  ];

  private isBypassed(path: string): boolean {
    const normalised = path.toLowerCase();
    return this.BYPASS_PREFIXES.some((prefix) =>
      normalised.startsWith(prefix),
    );
  }

  private async getMaintenanceStatus(): Promise<{
    maintenanceMode: boolean;
    maintenanceMessage: string;
  }> {
    const now = Date.now();

    // Return cached value if still fresh
    if (this.cache && now - this.cache.fetchedAt < this.CACHE_TTL_MS) {
      return {
        maintenanceMode: this.cache.maintenanceMode,
        maintenanceMessage: this.cache.maintenanceMessage,
      };
    }

    // Fetch from DB — only need the general sub-document
    try {
      const doc = await this.systemSettingsModel
        .findOne({ key: 'platform_singleton' })
        .select('general')
        .lean();

      const maintenanceMode = doc?.general?.maintenanceMode ?? false;
      const maintenanceMessage =
        doc?.general?.maintenanceMessage ||
        'System maintenance in progress. Please try again later.';

      this.cache = { maintenanceMode, maintenanceMessage, fetchedAt: now };
      return { maintenanceMode, maintenanceMessage };
    } catch {
      // On DB error, default to NOT blocking traffic (fail open — safer than locking everyone out)
      return { maintenanceMode: false, maintenanceMessage: '' };
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // Always allow bypassed paths through
    if (this.isBypassed(req.path)) {
      return next();
    }

    const { maintenanceMode, maintenanceMessage } =
      await this.getMaintenanceStatus();

    if (!maintenanceMode) {
      return next();
    }

    // ── Platform is in Maintenance Mode ──────────────────────────────────────
    // Return a proper 503 with JSON body and standard Retry-After header
    res.setHeader('Retry-After', '1800'); // suggest retry in 30 minutes
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: 503,
      error: 'Service Unavailable',
      message: maintenanceMessage,
      maintenanceMode: true,
      retryAfter: 1800,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Called by SystemSettingsService after updating general settings
   * so the cache is immediately invalidated — no 30s delay after toggle.
   */
  invalidateCache() {
    this.cache = null;
  }
}

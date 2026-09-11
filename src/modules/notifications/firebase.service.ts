import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { initializeApp, cert, getApps, getApp, App } from 'firebase-admin/app';
import { getMessaging, MulticastMessage, Message, BatchResponse } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: App | null = null;
  private isInitialized = false;

  onModuleInit() {
    this.initFirebase();
  }

  private initFirebase() {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      this.firebaseApp = getApp();
      this.isInitialized = true;
      this.logger.log(`Firebase Admin SDK already initialized (${this.firebaseApp.name})`);
      return;
    }

    try {
      const configPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'device-streaming-3d1aacd5-firebase-adminsdk-fbsvc-b0d3cd0c94.json';
      let resolvedPath = configPath;

      if (!path.isAbsolute(configPath)) {
        resolvedPath = path.resolve(process.cwd(), configPath);
      }

      if (fs.existsSync(resolvedPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
        this.firebaseApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
        this.isInitialized = true;
        this.logger.log(`Firebase Admin SDK initialized with project: ${serviceAccount.project_id}`);
      } else {
        this.logger.warn(`Firebase service account file not found at ${resolvedPath}. Push notifications will be mocked/disabled.`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
  }

  public getApp(): App | null {
    return this.firebaseApp;
  }

  public isReady(): boolean {
    return this.isInitialized && this.firebaseApp !== null;
  }

  async testFcmConnection(): Promise<{ success: boolean; message: string; projectId?: string }> {
    if (!this.isReady() || !this.firebaseApp) {
      return {
        success: false,
        message: 'Firebase Admin SDK is not initialized. Please verify service account JSON file.',
      };
    }

    try {
      const projectId = this.firebaseApp.options?.projectId;
      return {
        success: true,
        message: `Firebase Admin SDK is active and connected to project: ${projectId}`,
        projectId,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Firebase ping error: ${err.message}`,
      };
    }
  }

  async sendMulticastPush(
    tokens: string[],
    payload: {
      title: string;
      body: string;
      data?: Record<string, string>;
      imageUrl?: string;
    },
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!this.isReady() || !this.firebaseApp) {
      this.logger.warn('Skipping FCM send: Firebase is not initialized');
      return { successCount: 0, failureCount: tokens.length };
    }

    const validTokens = tokens.filter((t) => typeof t === 'string' && t.trim().length > 10);
    if (validTokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    try {
      const messaging = getMessaging(this.firebaseApp);

      // Convert all data values to strings as required by FCM
      const stringData: Record<string, string> = {};
      if (payload.data) {
        for (const [k, v] of Object.entries(payload.data)) {
          stringData[k] = typeof v === 'string' ? v : JSON.stringify(v);
        }
      }

      // Batch in chunks of 500 (FCM limit for sendEachForMulticast)
      const chunkSize = 500;
      let totalSuccess = 0;
      let totalFailure = 0;

      for (let i = 0; i < validTokens.length; i += chunkSize) {
        const chunk = validTokens.slice(i, i + chunkSize);
        const multicastMessage: MulticastMessage = {
          tokens: chunk,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.imageUrl || undefined,
          },
          data: stringData,
          webpush: {
            headers: {
              Urgency: 'high',
            },
            notification: {
              title: payload.title,
              body: payload.body,
              icon: payload.imageUrl || '/logo.png',
              image: payload.imageUrl || undefined,
              requireInteraction: true,
            },
            fcmOptions: {
              link: stringData.actionUrl || '/notifications',
            },
          },
        };

        const response: BatchResponse = await messaging.sendEachForMulticast(multicastMessage);
        totalSuccess += response.successCount;
        totalFailure += response.failureCount;

        if (response.failureCount > 0) {
          response.responses.forEach((resp: any, idx: number) => {
            if (!resp.success) {
              this.logger.debug(`FCM failed for token ${chunk[idx].slice(0, 10)}...: ${resp.error?.message}`);
            }
          });
        }
      }

      return { successCount: totalSuccess, failureCount: totalFailure };
    } catch (err: any) {
      this.logger.error(`Error sending multicast FCM: ${err.message}`);
      return { successCount: 0, failureCount: validTokens.length };
    }
  }

  async sendToSingleToken(
    token: string,
    payload: {
      title: string;
      body: string;
      data?: Record<string, string>;
      imageUrl?: string;
    },
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isReady() || !this.firebaseApp) {
      return { success: false, error: 'Firebase is not initialized' };
    }

    try {
      const messaging = getMessaging(this.firebaseApp);

      const stringData: Record<string, string> = {};
      if (payload.data) {
        for (const [k, v] of Object.entries(payload.data)) {
          stringData[k] = typeof v === 'string' ? v : JSON.stringify(v);
        }
      }

      const message: Message = {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl || undefined,
        },
        data: stringData,
        webpush: {
          headers: {
            Urgency: 'high',
          },
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.imageUrl || '/logo.png',
            requireInteraction: true,
          },
          fcmOptions: {
            link: stringData.actionUrl || '/notifications',
          },
        },
      };

      const messageId = await messaging.send(message);
      return { success: true, messageId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';
import { Membership, MembershipDocument } from './membership.schema';
import { TenantDocument } from '../tenants/tenant.schema';
import { User, UserDocument } from '../users/user.schema';
import { Area, AreaDocument } from '../areas/area.schema';
import { MembershipStatus } from '../../shared/types';
import {
  ApplyMembershipDto,
  ApproveMembershipDto,
  QueryMembershipDto,
  RegenerateCardDto,
  UpdateMembershipCardDetailsDto,
} from './membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(Membership.name) private membershipModel: Model<MembershipDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
  ) {}

  private generateMemberNumber(tenantSlug: string, count: number): string {
    return `${tenantSlug.toUpperCase()}-${String(count + 1).padStart(6, '0')}`;
  }

  private formatDate(date?: Date | null): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

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

  /**
   * Generates the Digital Membership Card PNG using Node Canvas and embeds the verification QR Code.
   */
  async generateDigitalCard(
    tenant: TenantDocument,
    membership: MembershipDocument,
    userDoc?: any,
  ): Promise<{ cardUrl: string; filePath: string }> {
    const user =
      userDoc ||
      (await this.userModel.findById(membership.userId).lean()) ||
      {};

    let areaName = 'General Constituency';
    if (user.areaId) {
      const area = await this.areaModel.findById(user.areaId).lean();
      if (area && area.name) {
        areaName = area.name;
      }
    }

    const membershipNumber = membership.membershipNumber || `TEMP-${membership._id}`;
    const primaryColor = tenant.branding?.primaryColor || '#1e3a8a';
    const secondaryColor = tenant.branding?.secondaryColor || '#f59e0b';
    const designation = membership.designation || 'Active Member';

    // 1. Setup Canvas dimensions
    const width = 1000;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 2. Base Card Background with rounded corners
    this.drawRoundedRect(ctx, 0, 0, width, height, 28);
    ctx.clip();

    // Deep modern gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0b1329');
    bgGradient.addColorStop(0.5, '#131e3a');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric accent swooshes
    ctx.save();
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(920, 80, 240, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = secondaryColor;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(80, 520, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Golden / Accent Top Stripe
    const stripeGradient = ctx.createLinearGradient(0, 0, width, 0);
    stripeGradient.addColorStop(0, secondaryColor);
    stripeGradient.addColorStop(0.5, '#fbbf24');
    stripeGradient.addColorStop(1, primaryColor);
    ctx.fillStyle = stripeGradient;
    ctx.fillRect(0, 0, width, 8);

    // 3. Card Header
    // Organization / Tenant Logo (if exists) or Emblem Icon
    let logoDrawn = false;
    if (tenant.branding?.logoUrl) {
      try {
        const logoPath = path.join(process.cwd(), tenant.branding.logoUrl.replace(/^\//, ''));
        if (fs.existsSync(logoPath)) {
          const logoImg = await loadImage(logoPath);
          ctx.save();
          this.drawRoundedRect(ctx, 50, 26, 64, 64, 12);
          ctx.clip();
          ctx.drawImage(logoImg, 50, 26, 64, 64);
          ctx.restore();
          logoDrawn = true;
        }
      } catch (err) {
        logoDrawn = false;
      }
    }

    if (!logoDrawn) {
      // Draw stylized emblem
      ctx.save();
      this.drawRoundedRect(ctx, 50, 26, 64, 64, 16);
      ctx.fillStyle = secondaryColor;
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tenant.name ? tenant.name.charAt(0).toUpperCase() : 'J', 82, 58);
      ctx.restore();
    }

    // Tenant / Party Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText((tenant.name || 'JANCONNECT ENGAGEMENT SAAS').toUpperCase(), 130, 30);

    // Tagline / Leader Name
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px sans-serif';
    const subtitle = tenant.branding?.tagline || (tenant.branding?.leaderName ? `Under Leadership of ${tenant.branding.leaderName}` : 'Official Citizen Membership Portal');
    ctx.fillText(subtitle, 130, 64);

    // Header Right: Badge "DIGITAL MEMBERSHIP CARD"
    ctx.save();
    this.drawRoundedRect(ctx, 670, 32, 275, 42, 21);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.fill();
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ DIGITAL MEMBERSHIP CARD ★', 807, 53);
    ctx.restore();

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 105);
    ctx.lineTo(950, 105);
    ctx.stroke();

    // 4. Member Photo (Left Column: x = 50, y = 135, w = 180, h = 210)
    ctx.save();
    const photoX = 55;
    const photoY = 135;
    const photoW = 180;
    const photoH = 210;
    const photoRadius = 16;

    this.drawRoundedRect(ctx, photoX, photoY, photoW, photoH, photoRadius);
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.clip();

    let photoRendered = false;
    const photoSource = membership.photoUrl || user.customFields?.photo || user.customFields?.avatarUrl;
    if (photoSource) {
      try {
        const fullPhotoPath = path.isAbsolute(photoSource)
          ? photoSource
          : path.join(process.cwd(), photoSource.replace(/^\//, ''));
        if (fs.existsSync(fullPhotoPath)) {
          const mPhoto = await loadImage(fullPhotoPath);
          ctx.drawImage(mPhoto, photoX, photoY, photoW, photoH);
          photoRendered = true;
        }
      } catch (e) {
        photoRendered = false;
      }
    }

    if (!photoRendered) {
      // Fallback: Elegant Avatar with Initials
      const avGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
      avGrad.addColorStop(0, '#1e293b');
      avGrad.addColorStop(1, '#334155');
      ctx.fillStyle = avGrad;
      ctx.fillRect(photoX, photoY, photoW, photoH);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials = (user.name || 'M')
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      ctx.fillText(initials, photoX + photoW / 2, photoY + photoH / 2);
    }
    ctx.restore();

    // Designation Badge below photo
    ctx.save();
    const desY = 365;
    this.drawRoundedRect(ctx, 45, desY, 200, 36, 18);
    const desGrad = ctx.createLinearGradient(45, desY, 245, desY + 36);
    desGrad.addColorStop(0, secondaryColor);
    desGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = desGrad;
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(designation.toUpperCase(), 145, desY + 18);
    ctx.restore();

    // 5. Center Column: Member Details (x = 275)
    const colX = 275;

    // Member Name
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('MEMBER NAME / सदस्य का नाम', colX, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(user.name || 'Registered Citizen', colX, 150);

    // Membership Number (Highlighted in gold/amber)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('MEMBERSHIP ID / सदस्यता क्रमांक', colX, 205);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(membershipNumber, colX, 225);

    // Grid Row 1: Area & Mobile
    const subCol1 = colX;
    const subCol2 = colX + 220;

    // Area
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('AREA / विधानसभा / वार्ड', subCol1, 275);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(areaName, subCol1, 295);

    // Mobile (masked)
    const mobile = user.mobile ? `${user.mobile.slice(0, 3)}****${user.mobile.slice(-3)}` : 'N/A';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('CONTACT / संपर्क', subCol2, 275);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(mobile, subCol2, 295);

    // Grid Row 2: Issue Date & Expiry
    const row3Y = 345;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('ISSUED ON / जारी तिथि', subCol1, row3Y);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(this.formatDate(membership.approvedAt || new Date()), subCol1, row3Y + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('VALIDITY / वैधता', subCol2, row3Y);
    ctx.fillStyle = membership.expiresAt ? '#38bdf8' : '#10b981';
    ctx.font = 'bold 15px sans-serif';
    const validityText = membership.expiresAt ? this.formatDate(membership.expiresAt) : 'LIFETIME / आजीवन';
    ctx.fillText(validityText, subCol2, row3Y + 20);

    // Security Status Indicator Pill
    ctx.save();
    this.drawRoundedRect(ctx, colX, 415, 180, 28, 14);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● VERIFIED ACTIVE ID', colX + 90, 429);
    ctx.restore();

    // 6. Right Column: Scannable QR Code (x = 730, y = 130, w = 210, h = 265)
    const qrBoxX = 730;
    const qrBoxY = 130;
    const qrBoxW = 220;
    const qrBoxH = 275;

    // QR Box white container
    ctx.save();
    this.drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.restore();

    // Verification URL encoded in QR Code
    const domain = tenant.customDomain || `${tenant.slug}.localhost:3001`;
    const verifyUrl = `http://${domain}/membership/verify/${membershipNumber}`;

    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      width: 175,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    const qrImg = await loadImage(qrBuffer);
    ctx.drawImage(qrImg, qrBoxX + 22, qrBoxY + 16, 175, 175);

    // Under QR Code text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SCAN TO VERIFY', qrBoxX + qrBoxW / 2, qrBoxY + 200);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(membershipNumber, qrBoxX + qrBoxW / 2, qrBoxY + 222);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('SECURE DIGITAL SEAL', qrBoxX + qrBoxW / 2, qrBoxY + 242);

    // 7. Card Footer Bar (y = 525 to 600)
    ctx.fillStyle = '#070d1e';
    ctx.fillRect(0, 525, width, 75);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 525);
    ctx.lineTo(width, 525);
    ctx.stroke();

    // Footer Left: Authorized signature / leader
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const authBy = tenant.branding?.leaderName
      ? `Authorized By: ${tenant.branding.leaderName} (Leader / In-charge)`
      : `Authorized By: ${tenant.name} Executive Committee`;
    ctx.fillText(authBy, 50, 562);

    // Footer Right: Official verification website
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`verify: ${domain}`, 950, 562);

    // 8. Save output file
    const outputDir = path.join(process.cwd(), 'uploads', tenant.slug, 'membership-cards');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilename = `${membershipNumber}.png`;
    const filePath = path.join(outputDir, outputFilename);
    const cardBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, cardBuffer);

    const cardUrl = `/uploads/${tenant.slug}/membership-cards/${outputFilename}`;
    return { cardUrl, filePath };
  }

  /**
   * 1. Citizen applies for membership
   */
  async apply(tenant: TenantDocument, userId: string, dto?: ApplyMembershipDto) {
    const existing = await this.membershipModel.findOne({ tenantId: tenant._id, userId });
    if (existing) {
      throw new ConflictException('Membership application already exists for this citizen');
    }

    return this.membershipModel.create({
      tenantId: tenant._id,
      userId: new Types.ObjectId(userId),
      designation: dto?.designation || 'Active Member',
      photoUrl: dto?.photoUrl || undefined,
      customData: dto?.customData || {},
      status: MembershipStatus.PENDING,
    });
  }

  /**
   * 2. Find citizen's own membership status & card
   */
  async findByUser(tenant: TenantDocument, userId: string) {
    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    return this.membershipModel
      .findOne({
        tenantId: tenant._id,
        $or: [{ userId: userObjectId }, { userId: userId.toString() }],
      })
      .populate('userId', 'name mobile areaId customFields')
      .populate('approvedBy', 'name');
  }

  /**
   * 3. Get my digital membership card (generates if approved but cardUrl is missing)
   */
  async getMyCard(tenant: TenantDocument, userId: string) {
    const userObjectId = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const membership = await this.membershipModel
      .findOne({
        tenantId: tenant._id,
        $or: [{ userId: userObjectId }, { userId: userId.toString() }],
      })
      .populate('userId', 'name mobile areaId customFields');

    if (!membership) {
      throw new NotFoundException('No membership application found. Please apply first.');
    }

    if (membership.status !== MembershipStatus.APPROVED) {
      return {
        hasCard: false,
        status: membership.status,
        message:
          membership.status === MembershipStatus.PENDING
            ? 'Your membership application is pending approval.'
            : `Your membership application was ${membership.status}.`,
        membership,
      };
    }

    // If cardUrl is missing or file does not exist, generate it now
    const filePath = path.join(
      process.cwd(),
      'uploads',
      tenant.slug,
      'membership-cards',
      `${membership.membershipNumber}.png`,
    );

    if (!membership.cardUrl || !fs.existsSync(filePath)) {
      const { cardUrl } = await this.generateDigitalCard(tenant, membership, membership.userId);
      membership.cardUrl = cardUrl;
      membership.cardIssuedAt = new Date();
      membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membership.membershipNumber}`;
      await membership.save();
    }

    return {
      hasCard: true,
      status: membership.status,
      membershipNumber: membership.membershipNumber,
      designation: membership.designation,
      cardUrl: membership.cardUrl,
      downloadUrl: `/membership/my/card/download`,
      verificationUrl: membership.verificationUrl,
      approvedAt: membership.approvedAt,
      expiresAt: membership.expiresAt,
      member: membership.userId,
    };
  }

  /**
   * 4. List all memberships with pagination, search, and status filter (Admin)
   */
  async findAll(tenant: TenantDocument, filters: QueryMembershipDto) {
    const { status, search, page = 1, limit = 20 } = filters;
    const query: any = { tenantId: tenant._id };
    if (status) query.status = status;

    if (search && search.trim()) {
      const s = search.trim();
      const users = await this.userModel
        .find({
          tenantId: tenant._id,
          $or: [
            { name: { $regex: s, $options: 'i' } },
            { mobile: { $regex: s, $options: 'i' } },
          ],
        })
        .select('_id')
        .lean();

      const userIds = users.map((u) => u._id);
      query.$or = [
        { membershipNumber: { $regex: s, $options: 'i' } },
        { designation: { $regex: s, $options: 'i' } },
        { userId: { $in: userIds } },
      ];
    }

    const [data, total] = await Promise.all([
      this.membershipModel
        .find(query)
        .populate('userId', 'name mobile areaId customFields')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.membershipModel.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * 5. Get single membership by ID
   */
  async findOne(tenant: TenantDocument, id: string) {
    const membership = await this.membershipModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('userId', 'name mobile areaId customFields')
      .populate('approvedBy', 'name');

    if (!membership) {
      throw new NotFoundException(`Membership #${id} not found`);
    }
    return membership;
  }

  /**
   * 6. Approve membership application and automatically generate digital card (Admin)
   */
  async approve(
    tenant: TenantDocument,
    id: string,
    approvedBy: string,
    dto?: ApproveMembershipDto,
  ) {
    const membership = await this.membershipModel.findOne({ _id: id, tenantId: tenant._id });
    if (!membership) {
      throw new NotFoundException(`Membership #${id} not found`);
    }

    if (!membership.membershipNumber) {
      const count = await this.membershipModel.countDocuments({
        tenantId: tenant._id,
        status: MembershipStatus.APPROVED,
      });
      membership.membershipNumber = this.generateMemberNumber(tenant.slug, count);
    }

    membership.status = MembershipStatus.APPROVED;
    membership.approvedBy = new Types.ObjectId(approvedBy);
    membership.approvedAt = new Date();
    if (dto?.designation) membership.designation = dto.designation;
    if (dto?.expiresAt) membership.expiresAt = new Date(dto.expiresAt);

    // Generate digital membership card
    const { cardUrl } = await this.generateDigitalCard(tenant, membership);
    membership.cardUrl = cardUrl;
    membership.cardIssuedAt = new Date();
    membership.cardVersion = (membership.cardVersion || 1) + 1;
    membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membership.membershipNumber}`;

    await membership.save();

    return this.membershipModel
      .findById(membership._id)
      .populate('userId', 'name mobile areaId customFields')
      .populate('approvedBy', 'name');
  }

  /**
   * 7. Reject membership application (Admin)
   */
  async reject(tenant: TenantDocument, id: string, reason: string) {
    const membership = await this.membershipModel.findOne({ _id: id, tenantId: tenant._id });
    if (!membership) {
      throw new NotFoundException(`Membership #${id} not found`);
    }

    membership.status = MembershipStatus.REJECTED;
    membership.rejectionReason = reason;
    return membership.save();
  }

  /**
   * 8. Force re-generate / re-render digital membership card (Admin)
   */
  async regenerateCard(tenant: TenantDocument, id: string, dto?: RegenerateCardDto) {
    const membership = await this.membershipModel
      .findOne({ _id: id, tenantId: tenant._id })
      .populate('userId', 'name mobile areaId customFields');

    if (!membership) {
      throw new NotFoundException(`Membership #${id} not found`);
    }

    if (membership.status !== MembershipStatus.APPROVED) {
      throw new BadRequestException('Cannot generate digital card for unapproved membership');
    }

    if (dto?.designation) membership.designation = dto.designation;
    if (dto?.photoUrl) membership.photoUrl = dto.photoUrl;
    if (dto?.expiresAt) membership.expiresAt = new Date(dto.expiresAt);

    const { cardUrl } = await this.generateDigitalCard(tenant, membership, membership.userId);
    membership.cardUrl = cardUrl;
    membership.cardIssuedAt = new Date();
    membership.cardVersion = (membership.cardVersion || 1) + 1;
    membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membership.membershipNumber}`;

    await membership.save();
    return membership;
  }

  /**
   * 9. Update member card details & auto re-generate card
   */
  async updateCardDetails(
    tenant: TenantDocument,
    id: string,
    dto: UpdateMembershipCardDetailsDto,
  ) {
    const membership = await this.membershipModel.findOne({ _id: id, tenantId: tenant._id });
    if (!membership) {
      throw new NotFoundException(`Membership #${id} not found`);
    }

    if (dto.designation !== undefined) membership.designation = dto.designation;
    if (dto.photoUrl !== undefined) membership.photoUrl = dto.photoUrl;
    if (dto.expiresAt !== undefined) membership.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    if (dto.customData !== undefined) membership.customData = { ...membership.customData, ...dto.customData };

    if (membership.status === MembershipStatus.APPROVED && membership.membershipNumber) {
      const { cardUrl } = await this.generateDigitalCard(tenant, membership);
      membership.cardUrl = cardUrl;
      membership.cardIssuedAt = new Date();
      membership.cardVersion = (membership.cardVersion || 1) + 1;
    }

    await membership.save();
    return this.membershipModel
      .findById(membership._id)
      .populate('userId', 'name mobile areaId customFields');
  }

  /**
   * 10. Public Verification Endpoint (When QR Code is scanned in the field)
   */
  async verifyCard(tenant: TenantDocument, membershipNumber: string) {
    const cleanNumber = membershipNumber.trim().toUpperCase();
    const membership = await this.membershipModel
      .findOne({
        tenantId: tenant._id,
        membershipNumber: cleanNumber,
      })
      .populate('userId', 'name mobile areaId customFields')
      .lean();

    if (!membership) {
      return {
        valid: false,
        status: 'not_found',
        message: `Membership #${cleanNumber} does not exist for ${tenant.name}.`,
        membershipNumber: cleanNumber,
      };
    }

    if (membership.status !== MembershipStatus.APPROVED) {
      return {
        valid: false,
        status: membership.status,
        message: `This membership is currently ${membership.status}.`,
        membershipNumber: cleanNumber,
      };
    }

    // Check expiry
    const now = new Date();
    if (membership.expiresAt && new Date(membership.expiresAt) < now) {
      return {
        valid: false,
        status: 'expired',
        message: `This membership card expired on ${this.formatDate(membership.expiresAt)}.`,
        membershipNumber: cleanNumber,
        expiredAt: membership.expiresAt,
      };
    }

    const user: any = membership.userId || {};
    let areaName = 'General Constituency';
    if (user.areaId) {
      const area = await this.areaModel.findById(user.areaId).lean();
      if (area && area.name) areaName = area.name;
    }

    const maskedMobile = user.mobile
      ? `${user.mobile.slice(0, 3)}****${user.mobile.slice(-3)}`
      : 'N/A';

    return {
      valid: true,
      status: 'active',
      message: 'Official membership verified and active.',
      membershipNumber: membership.membershipNumber,
      member: {
        name: user.name || 'Registered Citizen',
        mobile: maskedMobile,
        area: areaName,
        designation: membership.designation || 'Active Member',
        photoUrl: membership.photoUrl || user.customFields?.photo || null,
      },
      tenant: {
        name: tenant.name,
        slug: tenant.slug,
        leaderName: tenant.branding?.leaderName || null,
        logoUrl: tenant.branding?.logoUrl || null,
      },
      cardUrl: membership.cardUrl,
      issueDate: membership.approvedAt || (membership as any).createdAt,
      expiryDate: membership.expiresAt || null,
      verifiedAt: new Date(),
    };
  }

  /**
   * 11. Get local filesystem path for digital card image download
   */
  async getCardFilePath(tenant: TenantDocument, membershipNumberOrId: string): Promise<string> {
    const membership = await this.membershipModel.findOne({
      tenantId: tenant._id,
      $or: [
        { membershipNumber: membershipNumberOrId.toUpperCase() },
        { _id: Types.ObjectId.isValid(membershipNumberOrId) ? new Types.ObjectId(membershipNumberOrId) : null },
      ],
    });

    if (!membership || !membership.membershipNumber) {
      throw new NotFoundException('Membership or card not found');
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      tenant.slug,
      'membership-cards',
      `${membership.membershipNumber}.png`,
    );

    if (!fs.existsSync(filePath)) {
      const gen = await this.generateDigitalCard(tenant, membership);
      return gen.filePath;
    }

    return filePath;
  }

  /**
   * 12. Membership statistics (Admin)
   */
  async getStats(tenant: TenantDocument) {
    const stats = await this.membershipModel.aggregate([
      { $match: { tenantId: tenant._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const result: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
      result.total += s.count;
    });

    return result;
  }
}

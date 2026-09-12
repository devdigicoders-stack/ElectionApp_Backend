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
exports.MembershipService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const QRCode = __importStar(require("qrcode"));
let createCanvas;
let loadImage;
try {
    const canvasPkg = require('canvas');
    createCanvas = canvasPkg.createCanvas;
    loadImage = canvasPkg.loadImage;
}
catch {
}
const membership_schema_1 = require("./membership.schema");
const membership_plan_schema_1 = require("./membership-plan.schema");
const user_schema_1 = require("../users/user.schema");
const area_schema_1 = require("../areas/area.schema");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const types_1 = require("../../shared/types");
let MembershipService = class MembershipService {
    constructor(membershipModel, planModel, userModel, areaModel, auditLogsService) {
        this.membershipModel = membershipModel;
        this.planModel = planModel;
        this.userModel = userModel;
        this.areaModel = areaModel;
        this.auditLogsService = auditLogsService;
    }
    generateMemberNumber(tenantSlug, count) {
        return `${tenantSlug.toUpperCase()}-${String(count + 1).padStart(6, '0')}`;
    }
    formatDate(date) {
        if (!date)
            return 'N/A';
        const d = new Date(date);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
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
    async seedDefaultPlansIfEmpty(tenant) {
        const count = await this.planModel.countDocuments({ tenantId: tenant._id });
        if (count > 0)
            return;
        const defaultPlans = [
            {
                tenantId: tenant._id,
                name: 'Primary Member / प्राथमिक सदस्य',
                code: 'PRIMARY',
                description: 'Free entry-level membership with digital identity card and official updates.',
                price: 0,
                currency: 'INR',
                validityDays: 365,
                badgeText: 'PRIMARY',
                badgeColor: '#3b82f6',
                benefits: [
                    'Official Digital ID Card with QR Verification',
                    'Direct Jan Samasya Complaint Filing',
                    'Access to Constituency Event Updates',
                ],
                requiresApproval: false,
                isActive: true,
                sortOrder: 1,
            },
            {
                tenantId: tenant._id,
                name: 'Active Member / सक्रिय सदस्य',
                code: 'ACTIVE',
                description: 'Standard active membership for grassroots volunteers and active supporters.',
                price: 100,
                currency: 'INR',
                validityDays: 365,
                badgeText: 'ACTIVE',
                badgeColor: '#f59e0b',
                benefits: [
                    'Official Digital ID Card with Golden Active Seal',
                    'Priority Jan Samasya Resolution Escrow',
                    'Access to Volunteer Task Missions & Points',
                    'Invitation to Monthly Worker Conventions',
                ],
                requiresApproval: false,
                isActive: true,
                sortOrder: 2,
            },
            {
                tenantId: tenant._id,
                name: 'Patron Member / संरक्षक सदस्य',
                code: 'PATRON',
                description: 'Elite lifetime patron membership for core leaders and leadership advisors.',
                price: 1000,
                currency: 'INR',
                validityDays: 0,
                badgeText: 'PATRON',
                badgeColor: '#8b5cf6',
                benefits: [
                    'Lifetime Executive Gold Digital ID Card',
                    'Direct Access to Constituency Advisory Board',
                    'VIP Pass to State & Regional Conventions',
                    'Personalized Briefings from Leader Secretariat',
                ],
                requiresApproval: true,
                isActive: true,
                sortOrder: 3,
            },
        ];
        await this.planModel.insertMany(defaultPlans);
    }
    async createPlan(tenant, dto) {
        const code = dto.code.trim().toUpperCase();
        const existing = await this.planModel.findOne({ tenantId: tenant._id, code });
        if (existing) {
            throw new common_1.ConflictException(`Membership plan with code "${code}" already exists for this organization`);
        }
        return this.planModel.create({
            tenantId: tenant._id,
            name: dto.name.trim(),
            code,
            description: dto.description || '',
            price: dto.price !== undefined ? dto.price : 0,
            currency: dto.currency || 'INR',
            validityDays: dto.validityDays !== undefined ? dto.validityDays : 365,
            badgeText: dto.badgeText || 'MEMBER',
            badgeColor: dto.badgeColor || '#f59e0b',
            benefits: dto.benefits || [],
            requiresApproval: dto.requiresApproval !== undefined ? dto.requiresApproval : false,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
        });
    }
    async findAllPlans(tenant, onlyActive = true) {
        await this.seedDefaultPlansIfEmpty(tenant);
        const query = { tenantId: tenant._id };
        if (onlyActive) {
            query.isActive = true;
        }
        return this.planModel.find(query).sort({ sortOrder: 1, createdAt: 1 }).lean();
    }
    async findPlanById(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid plan ID format');
        }
        const plan = await this.planModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!plan) {
            throw new common_1.NotFoundException(`Membership plan #${id} not found`);
        }
        return plan;
    }
    async updatePlan(tenant, id, dto) {
        const plan = await this.findPlanById(tenant, id);
        if (dto.name !== undefined)
            plan.name = dto.name.trim();
        if (dto.code !== undefined) {
            const code = dto.code.trim().toUpperCase();
            if (code !== plan.code) {
                const existing = await this.planModel.findOne({ tenantId: tenant._id, code });
                if (existing) {
                    throw new common_1.ConflictException(`Plan code "${code}" is already in use`);
                }
                plan.code = code;
            }
        }
        if (dto.description !== undefined)
            plan.description = dto.description;
        if (dto.price !== undefined)
            plan.price = dto.price;
        if (dto.currency !== undefined)
            plan.currency = dto.currency;
        if (dto.validityDays !== undefined)
            plan.validityDays = dto.validityDays;
        if (dto.badgeText !== undefined)
            plan.badgeText = dto.badgeText;
        if (dto.badgeColor !== undefined)
            plan.badgeColor = dto.badgeColor;
        if (dto.benefits !== undefined)
            plan.benefits = dto.benefits;
        if (dto.requiresApproval !== undefined)
            plan.requiresApproval = dto.requiresApproval;
        if (dto.isActive !== undefined)
            plan.isActive = dto.isActive;
        if (dto.sortOrder !== undefined)
            plan.sortOrder = dto.sortOrder;
        return plan.save();
    }
    async deletePlan(tenant, id) {
        const plan = await this.findPlanById(tenant, id);
        const usedCount = await this.membershipModel.countDocuments({
            tenantId: tenant._id,
            planId: plan._id,
        });
        if (usedCount > 0) {
            plan.isActive = false;
            await plan.save();
            return {
                message: `Plan #${id} has ${usedCount} associated members. It has been deactivated instead of deleted.`,
                plan,
            };
        }
        await this.planModel.deleteOne({ _id: plan._id });
        return { message: `Plan #${id} deleted successfully.` };
    }
    async generateDigitalCard(tenant, membership, userDoc) {
        const user = userDoc ||
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
        const width = 1000;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        this.drawRoundedRect(ctx, 0, 0, width, height, 28);
        ctx.clip();
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#0b1329');
        bgGradient.addColorStop(0.5, '#131e3a');
        bgGradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
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
        const stripeGradient = ctx.createLinearGradient(0, 0, width, 0);
        stripeGradient.addColorStop(0, secondaryColor);
        stripeGradient.addColorStop(0.5, '#fbbf24');
        stripeGradient.addColorStop(1, primaryColor);
        ctx.fillStyle = stripeGradient;
        ctx.fillRect(0, 0, width, 8);
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
            }
            catch (err) {
                logoDrawn = false;
            }
        }
        if (!logoDrawn) {
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
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText((tenant.name || 'JANCONNECT ENGAGEMENT SAAS').toUpperCase(), 130, 30);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '15px sans-serif';
        const subtitle = tenant.branding?.tagline || (tenant.branding?.leaderName ? `Under Leadership of ${tenant.branding.leaderName}` : 'Official Citizen Membership Portal');
        ctx.fillText(subtitle, 130, 64);
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, 105);
        ctx.lineTo(950, 105);
        ctx.stroke();
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
        const photoSource = membership.photoUrl || user.profilePhoto || user.photo || user.customFields?.photo || user.customFields?.avatarUrl;
        if (photoSource) {
            try {
                if (photoSource.startsWith('data:image/')) {
                    const base64Data = photoSource.replace(/^data:image\/\w+;base64,/, '');
                    const mPhoto = await loadImage(Buffer.from(base64Data, 'base64'));
                    ctx.drawImage(mPhoto, photoX, photoY, photoW, photoH);
                    photoRendered = true;
                }
                else {
                    const fullPhotoPath = path.isAbsolute(photoSource)
                        ? photoSource
                        : path.join(process.cwd(), photoSource.replace(/^\//, ''));
                    if (fs.existsSync(fullPhotoPath)) {
                        const mPhoto = await loadImage(fullPhotoPath);
                        ctx.drawImage(mPhoto, photoX, photoY, photoW, photoH);
                        photoRendered = true;
                    }
                }
            }
            catch (e) {
                photoRendered = false;
            }
        }
        if (!photoRendered) {
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
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
            ctx.fillText(initials, photoX + photoW / 2, photoY + photoH / 2);
        }
        ctx.restore();
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
        const colX = 275;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('MEMBER NAME / सदस्य का नाम', colX, 130);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(user.name || 'Registered Citizen', colX, 150);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('MEMBERSHIP ID / सदस्यता क्रमांक', colX, 205);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(membershipNumber, colX, 225);
        const subCol1 = colX;
        const subCol2 = colX + 220;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('AREA / विधानसभा / वार्ड', subCol1, 275);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(areaName, subCol1, 295);
        const mobile = user.mobile ? `${user.mobile.slice(0, 3)}****${user.mobile.slice(-3)}` : 'N/A';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('CONTACT / संपर्क', subCol2, 275);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(mobile, subCol2, 295);
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
        const qrBoxX = 730;
        const qrBoxY = 130;
        const qrBoxW = 220;
        const qrBoxH = 275;
        ctx.save();
        this.drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 12;
        ctx.restore();
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
        ctx.fillStyle = '#070d1e';
        ctx.fillRect(0, 525, width, 75);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 525);
        ctx.lineTo(width, 525);
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const authBy = tenant.branding?.leaderName
            ? `Authorized By: ${tenant.branding.leaderName} (Leader / In-charge)`
            : `Authorized By: ${tenant.name} Executive Committee`;
        ctx.fillText(authBy, 50, 562);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`verify: ${domain}`, 950, 562);
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
    async apply(tenant, userId, dto) {
        const existing = await this.membershipModel.findOne({ tenantId: tenant._id, userId });
        if (existing) {
            if (existing.status === types_1.MembershipStatus.APPROVED) {
                throw new common_1.ConflictException('You are already an active approved member.');
            }
            if (existing.status === types_1.MembershipStatus.PENDING) {
                throw new common_1.ConflictException('Your membership application is already under review.');
            }
        }
        let plan = null;
        if (dto?.planId) {
            plan = await this.planModel.findOne({ _id: dto.planId, tenantId: tenant._id });
            if (!plan) {
                throw new common_1.NotFoundException(`Selected membership plan #${dto.planId} does not exist`);
            }
        }
        const designation = plan?.name || dto?.designation || 'Active Member';
        const validityDays = plan?.validityDays !== undefined ? plan.validityDays : 365;
        const expiresAt = validityDays > 0 ? new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000) : null;
        const canAutoApprove = plan ? plan.price === 0 && !plan.requiresApproval : false;
        if (canAutoApprove) {
            const count = await this.membershipModel.countDocuments({
                tenantId: tenant._id,
                status: types_1.MembershipStatus.APPROVED,
            });
            const membershipNumber = this.generateMemberNumber(tenant.slug, count);
            const membership = await this.membershipModel.create({
                tenantId: tenant._id,
                userId: new mongoose_2.Types.ObjectId(userId),
                planId: plan._id,
                designation,
                photoUrl: dto?.photoUrl || undefined,
                customData: dto?.customData || {},
                status: types_1.MembershipStatus.APPROVED,
                membershipNumber,
                approvedAt: new Date(),
                expiresAt: expiresAt || undefined,
                cardIssuedAt: new Date(),
            });
            try {
                const { cardUrl } = await this.generateDigitalCard(tenant, membership);
                membership.cardUrl = cardUrl;
                membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membershipNumber}`;
                await membership.save();
            }
            catch (err) {
            }
            return {
                message: 'Congratulations! Your membership has been instantly activated.',
                autoApproved: true,
                membership: await this.membershipModel
                    .findById(membership._id)
                    .populate('userId', 'name mobile areaId customFields')
                    .populate('planId'),
            };
        }
        const membership = await this.membershipModel.create({
            tenantId: tenant._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            planId: plan ? plan._id : undefined,
            designation,
            photoUrl: dto?.photoUrl || undefined,
            customData: dto?.customData || {},
            status: types_1.MembershipStatus.PENDING,
            expiresAt: expiresAt || undefined,
        });
        const isPaidPlan = plan && plan.price > 0;
        return {
            message: isPaidPlan
                ? `Membership application submitted. Please complete payment of ₹${plan.price} to activate your official ID card.`
                : 'Membership application submitted successfully and is pending admin approval.',
            autoApproved: false,
            requiresPayment: isPaidPlan,
            paymentDetails: isPaidPlan
                ? {
                    amount: plan.price,
                    currency: plan.currency || 'INR',
                    planId: plan._id,
                    planName: plan.name,
                    paymentOrderUrl: '/payments/orders',
                }
                : null,
            membership: await this.membershipModel
                .findById(membership._id)
                .populate('userId', 'name mobile areaId customFields')
                .populate('planId'),
        };
    }
    async findByUser(tenant, userId) {
        const userObjectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
        return this.membershipModel
            .findOne({
            tenantId: tenant._id,
            $or: [{ userId: userObjectId }, { userId: userId.toString() }],
        })
            .populate('userId', 'name mobile profilePhoto areaId customFields')
            .populate('planId')
            .populate('approvedBy', 'name');
    }
    async getMyCard(tenant, userId) {
        const userObjectId = mongoose_2.Types.ObjectId.isValid(userId) ? new mongoose_2.Types.ObjectId(userId) : userId;
        const membership = await this.membershipModel
            .findOne({
            tenantId: tenant._id,
            $or: [{ userId: userObjectId }, { userId: userId.toString() }],
        })
            .populate('userId', 'name mobile profilePhoto areaId customFields')
            .populate('planId');
        if (!membership) {
            throw new common_1.NotFoundException('No membership application found. Please apply first.');
        }
        if (membership.status !== types_1.MembershipStatus.APPROVED) {
            return {
                hasCard: false,
                status: membership.status,
                message: membership.status === types_1.MembershipStatus.PENDING
                    ? 'Your membership application is pending approval or payment.'
                    : `Your membership application was ${membership.status}.`,
                membership,
            };
        }
        const filePath = path.join(process.cwd(), 'uploads', tenant.slug, 'membership-cards', `${membership.membershipNumber}.png`);
        if (!membership.cardUrl || !fs.existsSync(filePath)) {
            const { cardUrl } = await this.generateDigitalCard(tenant, membership, membership.userId);
            membership.cardUrl = cardUrl;
            membership.cardIssuedAt = new Date();
            membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membership.membershipNumber}`;
            await membership.save();
        }
        const domain = tenant.customDomain || `${tenant.slug}.localhost:3001`;
        const verifyUrl = membership.verificationUrl || `http://${domain}/membership/verify/${membership.membershipNumber}`;
        const shareText = `Proud Member of ${tenant.name}! Here is my official verified digital membership card (ID: ${membership.membershipNumber}). Verify online: ${verifyUrl}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        return {
            hasCard: true,
            status: membership.status,
            membershipNumber: membership.membershipNumber,
            designation: membership.designation,
            plan: membership.planId || null,
            cardUrl: membership.cardUrl,
            downloadUrl: `/membership/my/card/download`,
            verificationUrl: verifyUrl,
            shareData: {
                title: `${tenant.name} Digital Membership Card`,
                text: shareText,
                url: verifyUrl,
                whatsappUrl,
            },
            approvedAt: membership.approvedAt,
            expiresAt: membership.expiresAt,
            member: membership.userId,
        };
    }
    async findAll(tenant, filters) {
        const { status, planId, search, page = 1, limit = 20 } = filters;
        const query = { tenantId: tenant._id };
        if (status)
            query.status = status;
        if (planId && mongoose_2.Types.ObjectId.isValid(planId))
            query.planId = new mongoose_2.Types.ObjectId(planId);
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
                .populate('planId')
                .populate('approvedBy', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.membershipModel.countDocuments(query),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(tenant, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid membership ID format');
        }
        const membership = await this.membershipModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id })
            .populate('userId', 'name mobile areaId customFields')
            .populate('planId')
            .populate('approvedBy', 'name');
        if (!membership) {
            throw new common_1.NotFoundException(`Membership #${id} not found`);
        }
        return membership;
    }
    async approve(tenant, id, approvedBy, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid membership ID format');
        }
        const membership = await this.membershipModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!membership) {
            throw new common_1.NotFoundException(`Membership #${id} not found`);
        }
        if (!membership.membershipNumber) {
            const count = await this.membershipModel.countDocuments({
                tenantId: tenant._id,
                status: types_1.MembershipStatus.APPROVED,
            });
            membership.membershipNumber = this.generateMemberNumber(tenant.slug, count);
        }
        membership.status = types_1.MembershipStatus.APPROVED;
        membership.approvedBy = new mongoose_2.Types.ObjectId(approvedBy);
        membership.approvedAt = new Date();
        if (dto?.designation)
            membership.designation = dto.designation;
        if (dto?.expiresAt) {
            membership.expiresAt = new Date(dto.expiresAt);
        }
        else if (!membership.expiresAt) {
            membership.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        }
        const { cardUrl } = await this.generateDigitalCard(tenant, membership);
        membership.cardUrl = cardUrl;
        membership.cardIssuedAt = new Date();
        membership.cardVersion = (membership.cardVersion || 1) + 1;
        membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membership.membershipNumber}`;
        await membership.save();
        return this.membershipModel
            .findById(membership._id)
            .populate('userId', 'name mobile areaId customFields')
            .populate('planId')
            .populate('approvedBy', 'name');
    }
    async reject(tenant, id, reason) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid membership ID format');
        }
        const membership = await this.membershipModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!membership) {
            throw new common_1.NotFoundException(`Membership #${id} not found`);
        }
        membership.status = types_1.MembershipStatus.REJECTED;
        membership.rejectionReason = reason;
        return membership.save();
    }
    async regenerateCard(tenant, id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid membership ID format');
        }
        const membership = await this.membershipModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id })
            .populate('userId', 'name mobile areaId customFields')
            .populate('planId');
        if (!membership) {
            throw new common_1.NotFoundException(`Membership #${id} not found`);
        }
        if (membership.status !== types_1.MembershipStatus.APPROVED) {
            throw new common_1.BadRequestException('Cannot generate digital card for unapproved membership');
        }
        if (dto?.designation)
            membership.designation = dto.designation;
        if (dto?.photoUrl)
            membership.photoUrl = dto.photoUrl;
        if (dto?.expiresAt)
            membership.expiresAt = new Date(dto.expiresAt);
        const { cardUrl } = await this.generateDigitalCard(tenant, membership, membership.userId);
        membership.cardUrl = cardUrl;
        membership.cardIssuedAt = new Date();
        membership.cardVersion = (membership.cardVersion || 1) + 1;
        membership.verificationUrl = `http://${tenant.customDomain || tenant.slug + '.localhost:3001'}/membership/verify/${membership.membershipNumber}`;
        await membership.save();
        return membership;
    }
    async updateCardDetails(tenant, id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid membership ID format');
        }
        const membership = await this.membershipModel.findOne({ _id: new mongoose_2.Types.ObjectId(id), tenantId: tenant._id });
        if (!membership) {
            throw new common_1.NotFoundException(`Membership #${id} not found`);
        }
        if (dto.designation !== undefined)
            membership.designation = dto.designation;
        if (dto.photoUrl !== undefined)
            membership.photoUrl = dto.photoUrl;
        if (dto.expiresAt !== undefined)
            membership.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
        if (dto.customData !== undefined)
            membership.customData = { ...membership.customData, ...dto.customData };
        if (membership.status === types_1.MembershipStatus.APPROVED && membership.membershipNumber) {
            const { cardUrl } = await this.generateDigitalCard(tenant, membership);
            membership.cardUrl = cardUrl;
            membership.cardIssuedAt = new Date();
            membership.cardVersion = (membership.cardVersion || 1) + 1;
        }
        await membership.save();
        return this.membershipModel
            .findById(membership._id)
            .populate('userId', 'name mobile areaId customFields')
            .populate('planId');
    }
    async verifyCard(tenant, membershipNumber) {
        const cleanNumber = membershipNumber.trim().toUpperCase();
        const membership = await this.membershipModel
            .findOne({
            tenantId: tenant._id,
            membershipNumber: cleanNumber,
        })
            .populate('userId', 'name mobile areaId customFields')
            .populate('planId')
            .lean();
        if (!membership) {
            return {
                valid: false,
                status: 'not_found',
                message: `Membership #${cleanNumber} does not exist for ${tenant.name}.`,
                membershipNumber: cleanNumber,
            };
        }
        if (membership.status !== types_1.MembershipStatus.APPROVED) {
            return {
                valid: false,
                status: membership.status,
                message: `This membership is currently ${membership.status}.`,
                membershipNumber: cleanNumber,
            };
        }
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
        const user = membership.userId || {};
        let areaName = 'General Constituency';
        if (user.areaId) {
            const area = await this.areaModel.findById(user.areaId).lean();
            if (area && area.name)
                areaName = area.name;
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
                plan: membership.planId ? membership.planId.name : null,
            },
            tenant: {
                name: tenant.name,
                slug: tenant.slug,
                leaderName: tenant.branding?.leaderName || null,
                logoUrl: tenant.branding?.logoUrl || null,
            },
            cardUrl: membership.cardUrl,
            issueDate: membership.approvedAt || membership.createdAt,
            expiryDate: membership.expiresAt || null,
            verifiedAt: new Date(),
        };
    }
    async getCardFilePath(tenant, membershipNumberOrId) {
        const membership = await this.membershipModel.findOne({
            tenantId: tenant._id,
            $or: [
                { membershipNumber: membershipNumberOrId.toUpperCase() },
                { _id: mongoose_2.Types.ObjectId.isValid(membershipNumberOrId) ? new mongoose_2.Types.ObjectId(membershipNumberOrId) : null },
            ],
        });
        if (!membership || !membership.membershipNumber) {
            throw new common_1.NotFoundException('Membership or card not found');
        }
        const filePath = path.join(process.cwd(), 'uploads', tenant.slug, 'membership-cards', `${membership.membershipNumber}.png`);
        if (!fs.existsSync(filePath)) {
            const gen = await this.generateDigitalCard(tenant, membership);
            return gen.filePath;
        }
        return filePath;
    }
    async getStats(tenant) {
        const [stats, planCounts] = await Promise.all([
            this.membershipModel.aggregate([
                { $match: { tenantId: tenant._id } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.membershipModel.aggregate([
                { $match: { tenantId: tenant._id, status: types_1.MembershipStatus.APPROVED } },
                { $group: { _id: '$designation', count: { $sum: 1 } } },
            ]),
        ]);
        const result = {
            pending: 0,
            approved: 0,
            rejected: 0,
            total: 0,
            byDesignation: {},
        };
        stats.forEach((s) => {
            result[s._id] = s.count;
            result.total += s.count;
        });
        planCounts.forEach((p) => {
            if (p._id)
                result.byDesignation[p._id] = p.count;
        });
        return result;
    }
    async exportMembers(tenant, filters, res, adminUser, ipAddress, userAgent) {
        const { status, planId, search } = filters;
        const query = { tenantId: tenant._id };
        if (status)
            query.status = status;
        if (planId && mongoose_2.Types.ObjectId.isValid(planId))
            query.planId = new mongoose_2.Types.ObjectId(planId);
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
        const members = await this.membershipModel
            .find(query)
            .populate('userId', 'name mobile email areaId customFields')
            .populate('planId', 'name code price validityDays')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 })
            .lean();
        const areas = await this.areaModel.find({ tenantId: tenant._id }).select('name').lean();
        const areaMap = new Map();
        areas.forEach((a) => areaMap.set(a._id.toString(), a.name));
        const domain = tenant.customDomain || `${tenant.slug}.localhost:3001`;
        const csvHeaders = [
            'Membership ID',
            'Member Name',
            'Mobile Number',
            'Area / Constituency',
            'Plan / Designation',
            'Status',
            'Application Date',
            'Approval Date',
            'Expiry Date',
            'Payment Status',
            'Payment Amount (INR)',
            'Transaction ID',
            'Verification URL',
        ];
        const escapeCsv = (val) => {
            if (val === null || val === undefined)
                return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        };
        const csvRows = members.map((m) => {
            const user = m.userId || {};
            const areaName = user.areaId
                ? areaMap.get(user.areaId.toString()) || 'General Constituency'
                : 'General Constituency';
            const planName = m.planId?.name || m.designation || 'Active Member';
            const paymentStatus = m.paymentInfo?.transactionId
                ? 'Paid'
                : m.status === types_1.MembershipStatus.APPROVED
                    ? 'Approved / Free'
                    : 'Unpaid';
            const verifyUrl = m.membershipNumber
                ? `http://${domain}/membership/verify/${m.membershipNumber}`
                : '';
            return [
                escapeCsv(m.membershipNumber || 'N/A'),
                escapeCsv(user.name || 'Citizen'),
                escapeCsv(user.mobile || 'N/A'),
                escapeCsv(areaName),
                escapeCsv(planName),
                escapeCsv(m.status),
                escapeCsv(m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : 'N/A'),
                escapeCsv(m.approvedAt ? new Date(m.approvedAt).toISOString().split('T')[0] : 'N/A'),
                escapeCsv(m.expiresAt ? new Date(m.expiresAt).toISOString().split('T')[0] : 'Lifetime'),
                escapeCsv(paymentStatus),
                escapeCsv(m.paymentInfo?.amount || 0),
                escapeCsv(m.paymentInfo?.transactionId || 'N/A'),
                escapeCsv(verifyUrl),
            ].join(',');
        });
        const isExcel = (filters?.format || '').toLowerCase() === 'excel' || (filters?.format || '').toLowerCase() === 'xlsx';
        const bom = '\uFEFF';
        const csv = bom + [csvHeaders.join(','), ...csvRows].join('\r\n');
        const contentType = isExcel
            ? 'application/vnd.ms-excel; charset=utf-8'
            : 'text/csv; charset=utf-8';
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `members-${tenant.slug}-${timestamp}.csv`;
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        if (this.auditLogsService && adminUser) {
            await this.auditLogsService
                .log({
                tenantId: tenant._id,
                tenantName: tenant.name,
                action: 'DATA_EXPORT_MEMBERS',
                performedBy: {
                    id: adminUser.sub || adminUser.id || 'admin',
                    email: adminUser.email || 'admin@platform.local',
                    name: adminUser.name || 'Admin',
                    role: adminUser.role || 'admin',
                },
                details: {
                    format: isExcel ? 'excel' : 'csv',
                    recordCount: members.length,
                    filterQuery: filters,
                    filename,
                },
                ipAddress,
                userAgent,
            })
                .catch(() => { });
        }
        return res.status(200).send(csv);
    }
};
exports.MembershipService = MembershipService;
exports.MembershipService = MembershipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(1, (0, mongoose_1.InjectModel)(membership_plan_schema_1.MembershipPlan.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(area_schema_1.Area.name)),
    __param(4, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], MembershipService);
//# sourceMappingURL=membership.service.js.map
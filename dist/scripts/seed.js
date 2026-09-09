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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
async function seed() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const db = mongoose_1.default.connection.db;
    const adminEmail = 'superadmin@madiyayu.com';
    const existing = await db.collection('adminusers').findOne({ email: adminEmail });
    if (!existing) {
        const passwordHash = await bcrypt.hash('Admin@123', 10);
        await db.collection('adminusers').insertOne({
            name: 'Super Admin',
            email: adminEmail,
            passwordHash,
            role: 'super_admin',
            isSuperAdmin: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ Super Admin created — email: superadmin@madiyayu.com | password: Admin@123');
    }
    else {
        console.log('ℹ️  Super Admin already exists');
    }
    const tenantSlug = 'demo';
    const existingTenant = await db.collection('tenants').findOne({ slug: tenantSlug });
    let tenantId;
    if (!existingTenant) {
        const result = await db.collection('tenants').insertOne({
            slug: tenantSlug,
            name: 'Demo Leader',
            status: 'active',
            branding: {
                primaryColor: '#1a56db',
                secondaryColor: '#f59e0b',
                leaderName: 'Demo Leader',
                tagline: 'Vikas ki nayi raah',
            },
            settings: {
                registrationFields: [
                    { key: 'name', label: 'Full Name', type: 'text', required: true },
                    { key: 'mobile', label: 'Mobile Number', type: 'phone', required: true },
                    { key: 'dob', label: 'Date of Birth', type: 'date', required: false },
                    { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
                    { key: 'area', label: 'Your Area', type: 'area_selector', required: true },
                ],
                areaLevels: ['Block', 'Gram Panchayat', 'Village', 'Ward'],
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        tenantId = result.insertedId;
        console.log(`✅ Demo tenant created — slug: ${tenantSlug}`);
    }
    else {
        tenantId = existingTenant._id;
        console.log('ℹ️  Demo tenant already exists');
    }
    const featureKeys = [
        'complaints', 'works', 'events', 'polls', 'membership',
        'volunteers', 'gallery', 'manifesto', 'poster_generator',
        'notifications', 'banners',
    ];
    for (const featureKey of featureKeys) {
        await db.collection('tenantfeatures').updateOne({ tenantId: new mongoose_1.default.Types.ObjectId(tenantId), featureKey }, { $set: { tenantId: new mongoose_1.default.Types.ObjectId(tenantId), featureKey, isEnabled: true, config: {}, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
    }
    console.log('✅ All features enabled for demo tenant');
    const levels = [
        { levelOrder: 1, name: 'Block' },
        { levelOrder: 2, name: 'Gram Panchayat' },
        { levelOrder: 3, name: 'Village' },
        { levelOrder: 4, name: 'Ward' },
    ];
    for (const level of levels) {
        await db.collection('arealevels').updateOne({ tenantId: new mongoose_1.default.Types.ObjectId(tenantId), levelOrder: level.levelOrder }, { $set: { tenantId: new mongoose_1.default.Types.ObjectId(tenantId), ...level, isRequired: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
    }
    console.log('✅ Area levels seeded for demo tenant');
    const demoAdminEmail = 'admin@demo.com';
    const existingDemoAdmin = await db.collection('adminusers').findOne({ email: demoAdminEmail, tenantId });
    if (!existingDemoAdmin) {
        const passwordHash = await bcrypt.hash('Demo@123', 10);
        await db.collection('adminusers').insertOne({
            tenantId,
            name: 'Demo Admin',
            email: demoAdminEmail,
            passwordHash,
            role: 'admin',
            isSuperAdmin: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log('✅ Demo tenant admin created — email: admin@demo.com | password: Demo@123');
    }
    else {
        console.log('ℹ️  Demo admin already exists');
    }
    await mongoose_1.default.disconnect();
    console.log('\n🎉 Seed complete!');
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
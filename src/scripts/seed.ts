import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db!;

  // ── 1. Super Admin ──────────────────────────────────────────────
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
  } else {
    console.log('ℹ️  Super Admin already exists');
  }

  // ── 2. Demo Tenant ──────────────────────────────────────────────
  const tenantSlug = 'demo';
  const existingTenant = await db.collection('tenants').findOne({ slug: tenantSlug });

  let tenantId: mongoose.Types.ObjectId;

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
  } else {
    tenantId = existingTenant._id;
    console.log('ℹ️  Demo tenant already exists');
  }

  // ── 3. Enable all features for demo tenant ──────────────────────
  const featureKeys = [
    'complaints', 'works', 'events', 'polls', 'membership',
    'volunteers', 'gallery', 'manifesto', 'poster_generator',
    'notifications', 'banners',
  ];

  for (const featureKey of featureKeys) {
    await db.collection('tenantfeatures').updateOne(
      { tenantId: new mongoose.Types.ObjectId(tenantId), featureKey },
      { $set: { tenantId: new mongoose.Types.ObjectId(tenantId), featureKey, isEnabled: true, config: {}, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log('✅ All features enabled for demo tenant');

  // ── 4. Demo Area Levels ─────────────────────────────────────────
  const levels = [
    { levelOrder: 1, name: 'Block' },
    { levelOrder: 2, name: 'Gram Panchayat' },
    { levelOrder: 3, name: 'Village' },
    { levelOrder: 4, name: 'Ward' },
  ];

  for (const level of levels) {
    await db.collection('arealevels').updateOne(
      { tenantId: new mongoose.Types.ObjectId(tenantId), levelOrder: level.levelOrder },
      { $set: { tenantId: new mongoose.Types.ObjectId(tenantId), ...level, isRequired: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
  }
  console.log('✅ Area levels seeded for demo tenant');

  // ── 5. Demo Admin User for tenant ──────────────────────────────
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
  } else {
    console.log('ℹ️  Demo admin already exists');
  }

  await mongoose.disconnect();
  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

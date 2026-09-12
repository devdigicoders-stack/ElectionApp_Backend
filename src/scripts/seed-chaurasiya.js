const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/political';

async function seedChaurasiya() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;

  const tenant = await db.collection('tenants').findOne({ slug: 'chaurasiya' });
  if (!tenant) {
    console.error('Tenant chaurasiya not found!');
    process.exit(1);
  }

  const tenantId = tenant._id;
  console.log('Seeding for tenant:', tenant.name, '(', tenantId, ')');

  // 1. Area Levels
  await db.collection('arealevels').deleteMany({ tenantId });
  const blockLevel = await db.collection('arealevels').insertOne({
    tenantId,
    levelOrder: 1,
    name: 'Block',
    isRequired: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const wardLevel = await db.collection('arealevels').insertOne({
    tenantId,
    levelOrder: 2,
    name: 'Ward',
    isRequired: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 2. Areas
  await db.collection('areas').deleteMany({ tenantId });
  const mainBlock = await db.collection('areas').insertOne({
    tenantId,
    levelId: blockLevel.insertedId,
    name: 'Chaurasiya Central Block',
    code: 'CCB-01',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const ward1 = await db.collection('areas').insertOne({
    tenantId,
    levelId: wardLevel.insertedId,
    parentId: mainBlock.insertedId,
    name: 'Ward 1 - Gandhi Nagar',
    code: 'W-01',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const ward2 = await db.collection('areas').insertOne({
    tenantId,
    levelId: wardLevel.insertedId,
    parentId: mainBlock.insertedId,
    name: 'Ward 2 - Subhash Chowk',
    code: 'W-02',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const ward3 = await db.collection('areas').insertOne({
    tenantId,
    levelId: wardLevel.insertedId,
    parentId: mainBlock.insertedId,
    name: 'Ward 3 - Vikas Nagar',
    code: 'W-03',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const areaIds = [ward1.insertedId, ward2.insertedId, ward3.insertedId];

  // 3. Citizens / Users
  await db.collection('users').deleteMany({ tenantId });
  const citizensData = [
    { name: 'Ramesh Chaurasiya', mobile: '9876543210', gender: 'Male', tags: ['VIP', 'Trader'], category: 'supporter', areaId: areaIds[0] },
    { name: 'Pooja Verma', mobile: '9876543211', gender: 'Female', tags: ['Youth', 'Student'], category: 'citizen', areaId: areaIds[0] },
    { name: 'Amit Kumar Singh', mobile: '9876543212', gender: 'Male', tags: ['Farmer', 'Supporter'], category: 'supporter', areaId: areaIds[1] },
    { name: 'Sunita Devi', mobile: '9876543213', gender: 'Female', tags: ['Women Wing'], category: 'citizen', areaId: areaIds[1] },
    { name: 'Vikas Pandey', mobile: '9876543214', gender: 'Male', tags: ['Youth', 'Volunteer'], category: 'volunteer', areaId: areaIds[2] },
    { name: 'Rajendra Prasad', mobile: '9876543215', gender: 'Male', tags: ['Senior Citizen', 'VIP'], category: 'member', areaId: areaIds[2] },
    { name: 'Anjali Gupta', mobile: '9876543216', gender: 'Female', tags: ['Teacher'], category: 'citizen', areaId: areaIds[0] },
    { name: 'Manoj Tiwari', mobile: '9876543217', gender: 'Male', tags: ['Karyakarta'], category: 'volunteer', areaId: areaIds[1] },
  ];

  const userDocs = [];
  for (const c of citizensData) {
    const res = await db.collection('users').insertOne({
      tenantId,
      name: c.name,
      mobile: c.mobile,
      gender: c.gender,
      tags: c.tags,
      category: c.category,
      status: 'active',
      areaId: c.areaId,
      isActive: true,
      isProfileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    userDocs.push({ ...c, _id: res.insertedId });
  }

  // 4. Complaints
  await db.collection('complaints').deleteMany({ tenantId });
  const complaintsData = [
    {
      complaintNumber: 'CMP-2026-000001',
      title: 'Main road CC patch work required',
      description: 'Ward 1 main bazaar road is broken causing traffic and waterlogging.',
      category: 'Road & Infrastructure',
      status: 'submitted',
      priority: 'high',
      userId: userDocs[0]._id,
      areaId: areaIds[0],
    },
    {
      complaintNumber: 'CMP-2026-000002',
      title: 'Street light repair at Subhash Chowk',
      description: '4 street light poles not functioning since last week.',
      category: 'Electricity',
      status: 'under_review',
      priority: 'medium',
      userId: userDocs[1]._id,
      areaId: areaIds[1],
    },
    {
      complaintNumber: 'CMP-2026-000003',
      title: 'Drinking water pipeline leakage',
      description: 'Water pipeline burst near government primary school.',
      category: 'Water Supply',
      status: 'assigned',
      priority: 'urgent',
      userId: userDocs[2]._id,
      areaId: areaIds[2],
    },
    {
      complaintNumber: 'CMP-2026-000004',
      title: 'Drainage cleaning and sanitation',
      description: 'Nala chocked with garbage before monsoon, needs urgent suction.',
      category: 'Sanitation',
      status: 'in_progress',
      priority: 'high',
      userId: userDocs[3]._id,
      areaId: areaIds[0],
    },
    {
      complaintNumber: 'CMP-2026-000005',
      title: 'Transformer overload issue resolved',
      description: 'Voltage fluctuation resolved after installing 100kVA transformer.',
      category: 'Electricity',
      status: 'resolved',
      priority: 'high',
      userId: userDocs[4]._id,
      areaId: areaIds[1],
    },
    {
      complaintNumber: 'CMP-2026-000006',
      title: 'Handpump borewell repair completed',
      description: 'New cylinder installed and clean water flow restored.',
      category: 'Water Supply',
      status: 'resolved',
      priority: 'medium',
      userId: userDocs[5]._id,
      areaId: areaIds[2],
    },
  ];

  for (const cmp of complaintsData) {
    await db.collection('complaints').insertOne({
      tenantId,
      ...cmp,
      attachments: [],
      mediaUrls: [],
      timeline: [
        { status: cmp.status, note: 'Initial ticket recorded', updatedAt: new Date() },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 5. Works (Vikas Karya)
  await db.collection('works').deleteMany({ tenantId });
  const worksData = [
    {
      title: 'Interlocking Road & Drain Construction',
      description: '800 meter CC interlocking tiles road with underground storm drain.',
      category: 'Infrastructure',
      areaId: areaIds[0],
      status: 'completed',
      isPublished: true,
      budget: '₹ 18.5 Lakhs',
      images: ['https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=800'],
    },
    {
      title: 'Solar High-Mast Light Installation',
      description: 'High-mast LED solar towers at 5 key intersections for 24x7 security.',
      category: 'Renewable Energy',
      areaId: areaIds[1],
      status: 'in_progress',
      isPublished: true,
      budget: '₹ 8.2 Lakhs',
      images: ['https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800'],
    },
    {
      title: 'Community Health Sub-Centre Renovation',
      description: 'Upgrading OPD room, pharmacy counter, and patient waiting shed.',
      category: 'Healthcare',
      areaId: areaIds[2],
      status: 'upcoming',
      isPublished: true,
      budget: '₹ 24.0 Lakhs',
      images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'],
    },
  ];

  for (const w of worksData) {
    await db.collection('works').insertOne({
      tenantId,
      ...w,
      beforeAfter: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 6. Events
  await db.collection('events').deleteMany({ tenantId });
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  const nextFortnight = new Date();
  nextFortnight.setDate(nextFortnight.getDate() + 10);

  await db.collection('events').insertOne({
    tenantId,
    title: 'Jan Sabha & Voter Abhaar Sammelan',
    description: 'Direct interaction with ward citizens and review of upcoming development works.',
    category: 'Jan Sabha',
    startDate: nextWeek,
    startTime: '10:30 AM',
    endTime: '02:00 PM',
    location: 'Gandhi Nagar Community Ground',
    areaId: areaIds[0],
    isPublished: true,
    registeredCount: 45,
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.collection('events').insertOne({
    tenantId,
    title: 'Booth Karyakarta Prashikshan Camp',
    description: 'Training camp for booth agents and digital campaign volunteers.',
    category: 'Special Event',
    startDate: nextFortnight,
    startTime: '11:00 AM',
    endTime: '04:00 PM',
    location: 'Subhash Chowk Party Office',
    areaId: areaIds[1],
    isPublished: true,
    registeredCount: 60,
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 7. Membership
  await db.collection('memberships').deleteMany({ tenantId });
  const members = [
    { userId: userDocs[0]._id, status: 'approved', membershipNumber: 'CJP-2026-00101', designation: 'General Member' },
    { userId: userDocs[2]._id, status: 'approved', membershipNumber: 'CJP-2026-00102', designation: 'Active Member' },
    { userId: userDocs[5]._id, status: 'approved', membershipNumber: 'CJP-2026-00103', designation: 'Senior Advisor' },
    { userId: userDocs[6]._id, status: 'pending', designation: 'Applicant' },
  ];
  for (const m of members) {
    await db.collection('memberships').insertOne({
      tenantId,
      ...m,
      cardVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // 8. Volunteers
  await db.collection('volunteers').deleteMany({ tenantId });
  await db.collection('volunteers').insertOne({
    tenantId,
    userId: userDocs[4]._id,
    role: 'Ward Coordinator',
    assignedAreaId: areaIds[2],
    status: 'active',
    tasks: ['Booth verification', 'Flyer distribution'],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await db.collection('volunteers').insertOne({
    tenantId,
    userId: userDocs[7]._id,
    role: 'Social Media & Tech Volunteer',
    assignedAreaId: areaIds[1],
    status: 'active',
    tasks: ['Poster sharing', 'WhatsApp group management'],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 9. Polls
  await db.collection('polls').deleteMany({ tenantId });
  await db.collection('polls').insertOne({
    tenantId,
    question: 'Ward me agle vikas karya ke roop me kisse pehli prathmikta milni chahiye?',
    description: 'Voters apni raay dekar vikas prathmikta tay karein.',
    category: 'Development',
    options: [
      { optionId: 'opt_1', text: 'Clean Drinking Water Plant (RO)', votes: 28 },
      { optionId: 'opt_2', text: 'Solar Street Lights at dark spots', votes: 19 },
      { optionId: 'opt_3', text: 'CCTV Camera Surveillance Network', votes: 34 },
      { optionId: 'opt_4', text: 'Park Beautification & Open Gym', votes: 15 },
    ],
    targetAudience: 'ALL',
    resultVisibility: 'ALWAYS_PUBLIC',
    allowRevote: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 10. Banners
  await db.collection('banners').deleteMany({ tenantId });
  await db.collection('banners').insertOne({
    tenantId,
    title: 'Seva, Samarpan aur Vikas ka Sankalp',
    subtitle: 'Chaurasiya Janta Party ki taraf se sabhi kshetravasiyon ka swagat hai',
    imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200',
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ SEED SUCCESSFUL FOR CHAURASIYA!');
  await mongoose.disconnect();
}

seedChaurasiya().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

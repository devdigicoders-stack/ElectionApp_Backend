const mongoose = require('mongoose');

const uri = 'mongodb+srv://devdigicoders_db_user:2U1UIdY6iXYR77t0@madiyayu.vi5hphm.mongodb.net/madiyayu?appName=madiyayu';

async function checkManifestos() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully.');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const manifestos = await db.collection('manifestos').find({}).toArray();
    console.log(`\n=== Total Manifesto Count: ${manifestos.length} ===`);
    console.log(JSON.stringify(manifestos, null, 2));

    const tenants = await db.collection('tenants').find({}).toArray();
    console.log(`\n=== Tenants: ===`);
    console.log(JSON.stringify(tenants.map(t => ({ _id: t._id, slug: t.slug, name: t.name })), null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkManifestos();

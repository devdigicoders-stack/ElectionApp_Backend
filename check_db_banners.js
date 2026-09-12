const mongoose = require('mongoose');

const uri = 'mongodb+srv://devdigicoders_db_user:2U1UIdY6iXYR77t0@madiyayu.vi5hphm.mongodb.net/madiyayu?appName=madiyayu';

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully!');
    
    const db = mongoose.connection.db;
    
    // Check all tenants
    const tenants = await db.collection('tenants').find({}).toArray();
    console.log('\n--- ALL TENANTS IN DATABASE ---');
    tenants.forEach(t => console.log(`- ID: ${t._id}, Name: ${t.name}, Slug: ${t.slug}, Status: ${t.status}`));
    
    // Check all banners
    const banners = await db.collection('banners').find({}).toArray();
    console.log(`\n--- ALL BANNERS IN DATABASE (Total: ${banners.length}) ---`);
    banners.forEach(b => console.log(JSON.stringify(b, null, 2)));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error querying MongoDB:', err);
  }
}

run();

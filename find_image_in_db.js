const mongoose = require('mongoose');

const uri = 'mongodb+srv://devdigicoders_db_user:2U1UIdY6iXYR77t0@madiyayu.vi5hphm.mongodb.net/madiyayu?appName=madiyayu';

async function listAll() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log('\n--- COLLECTIONS IN DATABASE ---');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name.padEnd(25)} : ${count} docs`);
      
      // Search for '1789024147926-709797.png'
      const found = await db.collection(col.name).find({
        $or: [
          { imageUrl: { $regex: '1789024147926-709797' } },
          { url: { $regex: '1789024147926-709797' } },
          { coverImage: { $regex: '1789024147926-709797' } },
          { coverImageUrl: { $regex: '1789024147926-709797' } },
          { thumbnail: { $regex: '1789024147926-709797' } },
          { photo: { $regex: '1789024147926-709797' } },
          { photoUrl: { $regex: '1789024147926-709797' } },
          { 'branding.logoUrl': { $regex: '1789024147926-709797' } },
          { 'branding.heroBannerUrl': { $regex: '1789024147926-709797' } },
          { 'branding.leaderPhotoUrl': { $regex: '1789024147926-709797' } }
        ]
      }).toArray();
      
      if (found.length > 0) {
        console.log(`  >>> FOUND in collection '${col.name}':`, JSON.stringify(found, null, 2));
      }
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

listAll();

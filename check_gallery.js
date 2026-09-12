const mongoose = require('mongoose');

const uri = 'mongodb+srv://devdigicoders_db_user:2U1UIdY6iXYR77t0@madiyayu.vi5hphm.mongodb.net/madiyayu?appName=madiyayu';

async function checkGallery() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    const gallery = await db.collection('galleries').find({}).toArray();
    console.log(`\n--- ALL GALLERY ITEMS IN DATABASE (${gallery.length}) ---`);
    gallery.forEach(g => console.log(JSON.stringify(g, null, 2)));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkGallery();

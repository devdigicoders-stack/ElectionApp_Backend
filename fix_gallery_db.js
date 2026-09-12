const mongoose = require('mongoose');

const uri = 'mongodb+srv://devdigicoders_db_user:2U1UIdY6iXYR77t0@madiyayu.vi5hphm.mongodb.net/madiyayu?appName=madiyayu';

async function fixGallery() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    // Update the broken gallery item with a clean URL
    const res = await db.collection('galleryitems').updateOne(
      { _id: new mongoose.Types.ObjectId("6aa25794047399178f4651ec") },
      {
        $set: {
          url: '/event_jan_sabha.jpg',
          title: 'Kisan Sammelan 2026'
        }
      }
    );
    console.log('Gallery item fixed in MongoDB:', res);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

fixGallery();

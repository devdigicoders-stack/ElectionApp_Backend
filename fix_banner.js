const mongoose = require('mongoose');

const uri = 'mongodb+srv://devdigicoders_db_user:2U1UIdY6iXYR77t0@madiyayu.vi5hphm.mongodb.net/madiyayu?appName=madiyayu';

async function fixBanner() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    // Update the banner to active and clean image URL
    const result = await db.collection('banners').updateOne(
      { _id: new mongoose.Types.ObjectId("6aa250bb047399178f4651e8") },
      {
        $set: {
          isActive: true,
          imageUrl: 'https://i.ytimg.com/vi/2o06aos3fPs/maxresdefault.jpg',
          title: 'जनसंपर्क एवं विकास यात्रा 2026',
          linkUrl: '/events',
          sortOrder: 1
        }
      }
    );
    
    console.log('Banner updated successfully:', result);
    
    const banner = await db.collection('banners').findOne({ _id: new mongoose.Types.ObjectId("6aa250bb047399178f4651e8") });
    console.log('\nUpdated Banner in DB:', JSON.stringify(banner, null, 2));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error updating banner:', err);
  }
}

fixBanner();

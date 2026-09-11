const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/political');
  const db = mongoose.connection.db;
  const hash = await bcrypt.hash('Admin@123', 10);
  await db.collection('adminusers').updateOne(
    { email: 'vkraj7068@gmail.com' },
    { $set: { passwordHash: hash } }
  );
  console.log('✅ Admin password set to Admin@123 for vkraj7068@gmail.com');
  await mongoose.disconnect();
}
run();

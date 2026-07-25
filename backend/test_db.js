const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const profiles = await db.collection('astrologyprofiles').find({}).toArray();
    
    profiles.forEach(p => {
      console.log(`Profile: ${p.name}, DOB: ${p.dateOfBirth}, TOB: ${p.timeOfBirth}, TZ: ${p.timezone}`);
      
      const dateObj = p.dateOfBirth;
      const dateStr = (dateObj instanceof Date ? dateObj.toISOString() : String(dateObj)).split('T')[0];
      const isoString = `${dateStr}T${p.timeOfBirth}:00`;
      console.log(` -> isoString: ${isoString}`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkDB();

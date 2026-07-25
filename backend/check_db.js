const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const AstrologyProfile = require('./src/models/AstrologyProfile').default;

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const profiles = await AstrologyProfile.find().lean();
  console.log(JSON.stringify(profiles, null, 2));
  process.exit(0);
}
check();

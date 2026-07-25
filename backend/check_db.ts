import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import AstrologyProfile from './src/models/AstrologyProfile';

async function check() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const profiles = await AstrologyProfile.find().lean();
  console.log(JSON.stringify(profiles, null, 2));
  process.exit(0);
}
check();

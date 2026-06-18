import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

mongoose.connect(process.env.MONGO_URI as string).then(async () => {
  const users = await User.find({});
  console.log("Users lastActiveAt:");
  users.forEach(u => console.log(u.email, u.lastActiveAt));
  process.exit();
});

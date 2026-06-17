import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    const adminEmail = 'superadmin@goalpilot.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.password = 'Admin@1234';
      await existingAdmin.save(); // This will trigger the pre-save hook and hash it correctly
      console.log('Fixed password for superadmin@goalpilot.com');
    } else {
      console.log('Admin not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin:', error);
    process.exit(1);
  }
};

fixAdmin();

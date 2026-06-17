import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    const adminEmail = 'superadmin@goalpilot.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('SuperAdmin already exists with email: superadmin@goalpilot.com');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@1234', salt);

    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'SuperAdmin',
      status: 'Active'
    });

    console.log('\n=========================================');
    console.log('SUPER ADMIN ACCOUNT CREATED SUCCESSFULLY');
    console.log('Email: superadmin@goalpilot.com');
    console.log('Password: Admin@1234');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

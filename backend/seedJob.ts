import mongoose from 'mongoose';
import Job from './src/models/Job';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/goalpilot');

const seed = async () => {
  try {
    await Job.create({
      title: 'React Developer',
      company: 'TCS',
      location: 'Chennai',
      experience: '2 Years',
      link: 'https://careers.tcs.com/react-dev-chennai',
      hash: 'manual-seed-tcs-react-chennai-' + Date.now(),
      discoveredAt: new Date()
    });
    console.log('Seeded job successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

require('dotenv').config();
const mongoose = require('mongoose');

async function fixLinks() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const jobs = await db.collection('jobs').find({}).toArray();
  
  for (const job of jobs) {
    if (job.link && job.link.includes('/job/')) {
      const baseUrl = job.link.split('/job/')[0];
      const newLink = `${baseUrl}?q=${encodeURIComponent(job.title)}`;
      await db.collection('jobs').updateOne({ _id: job._id }, { $set: { link: newLink } });
    }
  }
  
  console.log('Fixed job links!');
  process.exit(0);
}

fixLinks();

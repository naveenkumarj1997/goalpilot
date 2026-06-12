import mongoose from 'mongoose';
import dotenv from 'dotenv';
// @ts-ignore
import ytSearch from 'yt-search';
import Exercise from '../models/Exercise';

dotenv.config();

async function fetchVideos() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/goalpilot');
    console.log('Connected to MongoDB');

    const exercises = await Exercise.find({});
    console.log(`Found ${exercises.length} exercises. Fetching video IDs...`);

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (!ex.animationUrl) {
        console.log(`[${i+1}/${exercises.length}] Searching video for: ${ex.name}...`);
        
        try {
          const r = await ytSearch(`how to do ${ex.name} exercise tutorial`);
          const videos = r.videos;
          if (videos.length > 0) {
            ex.animationUrl = videos[0].videoId;
            await ex.save();
            console.log(`   -> Found: ${videos[0].title} (${videos[0].videoId})`);
          } else {
            console.log(`   -> No video found for ${ex.name}`);
          }
        } catch (err) {
          console.error(`   -> Error searching for ${ex.name}:`, err);
        }
        
        // Wait 500ms to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log(`[${i+1}/${exercises.length}] Skipped ${ex.name} (already has video ID: ${ex.animationUrl})`);
      }
    }

    console.log('Done populating video IDs!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fetchVideos();

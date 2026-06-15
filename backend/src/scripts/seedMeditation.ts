import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MeditationLesson from '../models/MeditationLesson';
import MeditationProfile from '../models/MeditationProfile';
import MeditationLog from '../models/MeditationLog';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goalpilot';

const seedMeditationData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Database');

    // Clear existing data
    await MeditationLesson.deleteMany();
    console.log('Cleared existing Meditation Library data');

    // --- LESSONS ---
    const lessons = [
      {
        title: '5-Minute Quick Reset',
        videoId: 'inpok4MKVLM', // Goodful 5-Minute Meditation
        durationMinutes: 5,
        difficulty: 'Beginner',
        category: 'Mindfulness',
        description: 'A quick 5-minute meditation you can do anywhere to reset your mind and find calm.',
      },
      {
        title: '10-Minute Meditation For Anxiety',
        videoId: 'O-6f5wQXSu8', // Goodful 10 min anxiety
        durationMinutes: 10,
        difficulty: 'Beginner',
        category: 'Stress Relief',
        description: 'Take 10 minutes to release anxiety and ground yourself in the present moment.',
      },
      {
        title: 'Deep Sleep & Relaxation',
        videoId: 'ZToicYcHIOU', // Goodful 10 min sleep
        durationMinutes: 10,
        difficulty: 'Beginner',
        category: 'Sleep Meditation',
        description: 'A soothing guided meditation to help you fall asleep fast and experience deep rest.',
      },
      {
        title: 'Morning Clarity & Focus',
        videoId: 'tEmt1Znux58', // Goodful 10 min morning
        durationMinutes: 10,
        difficulty: 'Intermediate',
        category: 'Morning Meditation',
        description: 'Start your day with intention, clarity, and focus.',
      },
      {
        title: 'Deep Focus & Concentration',
        videoId: '4pLUleLdwY4', // Goodful 10 min focus
        durationMinutes: 10,
        difficulty: 'Intermediate',
        category: 'Focus Meditation',
        description: 'A guided session to help you eliminate distractions and improve your concentration.',
      },
      {
        title: 'Guided Breathing for Relaxation',
        videoId: 'aNXKjGFUlMs', // 5 Min box breathing example
        durationMinutes: 5,
        difficulty: 'Beginner',
        category: 'Breathing',
        description: 'Follow this visual and audio guide to practice box breathing for immediate stress relief.',
      },
      {
        title: 'Gratitude & Inner Peace',
        videoId: 'U9YKY7fdwyg', // Goodful 15 min gratitude
        durationMinutes: 15,
        difficulty: 'Intermediate',
        category: 'Gratitude',
        description: 'Cultivate gratitude and self-love in this 15-minute gentle guided journey.',
      }
    ];

    await MeditationLesson.insertMany(lessons);
    console.log(`Inserted ${lessons.length} Meditation Lessons`);

    console.log('Meditation Seeding Completed Successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedMeditationData();

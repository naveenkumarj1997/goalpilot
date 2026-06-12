import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  targetMuscles: [{ type: String }], // e.g. 'Chest', 'Triceps'
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  equipment: { type: String, enum: ['None', 'Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Bench'], default: 'None' },
  category: { type: String, enum: ['Full Body', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Fat Loss', 'Muscle Building', 'Strength', 'Beginner Workouts'] },
  defaultSets: { type: Number, default: 3 },
  defaultReps: { type: Number, default: 10 }, // or duration in seconds
  defaultRestTime: { type: Number, default: 60 }, // in seconds
  animationUrl: { type: String } // URL to gif/video/image
});

export default mongoose.model('Exercise', exerciseSchema);

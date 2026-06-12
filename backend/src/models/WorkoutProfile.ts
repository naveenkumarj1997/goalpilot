import mongoose from 'mongoose';

const workoutProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, required: true },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // in kg
  fitnessLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  goal: { type: String, enum: ['Weight Loss', 'Fat Loss', 'Muscle Gain', 'Strength', 'Endurance', 'General Fitness'], required: true },
  equipment: [{ type: String, enum: ['None', 'Dumbbells', 'Resistance Bands', 'Pull-up Bar', 'Bench'] }],
  daysPerWeek: { type: Number, required: true },
  timePerDay: { type: Number, required: true }, // in minutes
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('WorkoutProfile', workoutProfileSchema);

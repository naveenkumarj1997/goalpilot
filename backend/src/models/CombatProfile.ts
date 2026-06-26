import mongoose from 'mongoose';

const combatProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number }, // in cm
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  goals: [{ type: String }],
  equipment: [{ type: String }],
  
  // Stats
  trainingHours: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  workoutsCompleted: { type: Number, default: 0 },
  punchCount: { type: Number, default: 0 },
  roundsCompleted: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastWorkoutDate: { type: Date },
  
  // Achievements
  achievements: [{
    title: { type: String },
    unlockedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('CombatProfile', combatProfileSchema);

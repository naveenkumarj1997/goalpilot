import mongoose, { Document, Schema } from 'mongoose';

export interface IMeditationProfile extends Document {
  user: mongoose.Types.ObjectId;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  primaryGoal: 'Better Focus' | 'Better Sleep' | 'Stress Relief' | 'Anxiety Management' | 'General Wellness' | null;
  sessionsCompleted: number;
  totalMinutesPracticed: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: Date | null;
  favorites: mongoose.Types.ObjectId[];
}

const meditationProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  experienceLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', null],
    default: null
  },
  primaryGoal: {
    type: String,
    enum: ['Better Focus', 'Better Sleep', 'Stress Relief', 'Anxiety Management', 'General Wellness', null],
    default: null
  },
  sessionsCompleted: { type: Number, default: 0 },
  totalMinutesPracticed: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastSessionDate: { type: Date, default: null },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'MeditationLesson' }]
}, { timestamps: true });

export default mongoose.model<IMeditationProfile>('MeditationProfile', meditationProfileSchema);

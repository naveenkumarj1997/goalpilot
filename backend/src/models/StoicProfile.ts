import mongoose, { Document, Schema } from 'mongoose';

export interface IStoicProfile extends Document {
  user: mongoose.Types.ObjectId;
  lessonsCompleted: number;
  exercisesCompleted: number;
  journalEntries: number;
  dailyChallengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  completedLessonIds: string[];
  achievements: string[];
}

const stoicProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  lessonsCompleted: { type: Number, default: 0 },
  exercisesCompleted: { type: Number, default: 0 },
  journalEntries: { type: Number, default: 0 },
  dailyChallengesCompleted: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  completedLessonIds: [{ type: String }],
  achievements: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IStoicProfile>('StoicProfile', stoicProfileSchema);

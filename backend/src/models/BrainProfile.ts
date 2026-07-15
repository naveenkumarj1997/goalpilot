import mongoose, { Document, Schema } from 'mongoose';

export interface IBrainProfile extends Document {
  user: mongoose.Types.ObjectId;
  age: number;
  profession: 'Student' | 'Professional';
  learningGoals: string[];
  examPreparation: boolean;
  interviewPreparation: boolean;
  dailyStudyHours: number;
  preferredSubjects: string[];
  stats: {
    xp: number;
    currentStreak: number;
    longestStreak: number;
    flashcardsReviewed: number;
    recallAccuracy: number;
    studyTimeMinutes: number;
  };
  gameScores: {
    category: string;
    gameId: string;
    score: number;
    date: Date;
  }[];
  gauntletScores: {
    totalScore: number;
    breakdown: { category: string; score: number }[];
    date: Date;
  }[];
  savedWords: {
    wordId: string;
    savedAt: Date;
  }[];
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const brainProfileSchema = new Schema<IBrainProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number, required: true },
    profession: { type: String, enum: ['Student', 'Professional'], required: true },
    learningGoals: [{ type: String }],
    examPreparation: { type: Boolean, default: false },
    interviewPreparation: { type: Boolean, default: false },
    dailyStudyHours: { type: Number, required: true },
    preferredSubjects: [{ type: String }],
    stats: {
      xp: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      flashcardsReviewed: { type: Number, default: 0 },
      recallAccuracy: { type: Number, default: 0 }, // percentage 0-100
      studyTimeMinutes: { type: Number, default: 0 },
    },
    gameScores: [{
      category: { type: String, required: true },
      gameId: { type: String, required: true },
      score: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }],
    gauntletScores: [{
      totalScore: { type: Number, required: true },
      breakdown: [{
        category: String,
        score: Number
      }],
      date: { type: Date, default: Date.now }
    }],
    savedWords: [{
      wordId: { type: String, required: true },
      savedAt: { type: Date, default: Date.now }
    }],
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBrainProfile>('BrainProfile', brainProfileSchema);

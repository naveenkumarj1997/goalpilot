import mongoose from 'mongoose';

export interface IWisdomProfile extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  languagePreference: 'en' | 'ta';
  readingStreak: number;
  lastReadDate: Date;
  wisdomScore: number;
  growthScore: number;
  booksRead: mongoose.Types.ObjectId[];
  lessonsLearned: {
    bookId: mongoose.Types.ObjectId;
    lessonNumber: number;
  }[];
  favorites: mongoose.Types.ObjectId[];
}

const wisdomProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  languagePreference: { type: String, enum: ['en', 'ta'], default: 'en' },
  readingStreak: { type: Number, default: 0 },
  lastReadDate: { type: Date, default: Date.now },
  wisdomScore: { type: Number, default: 0 },
  growthScore: { type: Number, default: 0 },
  booksRead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WisdomBook' }],
  lessonsLearned: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'WisdomBook' },
    lessonNumber: { type: Number }
  }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WisdomBook' }]
}, { timestamps: true });

export default mongoose.model<IWisdomProfile>('WisdomProfile', wisdomProfileSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IBrainFlashcard extends Document {
  deck: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  front: string;
  back: string;
  // Spaced Repetition System (SRS) Data
  nextReviewDate: Date;
  easeFactor: number; // typically starts at 2.5
  interval: number; // in days
  repetitions: number;
  createdAt: Date;
  updatedAt: Date;
}

const brainFlashcardSchema = new Schema<IBrainFlashcard>(
  {
    deck: { type: Schema.Types.ObjectId, ref: 'BrainDeck', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    nextReviewDate: { type: Date, default: Date.now },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    repetitions: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBrainFlashcard>('BrainFlashcard', brainFlashcardSchema);

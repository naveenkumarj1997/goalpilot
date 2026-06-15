import mongoose, { Document, Schema } from 'mongoose';

export interface IStoicJournal extends Document {
  user: mongoose.Types.ObjectId;
  reflection: string;
  challenge: string;
  lessonLearned: string;
  date: Date;
}

const stoicJournalSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reflection: { type: String },
  challenge: { type: String },
  lessonLearned: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IStoicJournal>('StoicJournal', stoicJournalSchema);

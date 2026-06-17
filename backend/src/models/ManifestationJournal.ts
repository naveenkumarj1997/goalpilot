import mongoose, { Document } from 'mongoose';

export interface IManifestationJournal extends Document {
  user: mongoose.Types.ObjectId;
  wentWell: string;
  progressMade: string;
  opportunitiesNoticed: string;
  gratefulFor: string;
  date: Date;
  createdAt: Date;
}

const manifestationJournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wentWell: { type: String, required: true },
  progressMade: { type: String, required: true },
  opportunitiesNoticed: { type: String, required: true },
  gratefulFor: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IManifestationJournal>('ManifestationJournal', manifestationJournalSchema);

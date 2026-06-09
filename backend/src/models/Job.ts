import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  experience: string;
  link: string;
  description?: string;
  hash: string; // Unique hash (company + title + link) to prevent duplicates
  sourceId: mongoose.Types.ObjectId;
  discoveredAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String },
    hash: { type: String, required: true, unique: true },
    sourceId: { type: Schema.Types.ObjectId, ref: 'CompanySource' },
    discoveredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for fast searching and filtering
jobSchema.index({ title: 'text', company: 'text' });
jobSchema.index({ discoveredAt: -1 });

export default mongoose.model<IJob>('Job', jobSchema);

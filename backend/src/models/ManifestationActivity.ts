import mongoose, { Document } from 'mongoose';

export interface IManifestationActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  category?: string;
  durationMinutes?: number;
  notes?: string;
  date: Date;
  createdAt: Date;
}

const manifestationActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['Habit', 'Visualization'], 
    required: true 
  },
  category: { type: String }, // e.g. "Reading", "Workout" for Habit; "Dream Job" for Visualization
  durationMinutes: { type: Number },
  notes: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IManifestationActivity>('ManifestationActivity', manifestationActivitySchema);

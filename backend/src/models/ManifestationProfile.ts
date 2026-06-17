import mongoose, { Document } from 'mongoose';

export interface IManifestationProfile extends Document {
  user: mongoose.Types.ObjectId;
  dreamCareer: string;
  dreamIncome: string;
  dreamBody: string;
  dreamLifestyle: string;
  dreamRelationships: string;
  dreamSkills: string;
  dreamHome: string;
  dreamTravel: string;
  manifestationScore: number;
  milestones: string[];
  affirmations: string[];
  opportunityTracker: Array<{
    type: string;
    title: string;
    company: string;
    status: string;
    date: Date;
    notes: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const manifestationProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dreamCareer: { type: String, default: '' },
  dreamIncome: { type: String, default: '' },
  dreamBody: { type: String, default: '' },
  dreamLifestyle: { type: String, default: '' },
  dreamRelationships: { type: String, default: '' },
  dreamSkills: { type: String, default: '' },
  dreamHome: { type: String, default: '' },
  dreamTravel: { type: String, default: '' },
  manifestationScore: { type: Number, default: 0 },
  milestones: [{ type: String }],
  affirmations: [{ type: String }],
  opportunityTracker: [{
    type: { type: String, enum: ['Interview', 'Job Opportunity', 'Networking Contact', 'Business Lead', 'Event'], required: true },
    title: { type: String, required: true },
    company: { type: String },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Lost'], default: 'Pending' },
    date: { type: Date, default: Date.now },
    notes: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model<IManifestationProfile>('ManifestationProfile', manifestationProfileSchema);

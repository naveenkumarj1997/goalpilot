import mongoose, { Document, Schema } from 'mongoose';

export interface IAstrologyProfile extends Document {
  user: mongoose.Types.ObjectId;
  isPrimary: boolean;
  relation: 'Self' | 'Friend' | 'Family' | 'Other';
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: Date; // Keep it as full date object for reference
  timeOfBirth: string; // HH:mm format
  placeOfBirth: {
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  timezone: string; // e.g. "Asia/Kolkata"
  language: string; // default 'ta' (Tamil)
  photoUrl?: string;
  
  // Computed fields (cached from ephemeris)
  ascendant?: string; // e.g. "Mesha"
  moonSign?: string;
  sunSign?: string;
  nakshatra?: string;
  pada?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const AstrologyProfileSchema = new Schema<IAstrologyProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPrimary: { type: Boolean, default: false },
    relation: { type: String, enum: ['Self', 'Friend', 'Family', 'Other'], default: 'Self' },
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    timeOfBirth: { type: String, required: true },
    placeOfBirth: {
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    timezone: { type: String, required: true },
    language: { type: String, default: 'ta' },
    photoUrl: { type: String },
    
    // Computed fields
    ascendant: { type: String },
    moonSign: { type: String },
    sunSign: { type: String },
    nakshatra: { type: String },
    pada: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.model<IAstrologyProfile>('AstrologyProfile', AstrologyProfileSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonalProfile extends Document {
  user: mongoose.Types.ObjectId;
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  occupation: string;
  goals: string[];
  confidenceLevel: number; // 1-10
  communicationLevel: number; // 1-10
  fitnessLevel: number; // 1-10
  streak: number;
  lastCheckInDate?: Date;
  completedChallenges: string[];
  completedLessons: string[];
  badges: string[];
}

const personalProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  occupation: { type: String, required: true },
  goals: [{ type: String }],
  confidenceLevel: { type: Number, required: true, min: 1, max: 10 },
  communicationLevel: { type: Number, required: true, min: 1, max: 10 },
  fitnessLevel: { type: Number, required: true, min: 1, max: 10 },
  streak: { type: Number, default: 0 },
  lastCheckInDate: { type: Date },
  completedChallenges: [{ type: String }], // Array of challenge IDs
  completedLessons: [{ type: String }], // Array of lesson IDs
  badges: [{ type: String }] // Array of badge names
}, { timestamps: true });

export default mongoose.model<IPersonalProfile>('PersonalProfile', personalProfileSchema);

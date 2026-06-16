import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonalLog extends Document {
  user: mongoose.Types.ObjectId;
  type: 'Lesson' | 'Challenge';
  itemId: string; // the ID of the lesson or challenge
  title: string;
  category: string; // Confidence, Communication, etc.
  date: Date;
  xpReward: number;
}

const personalLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Lesson', 'Challenge'], required: true },
  itemId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  xpReward: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.model<IPersonalLog>('PersonalLog', personalLogSchema);

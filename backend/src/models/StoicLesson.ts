import mongoose, { Document, Schema } from 'mongoose';

export interface IStoicLesson extends Document {
  title: string;
  category: string;
  description: string;
  explanation: string;
  realLifeExample: string;
  reflectionQuestion: string;
  keyTakeaway: string;
  order: number;
}

const stoicLessonSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  explanation: { type: String, required: true },
  realLifeExample: { type: String, required: true },
  reflectionQuestion: { type: String, required: true },
  keyTakeaway: { type: String, required: true },
  order: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IStoicLesson>('StoicLesson', stoicLessonSchema);

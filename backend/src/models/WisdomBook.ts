import mongoose from 'mongoose';

export interface DualText {
  en: string;
  ta: string;
}

export interface IWisdomLesson {
  lessonNumber: number;
  title: DualText;
  explanation: DualText;
  whyItMatters: DualText;
  example: DualText; // Crucial for local context
  actionStep: DualText;
  reflectionQuestion: DualText;
}

export interface IWisdomBook extends mongoose.Document {
  title: string;
  author: string;
  coverImage: string;
  categories: string[];
  themes: DualText[];
  overview: DualText;
  topQuotes: DualText[];
  lessons: IWisdomLesson[];
}

const dualTextSchema = new mongoose.Schema({
  en: { type: String, required: true },
  ta: { type: String, required: true }
}, { _id: false });

const wisdomLessonSchema = new mongoose.Schema({
  lessonNumber: { type: Number, required: true },
  title: { type: dualTextSchema, required: true },
  explanation: { type: dualTextSchema, required: true },
  whyItMatters: { type: dualTextSchema, required: true },
  example: { type: dualTextSchema, required: true },
  actionStep: { type: dualTextSchema, required: true },
  reflectionQuestion: { type: dualTextSchema, required: true }
});

const wisdomBookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  coverImage: { type: String, required: true },
  categories: [{ type: String }],
  themes: [dualTextSchema],
  overview: { type: dualTextSchema, required: true },
  topQuotes: [dualTextSchema],
  lessons: [wisdomLessonSchema]
}, { timestamps: true });

export default mongoose.model<IWisdomBook>('WisdomBook', wisdomBookSchema);

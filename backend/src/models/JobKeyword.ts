import mongoose, { Document, Schema } from 'mongoose';

export interface IJobKeyword extends Document {
  keyword: string;
  isActive: boolean;
  createdAt: Date;
}

const jobKeywordSchema = new Schema<IJobKeyword>({
  keyword: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IJobKeyword>('JobKeyword', jobKeywordSchema);

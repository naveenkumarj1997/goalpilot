import mongoose, { Document } from 'mongoose';

export interface IVisionBoard extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  category: string;
  caption: string;
  createdAt: Date;
}

const visionBoardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Career', 'Fitness', 'Finance', 'Lifestyle', 'Learning', 'Travel', 'Other'],
    default: 'Other'
  },
  caption: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IVisionBoard>('VisionBoard', visionBoardSchema);

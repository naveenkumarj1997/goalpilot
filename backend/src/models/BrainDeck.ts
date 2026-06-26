import mongoose, { Document, Schema } from 'mongoose';

export interface IBrainDeck extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brainDeckSchema = new Schema<IBrainDeck>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBrainDeck>('BrainDeck', brainDeckSchema);

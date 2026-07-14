import mongoose, { Document, Schema } from 'mongoose';

export interface IDream extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'Essential' | 'Important' | 'Lifestyle' | 'Luxury';
  targetCost: number;
  savedAmount: number;
  targetDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Dream' | 'BucketList';
  image: string;
  status: 'Planning' | 'Active' | 'Achieved';
  notes: string;
  dependencies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const DreamSchema = new Schema<IDream>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Essential', 'Important', 'Lifestyle', 'Luxury'], default: 'Lifestyle' },
  targetCost: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  targetDate: { type: Date, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  type: { type: String, enum: ['Dream', 'BucketList'], default: 'Dream' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['Planning', 'Active', 'Achieved'], default: 'Planning' },
  notes: { type: String, default: '' },
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Dream' }]
}, {
  timestamps: true
});

export const Dream = mongoose.model<IDream>('Dream', DreamSchema);

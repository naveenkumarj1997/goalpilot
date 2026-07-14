import mongoose, { Document, Schema } from 'mongoose';

export interface IBucketListItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  estimatedCost: number;
  timeRequirement: string;
  priority: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  completionDate?: Date;
  memories: string;
  createdAt: Date;
  updatedAt: Date;
}

const BucketListItemSchema = new Schema<IBucketListItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedCost: { type: Number, default: 0 },
  timeRequirement: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  isCompleted: { type: Boolean, default: false },
  completionDate: { type: Date },
  memories: { type: String, default: '' }
}, {
  timestamps: true
});

export const BucketListItem = mongoose.model<IBucketListItem>('BucketListItem', BucketListItemSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  name: string;
  description?: string;
  deadline?: Date;
  totalRequiredHours?: number;
  completedHours?: number;
  timeLogs: { date: Date; hours: number }[];
  priority: 'Low' | 'Medium' | 'High';
  dailyAvailableHours?: number;
  category?: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    name: {
      type: String,
      required: [true, 'Please add a goal name'],
      trim: true,
    },
    description: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    totalRequiredHours: {
      type: Number,
      min: 0,
    },
    completedHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    timeLogs: [{
      date: {
        type: Date,
        default: Date.now
      },
      hours: {
        type: Number,
        required: true
      }
    }],
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dailyAvailableHours: {
      type: Number,
      min: 0,
      max: 24,
    },
    category: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGoal>('Goal', goalSchema);

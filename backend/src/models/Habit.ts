import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  name: string;
  frequency: string;
  color?: string;
  logs: Date[]; // Array of dates when the habit was completed
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    name: {
      type: String,
      required: [true, 'Please add a habit name'],
      trim: true,
    },
    frequency: {
      type: String,
      default: 'Daily',
    },
    color: {
      type: String,
      default: '#10b981',
    },
    logs: [
      {
        type: Date,
      },
    ],
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

export default mongoose.model<IHabit>('Habit', habitSchema);

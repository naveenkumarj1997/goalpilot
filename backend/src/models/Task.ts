import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  details?: string;
  date?: Date;
  completed: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    details: {
      type: String,
    },
    date: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
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

export default mongoose.model<ITask>('Task', taskSchema);

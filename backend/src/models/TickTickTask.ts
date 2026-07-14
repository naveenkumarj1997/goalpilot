import mongoose, { Schema, Document } from 'mongoose';

export interface ITickTickTask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  endTime?: string; // HH:MM
  priority: 'High' | 'Medium' | 'Low' | 'None';
  completed: boolean;
  badge?: string;
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'custom';
    daysOfWeek?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  };
  completedDates?: string[]; // Array of 'YYYY-MM-DD' for tracking recurring task completions
  folder?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TickTickTaskSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  time: { type: String },
  endTime: { type: String },
  priority: { type: String, enum: ['High', 'Medium', 'Low', 'None'], default: 'None' },
  completed: { type: Boolean, default: false },
  badge: { type: String },
  recurrence: {
    type: { type: String, enum: ['none', 'daily', 'weekly', 'custom'], default: 'none' },
    daysOfWeek: [{ type: Number }]
  },
  completedDates: [{ type: String }],
  folder: { type: String, default: 'Inbox' },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<ITickTickTask>('TickTickTask', TickTickTaskSchema);

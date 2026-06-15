import mongoose, { Document, Schema } from 'mongoose';

export interface IMeditationLog extends Document {
  user: mongoose.Types.ObjectId;
  lesson?: mongoose.Types.ObjectId; // Optional: If they did a guided lesson
  type: 'Guided' | 'Timer' | 'Breathing';
  durationMinutes: number;
  date: Date;
  moodBefore?: 'Stressed' | 'Anxious' | 'Neutral' | 'Calm' | 'Happy';
  moodAfter?: 'Stressed' | 'Anxious' | 'Neutral' | 'Calm' | 'Happy';
  notes?: string;
}

const meditationLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: Schema.Types.ObjectId, ref: 'MeditationLesson', required: false },
  type: {
    type: String,
    enum: ['Guided', 'Timer', 'Breathing'],
    required: true
  },
  durationMinutes: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  moodBefore: { 
    type: String,
    enum: ['Stressed', 'Anxious', 'Neutral', 'Calm', 'Happy'],
    required: false
  },
  moodAfter: { 
    type: String,
    enum: ['Stressed', 'Anxious', 'Neutral', 'Calm', 'Happy'],
    required: false
  },
  notes: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IMeditationLog>('MeditationLog', meditationLogSchema);

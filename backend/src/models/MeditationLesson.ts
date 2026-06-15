import mongoose, { Document, Schema } from 'mongoose';

export interface IMeditationLesson extends Document {
  title: string;
  description: string;
  videoId: string; // Used for embedded YouTube guided meditations/music
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Morning Meditation' | 'Sleep Meditation' | 'Focus Meditation' | 'Stress Relief' | 'Breathing' | 'Mindfulness' | 'Gratitude';
  type: 'Video' | 'Audio';
}

const meditationLessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoId: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Morning Meditation', 'Sleep Meditation', 'Focus Meditation', 'Stress Relief', 'Breathing', 'Mindfulness', 'Gratitude'],
    required: true 
  },
  type: {
    type: String,
    enum: ['Video', 'Audio'],
    default: 'Video'
  }
}, { timestamps: true });

export default mongoose.model<IMeditationLesson>('MeditationLesson', meditationLessonSchema);

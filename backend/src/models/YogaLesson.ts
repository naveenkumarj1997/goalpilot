import mongoose from 'mongoose';

const yogaLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true // YouTube Video ID
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  category: {
    type: String,
    enum: ['Morning Yoga', 'Evening Yoga', 'Flexibility', 'Back Pain Relief', 'Relaxation', 'Stress Relief', 'Balance', 'Mobility', 'Full Body Yoga', 'Meditation'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  poses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YogaPose'
  }]
}, {
  timestamps: true
});

const YogaLesson = mongoose.model('YogaLesson', yogaLessonSchema);
export default YogaLesson;

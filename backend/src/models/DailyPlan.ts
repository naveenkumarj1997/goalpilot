import mongoose from 'mongoose';

const plannedTaskSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Can be the original _id of the task/habit or a generated string
  title: { type: String, required: true },
  sourceModule: { type: String, required: true }, // e.g., 'Task', 'Habit', 'Workout', 'Yoga'
  startTime: { type: String }, // e.g., '09:00'
  endTime: { type: String }, // e.g., '10:00'
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
});

const dailyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  tasks: [plannedTaskSchema],
  aiCoaching: {
    type: String
  },
  isFallback: {
    type: Boolean,
    default: false
  },
  successScore: {
    type: Number,
    default: 0
  },
  morningCheckIn: {
    mood: { type: String },
    intent: { type: String },
    completedAt: { type: Date }
  },
  eveningReview: {
    reflection: { type: String },
    rating: { type: Number, min: 1, max: 10 },
    completedAt: { type: Date }
  }
}, { timestamps: true });

// Ensure unique plan per user per day
dailyPlanSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyPlan', dailyPlanSchema);

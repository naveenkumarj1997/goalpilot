import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  durationWeeks: { type: Number, required: true },
  goal: { type: String, required: true },
  weeks: [{
    weekNumber: Number,
    days: [{
      dayNumber: Number,
      focus: String, // e.g., 'Upper Body', 'Rest'
      exercises: [{
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
        sets: Number,
        reps: Number,
        restTime: Number // seconds
      }]
    }]
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('WorkoutPlan', workoutPlanSchema);

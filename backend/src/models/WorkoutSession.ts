import mongoose from 'mongoose';

const workoutSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
  date: { type: Date, default: Date.now },
  durationMinutes: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  completedExercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    setsCompleted: Number,
    repsCompleted: Number
  }],
  xpEarned: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('WorkoutSession', workoutSessionSchema);

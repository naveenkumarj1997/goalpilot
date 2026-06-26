import mongoose from 'mongoose';

const combatRoadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  active: { type: Boolean, default: true },
  title: { type: String, required: true }, // e.g., '12 Week MMA Fundamentals'
  weeks: [{
    weekNumber: { type: Number, required: true },
    focus: { type: String },
    completed: { type: Boolean, default: false },
    tasks: [{
      title: { type: String, required: true },
      type: { type: String, enum: ['Lesson', 'Workout', 'Drill'] },
      duration: { type: Number }, // in minutes
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      referenceId: { type: String } // Could be a Lesson ID
    }]
  }]
}, { timestamps: true });

export default mongoose.model('CombatRoadmap', combatRoadmapSchema);

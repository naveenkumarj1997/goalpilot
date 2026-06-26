import mongoose from 'mongoose';

const combatWorkoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Shadow Boxing', 'Heavy Bag', 'Reflex', 'Conditioning', 'Lesson'] },
  title: { type: String },
  duration: { type: Number, required: true }, // in minutes
  rounds: { type: Number, default: 0 },
  punches: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('CombatWorkoutLog', combatWorkoutLogSchema);

import mongoose from 'mongoose';

const combatLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  discipline: { type: String, enum: ['Boxing', 'Kickboxing', 'Muay Thai', 'MMA', 'Self Defense', 'Conditioning'] },
  category: { type: String, enum: ['Fundamentals', 'Punches', 'Kicks', 'Defense', 'Footwork', 'Clinch', 'Conditioning', 'Drill'] },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  videoUrl: { type: String }, // YouTube URL or ID
  duration: { type: Number }, // in minutes
  content: { type: String }, // Markdown format for mechanics/explanation
  commonMistakes: [{ type: String }],
  order: { type: Number, default: 0 } // For sequencing in the academy
}, { timestamps: true });

export default mongoose.model('CombatLesson', combatLessonSchema);

import mongoose from 'mongoose';

const yogaSessionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YogaLesson',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  durationMinutes: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const YogaSessionLog = mongoose.model('YogaSessionLog', yogaSessionLogSchema);
export default YogaSessionLog;

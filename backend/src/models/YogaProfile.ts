import mongoose from 'mongoose';

const yogaProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  totalMinutesPracticed: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastSessionDate: {
    type: Date
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YogaLesson'
  }]
}, {
  timestamps: true
});

const YogaProfile = mongoose.model('YogaProfile', yogaProfileSchema);
export default YogaProfile;

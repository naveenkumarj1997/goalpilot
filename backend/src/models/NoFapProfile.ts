import mongoose from 'mongoose';

const noFapProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalSuccessfulDays: {
    type: Number,
    default: 0
  },
  relapseCount: {
    type: Number,
    default: 0
  },
  targetGoal: {
    type: Number,
    default: 7 // Default target goal in days
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  lastCheckInDate: {
    type: Date
  }
}, {
  timestamps: true
});

const NoFapProfile = mongoose.model('NoFapProfile', noFapProfileSchema);
export default NoFapProfile;

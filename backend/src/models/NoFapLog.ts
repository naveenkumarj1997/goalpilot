import mongoose from 'mongoose';

const noFapLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  success: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only have one log per day
noFapLogSchema.index({ user: 1, date: 1 }, { unique: true });

const NoFapLog = mongoose.model('NoFapLog', noFapLogSchema);
export default NoFapLog;

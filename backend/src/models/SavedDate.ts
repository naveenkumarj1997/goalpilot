import mongoose from 'mongoose';

const savedDateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  type: {
    type: String,
    enum: ['Age', 'Event'],
    required: true
  }
}, { timestamps: true });

// Prevent duplicate exact entries
savedDateSchema.index({ user: 1, title: 1, targetDate: 1 }, { unique: true });

export default mongoose.model('SavedDate', savedDateSchema);

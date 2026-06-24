import mongoose from 'mongoose';

const marketNewsInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  newsItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketNews',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isSaved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Prevent duplicate interactions per user/news
marketNewsInteractionSchema.index({ user: 1, newsItem: 1 }, { unique: true });

export default mongoose.model('MarketNewsInteraction', marketNewsInteractionSchema);

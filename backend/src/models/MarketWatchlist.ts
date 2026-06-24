import mongoose from 'mongoose';

const marketWatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticker: { type: String, required: true },
  companyName: { type: String },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

marketWatchlistSchema.index({ user: 1, ticker: 1 }, { unique: true });

export default mongoose.model('MarketWatchlist', marketWatchlistSchema);

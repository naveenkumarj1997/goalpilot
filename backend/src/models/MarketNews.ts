import mongoose from 'mongoose';

const marketNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  link: { type: String, required: true },
  summary: { type: String, required: true }, // Initial snippet from RSS
  pubDate: { type: Date, required: true },
  imageUrl: { type: String },
  categories: [{ type: String }],
  hash: { type: String, required: true },

  // AI Generated Fields (Can be null if quota exceeded)
  aiSummary: { type: String, default: null },
  whyItMatters: { type: String, default: null },
  risks: { type: String, default: null },
  opportunities: { type: String, default: null },
  sentiment: { type: String, enum: ['Bullish', 'Bearish', 'Neutral', 'Unknown'], default: 'Unknown' },
  confidenceLevel: { type: Number, default: 0 }, // 0 to 100

  // Fallback boolean to know if AI was used
  aiProcessed: { type: Boolean, default: false }
}, { timestamps: true });

// Prevent duplicate hashes
marketNewsSchema.index({ hash: 1 }, { unique: true });
// Fast query for dashboard
marketNewsSchema.index({ pubDate: -1, categories: 1 });

export default mongoose.model('MarketNews', marketNewsSchema);

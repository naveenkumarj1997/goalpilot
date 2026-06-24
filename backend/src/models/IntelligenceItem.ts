import mongoose from 'mongoose';

const intelligenceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  source: {
    type: String, // e.g., 'TechCrunch', 'HackerNews'
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  pubDate: {
    type: Date,
    required: true
  },
  categories: {
    type: [String], // e.g., ['Technology', 'AI', 'Startups']
    default: []
  },
  imageUrl: {
    type: String,
    default: ''
  },
  hash: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

// Auto-cleanup script uses this: index on pubDate for fast deletion
intelligenceItemSchema.index({ pubDate: 1 });
intelligenceItemSchema.index({ categories: 1 });

export default mongoose.model('IntelligenceItem', intelligenceItemSchema);

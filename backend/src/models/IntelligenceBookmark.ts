import mongoose from 'mongoose';

const intelligenceBookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IntelligenceItem',
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Prevent duplicate bookmarks
intelligenceBookmarkSchema.index({ user: 1, item: 1 }, { unique: true });

export default mongoose.model('IntelligenceBookmark', intelligenceBookmarkSchema);

import mongoose from 'mongoose';

const noFapJournalSchema = new mongoose.Schema({
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
  mood: {
    type: String,
    enum: ['Great', 'Good', 'Neutral', 'Bad', 'Terrible'],
    required: true
  },
  energy: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  motivation: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  notes: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const NoFapJournal = mongoose.model('NoFapJournal', noFapJournalSchema);
export default NoFapJournal;

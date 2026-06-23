import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  durationMinutes: {
    type: Number,
    default: 0,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true,
});

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
export default WatchHistory;

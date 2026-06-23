import mongoose from 'mongoose';

const watchRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Public', 'Private', 'FriendsOnly'],
    default: 'Public',
  },
  maxUsers: {
    type: Number,
    default: 10,
  },
  password: {
    type: String, // Only for Private rooms
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

const WatchRoom = mongoose.model('WatchRoom', watchRoomSchema);
export default WatchRoom;

import mongoose from 'mongoose';

const kartStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  totalRaces: {
    type: Number,
    default: 0
  },
  fastestLap: {
    type: Number,
    default: null // in milliseconds
  },
  favoriteCharacter: {
    type: String,
    default: 'Tiger'
  }
}, { timestamps: true });

export default mongoose.model('KartStats', kartStatsSchema);

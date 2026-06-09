import mongoose, { Document, Schema } from 'mongoose';

export interface IGameStat extends Document {
  user: mongoose.Types.ObjectId;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const gameStatSchema = new Schema<IGameStat>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One stat doc per user
    },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate win rate
gameStatSchema.pre('save', function (this: any, next: any) {
  if (this.gamesPlayed > 0) {
    this.winRate = parseFloat(((this.wins / this.gamesPlayed) * 100).toFixed(2));
  } else {
    this.winRate = 0;
  }
  next();
});

export default mongoose.model<IGameStat>('GameStat', gameStatSchema);

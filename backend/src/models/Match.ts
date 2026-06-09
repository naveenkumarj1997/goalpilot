import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  gameType: string;
  winner?: mongoose.Types.ObjectId;
  loser?: mongoose.Types.ObjectId;
  isDraw: boolean;
  duration: number; // in seconds
  playedAt: Date;
}

const matchSchema = new Schema<IMatch>(
  {
    gameType: {
      type: String,
      required: true,
      enum: ['TicTacToe', 'ConnectFour', 'RockPaperScissors', 'Battleship'],
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    loser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDraw: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 0,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model<IMatch>('Match', matchSchema);

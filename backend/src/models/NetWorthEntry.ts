import mongoose, { Document, Schema } from 'mongoose';

export interface INetWorthEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  cash: number;
  investments: number;
  property: number;
  crypto: number;
  otherAssets: number;
  loans: number;
  creditCards: number;
  otherLiabilities: number;
  totalAssets: number;
  totalLiabilities: number;
  totalNetWorth: number;
  createdAt: Date;
  updatedAt: Date;
}

const NetWorthEntrySchema = new Schema<INetWorthEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  cash: { type: Number, default: 0 },
  investments: { type: Number, default: 0 },
  property: { type: Number, default: 0 },
  crypto: { type: Number, default: 0 },
  otherAssets: { type: Number, default: 0 },
  loans: { type: Number, default: 0 },
  creditCards: { type: Number, default: 0 },
  otherLiabilities: { type: Number, default: 0 },
  totalAssets: { type: Number, default: 0 },
  totalLiabilities: { type: Number, default: 0 },
  totalNetWorth: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const NetWorthEntry = mongoose.model<INetWorthEntry>('NetWorthEntry', NetWorthEntrySchema);

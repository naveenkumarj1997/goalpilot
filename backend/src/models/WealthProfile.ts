import mongoose, { Document, Schema } from 'mongoose';

export interface IWealthProfile extends Document {
  userId: mongoose.Types.ObjectId;
  age: number;
  country: string;
  currency: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  totalDebt: number;
  emergencyFund: number;
  targetEmergencyFund: number;
  riskTolerance: 'Low' | 'Medium' | 'High';
  financialHealthScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const WealthProfileSchema = new Schema<IWealthProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number, default: 25 },
  country: { type: String, default: 'USA' },
  currency: { type: String, default: 'USD' },
  monthlyIncome: { type: Number, default: 0 },
  monthlyExpenses: { type: Number, default: 0 },
  currentSavings: { type: Number, default: 0 },
  totalDebt: { type: Number, default: 0 },
  emergencyFund: { type: Number, default: 0 },
  targetEmergencyFund: { type: Number, default: 0 },
  riskTolerance: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  financialHealthScore: { type: Number, default: 50 }
}, {
  timestamps: true
});

export const WealthProfile = mongoose.model<IWealthProfile>('WealthProfile', WealthProfileSchema);

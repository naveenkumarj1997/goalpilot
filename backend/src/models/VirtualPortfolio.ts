import mongoose from 'mongoose';

const virtualPortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticker: { type: String, required: true },
  companyName: { type: String, required: true },
  buyPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  buyDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  sellPrice: { type: Number },
  sellDate: { type: Date }
}, { timestamps: true });

virtualPortfolioSchema.index({ user: 1, ticker: 1 });

export default mongoose.model('VirtualPortfolio', virtualPortfolioSchema);

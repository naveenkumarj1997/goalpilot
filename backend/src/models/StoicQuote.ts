import mongoose, { Document, Schema } from 'mongoose';

export interface IStoicQuote extends Document {
  quote: string;
  author: string;
  meaning: string;
  practicalApplication: string;
}

const stoicQuoteSchema = new Schema({
  quote: { type: String, required: true },
  author: { type: String, required: true },
  meaning: { type: String, required: true },
  practicalApplication: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IStoicQuote>('StoicQuote', stoicQuoteSchema);

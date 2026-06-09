import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanySource extends Document {
  name: string;
  careerUrl: string;
  scraperType: 'playwright' | 'cheerio' | 'api';
  isActive: boolean;
  lastScannedAt?: Date;
  lastStatus?: string;
}

const companySourceSchema = new Schema<ICompanySource>(
  {
    name: { type: String, required: true, unique: true },
    careerUrl: { type: String, required: true },
    scraperType: { type: String, enum: ['playwright', 'cheerio', 'api'], default: 'cheerio' },
    isActive: { type: Boolean, default: true },
    lastScannedAt: { type: Date },
    lastStatus: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICompanySource>('CompanySource', companySourceSchema);

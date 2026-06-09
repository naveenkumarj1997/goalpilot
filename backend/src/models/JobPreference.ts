import mongoose, { Document, Schema } from 'mongoose';

export interface IJobPreference extends Document {
  user: mongoose.Types.ObjectId;
  titles: string[];
  locations: string[];
  experiences: string[];
  emailAlerts: boolean;
  telegramAlerts: boolean;
  telegramChatId?: string;
}

const jobPreferenceSchema = new Schema<IJobPreference>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    titles: [{ type: String }],
    locations: [{ type: String }],
    experiences: [{ type: String }],
    emailAlerts: { type: Boolean, default: false },
    telegramAlerts: { type: Boolean, default: false },
    telegramChatId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IJobPreference>('JobPreference', jobPreferenceSchema);

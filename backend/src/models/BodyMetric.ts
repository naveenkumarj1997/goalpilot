import mongoose from 'mongoose';

const bodyMetricSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
  chest: { type: Number },
  waist: { type: Number },
  arms: { type: Number },
  legs: { type: Number },
  photoUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('BodyMetric', bodyMetricSchema);

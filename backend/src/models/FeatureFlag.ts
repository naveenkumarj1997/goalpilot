import mongoose, { Document, Schema } from 'mongoose';

export interface IFeatureFlag extends Document {
  moduleName: string;
  isEnabled: boolean;
  isPremium: boolean;
  price: number;
  maintenanceMode: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const featureFlagSchema = new Schema<IFeatureFlag>({
  moduleName: {
    type: String,
    required: true,
    unique: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const FeatureFlag = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
export default FeatureFlag;

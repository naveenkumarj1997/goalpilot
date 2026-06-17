import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemConfig extends Document {
  key: string;
  value: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const systemConfigSchema = new Schema<ISystemConfig>({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const SystemConfig = mongoose.model<ISystemConfig>('SystemConfig', systemConfigSchema);
export default SystemConfig;

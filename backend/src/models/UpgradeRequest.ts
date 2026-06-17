import mongoose, { Document, Schema } from 'mongoose';

export interface IUpgradeRequest extends Document {
  user: mongoose.Types.ObjectId;
  status: 'Pending' | 'Approved' | 'Rejected';
  moduleName: string;
  pricePaid?: number;
  transactionReference?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const upgradeRequestSchema = new Schema<IUpgradeRequest>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  moduleName: {
    type: String,
    required: true
  },
  pricePaid: {
    type: Number
  },
  transactionReference: {
    type: String
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const UpgradeRequest = mongoose.model<IUpgradeRequest>('UpgradeRequest', upgradeRequestSchema);
export default UpgradeRequest;
